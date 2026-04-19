import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function BrandStatement() {
  const ref = useScrollAnimation();

  return (
    <section
      id="about"
      className="py-28 md:py-40 px-6 text-center fade-section"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="max-w-3xl mx-auto">
        {/* Top gold line */}
        <div className="gold-line mb-12 mx-auto" style={{ width: '120px' }} />

        <p
          className="font-display text-ivory leading-snug"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.8rem)',
            fontStyle: 'italic',
            fontWeight: 400,
          }}
        >
          "Crafted for the Discerning Few"
        </p>

        <p
          className="font-body text-silver mt-6 text-sm leading-relaxed tracking-wide"
          style={{ letterSpacing: '0.05em' }}
        >
          Every product in our collection is a testament to uncompromising quality —<br className="hidden md:block" />
          engineered for those who refuse to settle for ordinary.
        </p>

        {/* Bottom gold line */}
        <div className="gold-line mt-12 mx-auto" style={{ width: '120px' }} />
      </div>
    </section>
  );
}
