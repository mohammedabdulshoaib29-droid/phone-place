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
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (token) {
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
      navigate(from);
    }
  }, [token, navigate, location]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

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
      const result = await sendOTP(cleanPhone, email);
      setPhone(cleanPhone);
      setStep('otp');
      setOtpSent(true);
      setTimeLeft(120);
      setInfo(result.message);
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
      const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || authError || 'Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setInfo('');
    setOtp('');
    try {
      const result = await sendOTP(phone, email);
      setTimeLeft(120);
      setInfo(result.message);
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
              {step === 'phone' ? 'Login' : 'Verify OTP'}
            </h1>
            <p className="text-sm text-slate-300">
              {step === 'phone'
                ? 'Enter your mobile number and email to receive your OTP'
                : 'Enter the OTP sent to your email'}
            </p>
          </div>

          {(error || authError) && (
            <div className="mb-6 rounded border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error || authError}
            </div>
          )}

          {info && (
            <div className="mb-6 rounded border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {info}
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
                  className="text-sm font-medium text-emerald-400 hover:text-emerald-300"
                >
                  Change Number
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0 || loading}
                  className={`text-sm font-medium ${
                    timeLeft > 0
                      ? 'cursor-not-allowed text-slate-500'
                      : 'text-emerald-400 hover:text-emerald-300'
                  }`}
                >
                  {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          {import.meta.env.MODE !== 'production' && otpSent && (
            <div className="mt-6 rounded border border-blue-500/30 bg-blue-500/10 p-3 text-xs text-blue-300">
              Dev mode note: the generated OTP is returned by the API when not in production.
            </div>
          )}

          <div className="mt-8 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
            <p>
              New to Phone Palace?
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="ml-1 font-medium text-emerald-400 hover:text-emerald-300"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 text-center text-xs text-slate-400">
          <div>Secure email OTP</div>
          <div>One-time verification</div>
        </div>
      </div>
    </div>
  );
}
