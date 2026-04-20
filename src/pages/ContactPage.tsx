import { useEffect, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen px-6">
      <Breadcrumbs />

      <div className="max-w-6xl mx-auto mt-8">
        <div className="text-center mb-12">
          <p className="font-body text-gold text-xs uppercase tracking-[0.35em] mb-4">Contact</p>
          <h1 className="font-display text-ivory text-4xl md:text-6xl mb-4" style={{ fontStyle: 'italic', fontWeight: 700 }}>
            Real store details, support channels, and service hours
          </h1>
          <p className="font-body text-silver text-sm md:text-base leading-7 max-w-3xl mx-auto">
            This page is designed to answer the practical questions customers care about first:
            where the shop is, when it is open, how fast you respond, and how to start a repair or order conversation.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="space-y-6">
            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-4">Store Details</p>
              <div className="space-y-4 text-sm text-silver">
                <p>
                  <span className="block text-ivory mb-1">Address</span>
                  2-3-64/1, Amberpet Main Road, Hyderabad, Telangana 500013
                </p>
                <p>
                  <span className="block text-ivory mb-1">Phone</span>
                  +91 79970 00166
                </p>
                <p>
                  <span className="block text-ivory mb-1">Email</span>
                  support@phonepalace.in
                </p>
                <p>
                  <span className="block text-ivory mb-1">WhatsApp</span>
                  Response in about 10 to 20 minutes during store hours
                </p>
              </div>
            </div>

            <div className="glass-card p-6">
              <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-4">Business Hours</p>
              <div className="space-y-3 text-sm text-silver">
                <div className="flex justify-between gap-4"><span>Monday to Saturday</span><span className="text-ivory">10:00 AM - 9:00 PM</span></div>
                <div className="flex justify-between gap-4"><span>Sunday</span><span className="text-ivory">11:00 AM - 7:00 PM</span></div>
                <div className="flex justify-between gap-4"><span>Pickup and Drop</span><span className="text-ivory">12:00 PM - 8:00 PM</span></div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gold/15">
              <iframe
                title="Phone Palace location map"
                src="https://maps.google.com/maps?q=Amberpet%20Hyderabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="h-[320px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>

          <section className="glass-card p-6 md:p-8">
            <p className="font-body text-gold text-xs uppercase tracking-[0.25em] mb-4">Contact Form</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block">
                <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Name</span>
                <input className="input-luxury" placeholder="Your name" />
              </label>
              <label className="block">
                <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Phone or Email</span>
                <input className="input-luxury" placeholder="Mobile number or email" />
              </label>
              <label className="block">
                <span className="block font-body text-silver text-xs uppercase tracking-[0.2em] mb-3">Message</span>
                <textarea
                  rows={5}
                  className="w-full rounded-2xl border border-gold/20 bg-charcoal/50 px-5 py-4 text-sm text-ivory outline-none focus:border-gold/50"
                  placeholder="Tell us if this is a repair question, order help request, or product enquiry."
                />
              </label>
              <button type="submit" className="btn-gold">Send Message</button>
              {submitted && (
                <p className="text-sm text-emerald-400">
                  Message captured. In production this form can be wired to email, CRM, or WhatsApp handoff.
                </p>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
