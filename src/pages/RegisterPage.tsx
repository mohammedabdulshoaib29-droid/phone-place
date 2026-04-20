import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Breadcrumbs from '../components/Breadcrumbs';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login, sendOTP, token, loading } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Countdown timer for OTP
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address to receive OTP.');
      return;
    }

    try {
      await sendOTP(cleanPhone, email);
      setPhone(cleanPhone);
      setStep('otp');
      setTimeLeft(120); // 2 minutes countdown
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    try {
      // Verify OTP and auto-login
      await login(phone, otp);
      setStep('profile');
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Profile is optional, user is already logged in
    navigate('/');
  };

  const handleResendOtp = async () => {
    setError('');
    setOtp('');
    try {
      await sendOTP(phone, email);
      setTimeLeft(120);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    }
  };

  if (token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Breadcrumbs />

      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-slate-900 border border-emerald-500/30 rounded-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-emerald-400 mb-2">
              {step === 'phone'
                ? 'Create Account'
                : step === 'otp'
                ? 'Verify Number'
                : 'Complete Profile'}
            </h1>
            <p className="text-slate-300 text-sm">
              {step === 'phone'
                ? 'Join Phone Palace today'
                : step === 'otp'
                ? 'Enter the OTP sent to your phone'
                : 'Add your details to get started'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Phone Input */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-slate-800 border border-r-0 border-emerald-500/30 rounded-l text-emerald-400 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(value);
                    }}
                    className="flex-1 px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded-r text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded transition-all"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded text-white text-center text-2xl tracking-widest placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
                <p className="mt-2 text-xs text-slate-400">
                  Sent to +91{phone}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded transition-all"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timeLeft > 0 || loading}
                className={`w-full text-sm font-medium py-2 rounded border ${
                  timeLeft > 0
                    ? 'text-slate-500 border-slate-600 cursor-not-allowed'
                    : 'text-emerald-400 border-emerald-500/30 hover:border-emerald-500'
                }`}
              >
                {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend OTP'}
              </button>
            </form>
          )}

          {/* Step 3: Profile Setup */}
          {step === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-emerald-500/30 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded transition-all"
              >
                Complete Setup
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full text-emerald-400 font-medium py-2 rounded border border-emerald-500/30 hover:border-emerald-500"
              >
                Skip for Now
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700 text-center text-sm text-slate-400">
            <p>
              Already have an account?
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="ml-1 text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
