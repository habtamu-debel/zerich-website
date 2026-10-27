import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ShoppingCart, GraduationCap, Boxes, Layers, ArrowRight } from 'lucide-react';
import api from '../../lib/api.js';

const icons = { Globe, ShoppingCart, GraduationCap, Boxes };

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data)).catch(() => {});
  }, []);

  return (
    <section className="section">
      <div className="container services-grid">
        <div>
          <span className="eyebrow">Our Services</span>
          <h2 className="section-title">What We Do for Your Business</h2>
          <p className="section-sub">
            From branding to development, we provide end-to-end digital solutions to help your
            business grow in the digital era.
          </p>
          <Link to="/services" className="link-arrow">
            View All Services <ArrowRight size={16} />
          </Link>
        </div>

        <div className="service-cards">
          {services.map((s, i) => {
            const Icon = icons[s.icon] || Layers;
            return (
              <Link to="/services" className="service-card" key={s.id}>
                <span className={`service-icon tone-${i % 4}`}>
                  <Icon size={24} />
                </span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.short_description}</p>
                </div>
                <ArrowRight size={16} className="service-arrow" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}