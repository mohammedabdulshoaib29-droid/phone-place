import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Breadcrumbs from '../components/Breadcrumbs';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login, sendOTP, token, loading, error: authError } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

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
      setTimeLeft(120);
    } catch (err: any) {
      setError(err.message || authError || 'Failed to send OTP');
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
      await login(phone, otp);
      setStep('profile');
    } catch (err: any) {
      setError(err.message || authError || 'Invalid OTP');
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    navigate('/');
  };

  const handleResendOtp = async () => {
    setError('');
    setOtp('');
    try {
      await sendOTP(phone, email);
      setTimeLeft(120);
    } catch (err: any) {
      setError(err.message || authError || 'Failed to resend OTP');
    }
  };

  if (token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Breadcrumbs />

      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-lg border border-emerald-500/30 bg-slate-900 p-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-emerald-400">
              {step === 'phone'
                ? 'Create Account'
                : step === 'otp'
                  ? 'Verify OTP'
                  : 'Complete Profile'}
            </h1>
            <p className="text-sm text-slate-300">
              {step === 'phone'
                ? 'Enter your mobile number and email to receive your OTP'
                : step === 'otp'
                  ? 'Enter the OTP sent to your email'
                  : 'Add your details to get started'}
            </p>
          </div>

          {(error || authError) && (
            <div className="mb-6 rounded border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error || authError}
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-emerald-300">
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l border border-r-0 border-emerald-500/30 bg-slate-800 px-4 font-medium text-emerald-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 rounded-r border border-emerald-500/30 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">10-digit number without country code</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-emerald-300">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border border-emerald-500/30 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <p className="mt-2 text-xs text-slate-400">We'll send your OTP here</p>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length !== 10 || !email}
                className="w-full rounded bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 font-semibold text-white transition-all disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 hover:from-emerald-600 hover:to-emerald-700"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-emerald-300">
                  Enter OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full rounded border border-emerald-500/30 bg-slate-800 px-4 py-3 text-center text-2xl tracking-widest text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <p className="mt-2 text-xs text-slate-400">Sent to {email}</p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 font-semibold text-white transition-all disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 hover:from-emerald-600 hover:to-emerald-700"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={timeLeft > 0 || loading}
                className={`w-full rounded border py-2 text-sm font-medium ${
                  timeLeft > 0
                    ? 'cursor-not-allowed border-slate-600 text-slate-500'
                    : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500'
                }`}
              >
                {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend OTP'}
              </button>
            </form>
          )}

          {step === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-emerald-300">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border border-emerald-500/30 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-emerald-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full rounded border border-emerald-500/20 bg-slate-800 px-4 py-3 text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 font-semibold text-white transition-all hover:from-emerald-600 hover:to-emerald-700"
              >
                Complete Setup
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full rounded border border-emerald-500/30 py-2 font-medium text-emerald-400 hover:border-emerald-500"
              >
                Skip for Now
              </button>
            </form>
          )}

          <div className="mt-8 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
            <p>
              Already have an account?
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="ml-1 font-medium text-emerald-400 hover:text-emerald-300"
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
