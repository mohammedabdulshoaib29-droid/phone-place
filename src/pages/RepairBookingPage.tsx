import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../hooks/useAuth';
import { createRepairBooking, REPAIR_ISSUE_LABELS, SERVICE_TYPE_LABELS } from '../utils/repairs';
import type { RepairBooking, RepairIssueType, RepairServiceType } from '../types/repair';

const serviceTypes: RepairServiceType[] = ['walk-in', 'pickup', 'doorstep'];
const issueTypes = Object.keys(REPAIR_ISSUE_LABELS) as RepairIssueType[];

export default function RepairBookingPage() {
  const { user } = useAuth();
  const [booking, setBooking] = useState<RepairBooking | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    brand: '',
    model: '',
    problemType: 'screen' as RepairIssueType,
    issueDescription: '',
    photos: [] as string[],
    serviceType: 'walk-in' as RepairServiceType,
    preferredDate: '',
    preferredTime: '',
    address: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const requiresAddress = formData.serviceType !== 'walk-in';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!formData.customerName.trim() || !formData.phone.trim() || !formData.brand.trim() || !formData.model.trim()) {
      setError('Please fill in your name, phone number, brand, and model.');
      return;
    }

    if (!formData.preferredDate || !formData.preferredTime) {
      setError('Please choose your preferred service date and time.');
      return;
    }

    if (requiresAddress && !formData.address.trim()) {
      setError('Pickup and doorstep service require a service address.');
      return;
    }

    const createdBooking = createRepairBooking(formData);
    setBooking(createdBooking);
  };

  if (booking) {
    return (
      <main className="pt-24 pb-20 min-h-screen px-6">
        <Breadcrumbs />
        <div className="max-w-3xl mx-auto mt-8">
          <div className="glass-card p-8 md:p-10">
            <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">Repair Confirmed</p>
            <h1 className="font-display text-ivory text-4xl md:text-5xl mb-4" style={{ fontStyle: 'italic', fontWeight: 700 }}>
              Booking submitted
            </h1>
            <p className="font-body text-silver text-sm leading-7 max-w-2xl">
              Your repair request is live. We generated a repair ticket, saved the intake details,
              and prepared the first status update for WhatsApp, SMS, and email workflows.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
              <div className="rounded-2xl border border-gold/20 bg-charcoal/60 p-5">
                <p className="font-body text-silver text-xs uppercase tracking-[0.25em] mb-2">Repair ID</p>
                <p className="font-display text-gold text-2xl" style={{ fontWeight: 700 }}>{booking.id}</p>
              </div>
              <div className="rounded-2xl border border-gold/20 bg-charcoal/60 p-5">
                <p className="font-body text-silver text-xs uppercase tracking-[0.25em] mb-2">Estimated Completion</p>
                <p className="font-body text-ivory text-lg">
                  {new Date(booking.estimatedCompletionDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="rounded-2xl border border-gold/10 p-4">
                <p className="font-body text-silver text-xs uppercase tracking-[0.2em] mb-2">Device</p>
                <p className="font-body text-ivory text-sm">{booking.brand} {booking.model}</p>
              </div>
              <div className="rounded-2xl border border-gold/10 p-4">
                <p className="font-body text-silver text-xs uppercase tracking-[0.2em] mb-2">Service Type</p>
                <p className="font-body text-ivory text-sm">{SERVICE_TYPE_LABELS[booking.serviceType]}</p>
              </div>
              <div className="rounded-2xl border border-gold/10 p-4">
                <p className="font-body text-silver text-xs uppercase tracking-[0.2em] mb-2">Issue</p>
                <p className="font-body text-ivory text-sm">{REPAIR_ISSUE_LABELS[booking.problemType]}</p>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to={`/track-repair?repairId=${encodeURIComponent(booking.id)}&phone=${encodeURIComponent(booking.phone)}`}
                className="btn-gold text-center"
              >
                Track Repair
              </Link>
              <Link
                to="/account"
                className="border border-gold/30 px-6 py-4 text-center text-silver text-xs uppercase tracking-[0.25em] hover:bg-gold/10 transition-colors"
              >
                Go To My Account
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto mt-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section>
            <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">Book Repair</p>
            <h1 className="font-display text-ivory text-4xl md:text-6xl mb-4" style={{ fontStyle: 'italic', fontWeight: 700 }}>
              Repair intake built for a real service desk
            </h1>
            <p className="font-body text-silver text-sm md:text-base leading-7 max-w-2xl">
              Capture the customer details, device issue, service mode, preferred slot,
              and photo evidence in one clean flow. After submission we generate a repair ID
              so the customer can track every update.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <label>
                  <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Customer Name</span>
                  <input
                    value={formData.customerName}
                    onChange={(event) => setFormData((current) => ({ ...current, customerName: event.target.value }))}
                    className="input-luxury"
                    placeholder="Full name"
                  />
                </label>
                <label>
                  <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Phone Number</span>
                  <input
                    value={formData.phone}
                    onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                    className="input-luxury"
                    placeholder="10-digit mobile"
                  />
                </label>
                <label>
                  <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Email</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                    className="input-luxury"
                    placeholder="name@example.com"
                  />
                </label>
                <label>
                  <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Brand</span>
                  <input
                    value={formData.brand}
                    onChange={(event) => setFormData((current) => ({ ...current, brand: event.target.value }))}
                    className="input-luxury"
                    placeholder="Apple, Samsung, OnePlus"
                  />
                </label>
                <label>
                  <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Model</span>
                  <input
                    value={formData.model}
                    onChange={(event) => setFormData((current) => ({ ...current, model: event.target.value }))}
                    className="input-luxury"
                    placeholder="iPhone 13, S22, 12R"
                  />
                </label>
                <label>
                  <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Problem Type</span>
                  <select
                    value={formData.problemType}
                    onChange={(event) =>
                      setFormData((current) => ({ ...current, problemType: event.target.value as RepairIssueType }))
                    }
                    className="input-luxury bg-carbon"
                  >
                    {issueTypes.map((issueType) => (
                      <option key={issueType} value={issueType} className="bg-charcoal">
                        {REPAIR_ISSUE_LABELS[issueType]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Issue Description</span>
                <textarea
                  rows={4}
                  value={formData.issueDescription}
                  onChange={(event) => setFormData((current) => ({ ...current, issueDescription: event.target.value }))}
                  className="w-full rounded-2xl border border-gold/20 bg-charcoal/50 px-5 py-4 text-sm text-ivory outline-none focus:border-gold/50"
                  placeholder="Explain the issue, what happened, and any symptoms you noticed."
                />
              </label>

              <label className="block">
                <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Upload Device Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      photos: Array.from(event.target.files ?? []).map((file) => file.name),
                    }))
                  }
                  className="block w-full text-sm text-silver file:mr-4 file:rounded-full file:border-0 file:bg-gold file:px-4 file:py-2 file:text-xs file:font-semibold file:text-carbon"
                />
                {formData.photos.length > 0 && (
                  <p className="mt-3 font-body text-silver text-xs">
                    {formData.photos.length} photo{formData.photos.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </label>

              <div>
                <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-4">Service Type</span>
                <div className="grid md:grid-cols-3 gap-4">
                  {serviceTypes.map((serviceType) => (
                    <button
                      key={serviceType}
                      type="button"
                      onClick={() => setFormData((current) => ({ ...current, serviceType }))}
                      className={`rounded-2xl border p-5 text-left transition-all ${
                        formData.serviceType === serviceType
                          ? 'border-gold bg-gold/10'
                          : 'border-gold/15 bg-charcoal/40 hover:border-gold/40'
                      }`}
                    >
                      <p className="font-body text-ivory text-sm font-semibold">{SERVICE_TYPE_LABELS[serviceType]}</p>
                      <p className="font-body text-silver text-xs mt-2">
                        {serviceType === 'walk-in'
                          ? 'Customer visits the store'
                          : serviceType === 'pickup'
                            ? 'Device collected from address'
                            : 'Technician visit at customer location'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <label>
                  <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Preferred Date</span>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(event) => setFormData((current) => ({ ...current, preferredDate: event.target.value }))}
                    className="input-luxury"
                  />
                </label>
                <label>
                  <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Preferred Time</span>
                  <input
                    type="time"
                    value={formData.preferredTime}
                    onChange={(event) => setFormData((current) => ({ ...current, preferredTime: event.target.value }))}
                    className="input-luxury"
                  />
                </label>
              </div>

              {requiresAddress && (
                <label className="block">
                  <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Address</span>
                  <textarea
                    rows={3}
                    value={formData.address}
                    onChange={(event) => setFormData((current) => ({ ...current, address: event.target.value }))}
                    className="w-full rounded-2xl border border-gold/20 bg-charcoal/50 px-5 py-4 text-sm text-ivory outline-none focus:border-gold/50"
                    placeholder="House number, street, area, city, pin code"
                  />
                </label>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button type="submit" className="btn-gold">
                Generate Repair Ticket
              </button>
            </form>
          </section>

          <aside className="space-y-6">
            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-4">What Happens Next</p>
              <div className="space-y-4">
                {[
                  'Booking confirmation with repair ID',
                  'Inspection and estimate update',
                  'Approval request before paid repair work',
                  'Progress timeline until pickup or delivery',
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-gold" />
                    <p className="font-body text-silver text-sm leading-6">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-4">Trust Signals</p>
              <div className="grid gap-3">
                {[
                  'Same-day service on common repairs',
                  'Genuine parts with warranty support',
                  'Pickup and drop across Hyderabad',
                  'Live status tracking from booking to handover',
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-gold/10 px-4 py-3">
                    <p className="font-body text-ivory text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
