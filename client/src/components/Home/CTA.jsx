import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="section cta-section">
      <div className="container">
        <div className="cta-banner">
          <div>
            <span className="eyebrow">Let's work together</span>
            <h2>Ready to Build Your Next Project?</h2>
            <p>Let's discuss your ideas and turn them into impactful digital solutions.</p>
          </div>
          <Link to="/contact" className="btn btn-light">
            Get a Free Consultation <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}