import { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

interface ReferralStats {
  referralCode: string;
  referrals: number;
  earnings: number;
  successfulOrders: number;
  pendingRewards: number;
}

interface ReferralHistory {
  id: string;
  referredName: string;
  referredEmail: string;
  status: 'pending' | 'completed' | 'expired';
  date: string;
  reward: number;
}

export default function ReferralProgram() {
  const [stats, setStats] = useState<ReferralStats>({
    referralCode: 'RAJ-KUMAR-2025',
    referrals: 5,
    earnings: 1500,
    successfulOrders: 3,
    pendingRewards: 2,
  });

  const [history] = useState<ReferralHistory[]>([
    {
      id: '1',
      referredName: 'Priya Singh',
      referredEmail: 'priya@example.com',
      status: 'completed',
      date: '2025-04-15',
      reward: 500,
    },
    {
      id: '2',
      referredName: 'Amit Patel',
      referredEmail: 'amit@example.com',
      status: 'completed',
      date: '2025-04-12',
      reward: 500,
    },
    {
      id: '3',
      referredName: 'Deepak Kumar',
      referredEmail: 'deepak@example.com',
      status: 'pending',
      date: '2025-04-18',
      reward: 250,
    },
    {
      id: '4',
      referredName: 'Ananya Sharma',
      referredEmail: 'ananya@example.com',
      status: 'pending',
      date: '2025-04-19',
      reward: 250,
    },
  ]);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const copyCode = () => {
    navigator.clipboard.writeText(stats.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-3"
            style={{ letterSpacing: '0.4em' }}
          >
            Grow with Us
          </p>
          <h1
            className="font-display text-ivory"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontStyle: 'italic',
              fontWeight: 700,
            }}
          >
            Referral Program
          </h1>
          <p className="font-body text-silver text-sm mt-4 max-w-2xl mx-auto">
            Earn rewards by inviting friends to Phone Palace. Get ₹500 for every successful referral!
          </p>
          <div className="gold-line mt-5 mx-auto" style={{ width: '60px' }} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-6">
            <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">Total Referrals</p>
            <p className="font-display text-gold text-3xl font-bold">{stats.referrals}</p>
            <p className="font-body text-silver/50 text-xs mt-2">Friends invited</p>
          </div>

          <div className="glass-card p-6">
            <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">Earnings</p>
            <p className="font-display text-green-500 text-3xl font-bold">₹{stats.earnings.toLocaleString('en-IN')}</p>
            <p className="font-body text-silver/50 text-xs mt-2">Total rewards earned</p>
          </div>

          <div className="glass-card p-6">
            <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">Successful Orders</p>
            <p className="font-display text-blue-500 text-3xl font-bold">{stats.successfulOrders}</p>
            <p className="font-body text-silver/50 text-xs mt-2">Friends who purchased</p>
          </div>

          <div className="glass-card p-6">
            <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">Pending Rewards</p>
            <p className="font-display text-yellow-500 text-3xl font-bold">₹{stats.pendingRewards * 250}</p>
            <p className="font-body text-silver/50 text-xs mt-2">Awaiting first purchase</p>
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="glass-card p-8 mb-12">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-6"
            style={{ letterSpacing: '0.4em' }}
          >
            Your Referral Code
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <p className="font-body text-silver text-xs uppercase tracking-widest mb-3">Share this code with friends</p>
              <div className="flex gap-3 items-center">
                <code className="flex-1 bg-carbon/50 px-4 py-3 rounded border border-gold/20 font-mono text-gold text-sm font-bold">
                  {stats.referralCode}
                </code>
                <button
                  onClick={copyCode}
                  className="px-4 py-3 bg-gold text-carbon hover:bg-gold-pale transition-colors font-body text-xs uppercase tracking-widest font-semibold"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-8 pt-8 border-t border-gold/20">
            <p
              className="font-body text-gold text-xs uppercase tracking-widest mb-6"
              style={{ letterSpacing: '0.4em' }}
            >
              How It Works
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <span className="text-3xl mb-3 block">1️⃣</span>
                <p className="font-body text-ivory font-semibold text-sm mb-2">Share Your Code</p>
                <p className="font-body text-silver text-xs">
                  Send your unique referral code to friends via WhatsApp, email, or social media
                </p>
              </div>
              <div className="text-center">
                <span className="text-3xl mb-3 block">2️⃣</span>
                <p className="font-body text-ivory font-semibold text-sm mb-2">Friend Makes Purchase</p>
                <p className="font-body text-silver text-xs">
                  They use your code at checkout to get a special discount
                </p>
              </div>
              <div className="text-center">
                <span className="text-3xl mb-3 block">3️⃣</span>
                <p className="font-body text-ivory font-semibold text-sm mb-2">Earn Rewards</p>
                <p className="font-body text-silver text-xs">
                  You get ₹500 credit when their order is delivered
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="glass-card p-8 mb-12">
          <p
            className="font-body text-gold text-xs uppercase tracking-widest mb-6"
            style={{ letterSpacing: '0.4em' }}
          >
            Referral History
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gold/20">
                  <th className="text-left py-3 pr-4 font-body text-silver text-xs uppercase">Name</th>
                  <th className="text-left py-3 pr-4 font-body text-silver text-xs uppercase">Date</th>
                  <th className="text-left py-3 pr-4 font-body text-silver text-xs uppercase">Status</th>
                  <th className="text-right py-3 font-body text-silver text-xs uppercase">Reward</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-gold/10 hover:bg-gold/5 transition-colors">
                    <td className="py-4 pr-4">
                      <p className="font-body text-ivory font-semibold text-sm">{item.referredName}</p>
                      <p className="font-body text-silver/50 text-xs">{item.referredEmail}</p>
                    </td>
                    <td className="py-4 pr-4 font-body text-silver text-sm">
                      {new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'completed'
                            ? 'bg-green-600/20 text-green-400'
                            : item.status === 'pending'
                            ? 'bg-yellow-600/20 text-yellow-400'
                            : 'bg-red-600/20 text-red-400'
                        }`}
                      >
                        {item.status === 'completed' ? '✓ Completed' : item.status === 'pending' ? '⏳ Pending' : '❌ Expired'}
                      </span>
                    </td>
                    <td className="py-4 text-right font-display text-gold font-bold">₹{item.reward}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="font-body text-silver text-sm mb-6">
            Ready to earn more? Share your code and start inviting friends!
          </p>
          <button className="btn-gold">📤 Share on WhatsApp</button>
        </div>
      </div>
    </main>
  );
}
