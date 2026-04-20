import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Breadcrumbs from '../components/Breadcrumbs';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sendOTP, token, error: authError, loading } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from);
    }
  }, [token, navigate, location]);

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

    try {
      await sendOTP(cleanPhone);
      setPhone(cleanPhone);
      setStep('otp');
      setOtpSent(true);
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
      await login(phone, otp);
      // Redirect to checkout if coming from there
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setOtp('');
    try {
      await sendOTP(phone);
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
              {step === 'phone' ? 'Login' : 'Verify OTP'}
            </h1>
            <p className="text-slate-300 text-sm">
              {step === 'phone'
                ? 'Enter your phone number to get started'
                : 'Enter the OTP sent to your phone'}
            </p>
          </div>

          {/* Error Message */}
          {(error || authError) && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-300 text-sm">
              {error || authError}
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
                <p className="mt-2 text-xs text-slate-400">
                  We'll send a 6-digit OTP to verify your number
                </p>
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
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setPhone('');
                    setOtp('');
                    setOtpSent(false);
                    setTimeLeft(0);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                >
                  Change Number
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0 || loading}
                  className={`text-sm font-medium ${
                    timeLeft > 0
                      ? 'text-slate-500 cursor-not-allowed'
                      : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          {/* Test OTP Note (Development Only) */}
          {process.env.NODE_ENV !== 'production' && otpSent && (
            <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-blue-300 text-xs">
              💡 <strong>Dev Mode:</strong> Use OTP: 123456
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-700 text-center text-sm text-slate-400">
            <p>
              New to Phone Palace?
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="ml-1 text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center text-xs text-slate-400">
          <div>🔒 Secure OTP Login</div>
          <div>✅ One-time Verification</div>
        </div>
      </div>
    </div>
  );
}
