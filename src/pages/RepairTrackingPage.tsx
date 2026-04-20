import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { findRepairBooking, REPAIR_ISSUE_LABELS, REPAIR_STATUS_LABELS, REPAIR_STATUS_ORDER, SERVICE_TYPE_LABELS } from '../utils/repairs';
import type { RepairBooking } from '../types/repair';

const statusDescriptions = {
  'booking-received': 'Request captured and waiting for intake confirmation.',
  'device-collected': 'Device has been checked in or collected by our team.',
  'under-inspection': 'Technician is diagnosing the issue and preparing the estimate.',
  'quote-sent': 'Cost estimate has been prepared and shared.',
  'waiting-for-approval': 'Repair is paused until customer approval is received.',
  'repair-in-progress': 'Repair is actively being completed by the technician.',
  'quality-check': 'Device is being tested before handover.',
  'ready-for-pickup': 'Repair is complete and ready for pickup or final delivery.',
  delivered: 'Repair handed over to the customer.',
} as const;

export default function RepairTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [repairId, setRepairId] = useState(searchParams.get('repairId') ?? '');
  const [phone, setPhone] = useState(searchParams.get('phone') ?? '');
  const [repair, setRepair] = useState<RepairBooking | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const queryRepairId = searchParams.get('repairId');
    const queryPhone = searchParams.get('phone');

    if (queryRepairId && queryPhone) {
      const match = findRepairBooking(queryRepairId, queryPhone);
      setRepair(match);
      setError(match ? '' : 'No repair matched that repair ID and phone number.');
    }
  }, [searchParams]);

  const handleLookup = (event: React.FormEvent) => {
    event.preventDefault();

    if (!repairId.trim() || !phone.trim()) {
      setError('Enter the repair ID and the customer phone number to continue.');
      setRepair(null);
      return;
    }

    const match = findRepairBooking(repairId, phone);
    setRepair(match);
    setError(match ? '' : 'No repair matched that repair ID and phone number.');

    if (match) {
      setSearchParams({ repairId: repairId.trim(), phone: phone.trim() });
    }
  };

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-6xl mx-auto mt-8">
        <div className="text-center mb-10">
          <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">Track Repair</p>
          <h1 className="font-display text-ivory text-4xl md:text-6xl mb-4" style={{ fontStyle: 'italic', fontWeight: 700 }}>
            Live repair progress, not vague updates
          </h1>
          <p className="font-body text-silver text-sm md:text-base leading-7 max-w-3xl mx-auto">
            Customers can track their repair using the repair ID and phone number. The page shows
            the device details, status timeline, cost estimate, approval state, technician notes,
            and the estimated completion window.
          </p>
        </div>

        <form onSubmit={handleLookup} className="glass-card p-6 md:p-8 grid gap-6 md:grid-cols-[1fr_1fr_auto] items-end">
          <label>
            <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Repair ID</span>
            <input
              value={repairId}
              onChange={(event) => setRepairId(event.target.value)}
              className="input-luxury"
              placeholder="RPR-20260420-1842"
            />
          </label>
          <label>
            <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Phone Number</span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="input-luxury"
              placeholder="10-digit mobile"
            />
          </label>
          <button type="submit" className="btn-gold md:self-end">
            Track Now
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        {!repair && (
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {[
              'Booking Received',
              'Quote Sent',
              'Ready for Pickup',
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-gold/15 bg-charcoal/50 p-6">
                <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-3">{item}</p>
                <p className="font-body text-silver text-sm leading-7">
                  The tracking page is ready for real repair IDs. Demo records are available too:
                  try `RPR-20260420-1842` with phone `9876543210`.
                </p>
              </div>
            ))}
          </div>
        )}

        {repair && (
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 mt-10">
            <section className="space-y-6">
              <div className="glass-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-3">Current Status</p>
                    <h2 className="font-display text-ivory text-3xl" style={{ fontStyle: 'italic', fontWeight: 700 }}>
                      {REPAIR_STATUS_LABELS[repair.status]}
                    </h2>
                    <p className="font-body text-silver text-sm mt-3 leading-7">
                      {statusDescriptions[repair.status]}
                    </p>
                  </div>
                  <span className="rounded-full border border-gold/25 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-gold">
                    {repair.id}
                  </span>
                </div>
              </div>

              <div className="glass-card p-6">
                <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-4">Repair Summary</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <p className="font-body text-silver text-xs uppercase tracking-[0.18em] mb-2">Device</p>
                    <p className="font-body text-ivory text-sm">{repair.brand} {repair.model}</p>
                  </div>
                  <div>
                    <p className="font-body text-silver text-xs uppercase tracking-[0.18em] mb-2">Issue</p>
                    <p className="font-body text-ivory text-sm">{REPAIR_ISSUE_LABELS[repair.problemType]}</p>
                  </div>
                  <div>
                    <p className="font-body text-silver text-xs uppercase tracking-[0.18em] mb-2">Service Type</p>
                    <p className="font-body text-ivory text-sm">{SERVICE_TYPE_LABELS[repair.serviceType]}</p>
                  </div>
                  <div>
                    <p className="font-body text-silver text-xs uppercase tracking-[0.18em] mb-2">Estimated Completion</p>
                    <p className="font-body text-ivory text-sm">
                      {new Date(repair.estimatedCompletionDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="font-body text-silver text-xs uppercase tracking-[0.18em] mb-2">Approval</p>
                    <p className="font-body text-ivory text-sm capitalize">{repair.approvalStatus.replace('-', ' ')}</p>
                  </div>
                  <div>
                    <p className="font-body text-silver text-xs uppercase tracking-[0.18em] mb-2">Payment</p>
                    <p className="font-body text-ivory text-sm capitalize">{repair.paymentStatus.replace('-', ' ')}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-4">Technician Notes</p>
                <p className="font-body text-silver text-sm leading-7">{repair.technicianNotes}</p>
                <div className="mt-5 rounded-2xl border border-gold/10 bg-charcoal/50 p-4">
                  <p className="font-body text-silver text-xs uppercase tracking-[0.18em] mb-2">Cost Estimate</p>
                  <p className="font-display text-gold text-2xl" style={{ fontWeight: 700 }}>
                    Rs. {repair.costEstimate.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </section>

            <section className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-5">Timeline</p>
              <div className="space-y-5">
                {REPAIR_STATUS_ORDER.map((status) => {
                  const timelineItem = repair.timeline.find((item) => item.status === status);
                  const currentIndex = REPAIR_STATUS_ORDER.indexOf(repair.status);
                  const itemIndex = REPAIR_STATUS_ORDER.indexOf(status);
                  const isCompleted = itemIndex <= currentIndex;

                  return (
                    <div key={status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={`mt-1 h-4 w-4 rounded-full border ${
                            isCompleted ? 'border-gold bg-gold' : 'border-gold/20 bg-transparent'
                          }`}
                        />
                        {status !== REPAIR_STATUS_ORDER[REPAIR_STATUS_ORDER.length - 1] && (
                          <span className={`mt-2 h-full w-px ${isCompleted ? 'bg-gold/40' : 'bg-gold/10'}`} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`font-body text-sm ${isCompleted ? 'text-ivory' : 'text-silver/60'}`}>
                          {REPAIR_STATUS_LABELS[status]}
                        </p>
                        <p className="font-body text-silver text-xs mt-1 leading-6">
                          {timelineItem?.note ?? 'Pending update from the service team.'}
                        </p>
                        {timelineItem && (
                          <p className="font-body text-silver/60 text-xs mt-2">
                            {new Date(timelineItem.timestamp).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-gold/10">
                <Link to="/contact" className="font-body text-gold text-xs uppercase tracking-[0.25em] hover:text-gold-pale">
                  Need help? Contact the service desk
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
