import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, ShoppingCart, GraduationCap, Boxes, Layers, Check, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import api from '../lib/api.js';

const icons = { Globe, ShoppingCart, GraduationCap, Boxes };

// Draft copy: edit these to match what ZeRich really offers
const included = {
  'branding-websites': ['Custom, responsive design', 'Brand-focused content structure', 'SEO-ready pages', 'Contact forms and analytics'],
  'e-commerce-websites': ['Product catalog and categories', 'Cart and checkout', 'Order management dashboard', 'Local payment integration options'],
  'edtech-solutions': ['Course and lesson management', 'Quizzes and practice exams', 'Student progress tracking', 'Admin and instructor dashboards'],
  'erp-systems': ['Inventory, sales and purchasing', 'Role-based user access', 'Reports and analytics', 'Custom workflows for your business'],
};

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services').then((r) => setServices(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Our Services"
        title="Solutions Built Around Your Business"
        text="From a brand website to a full ERP system, we design and build the digital tools your business needs to grow."
      />

      <section className="section">
        <div className="container">
          {services.map((s, i) => {
            const Icon = icons[s.icon] || Layers;
            const list = included[s.slug] || [];
            return (
              <article className={`service-row ${i % 2 ? 'reverse' : ''}`} key={s.id} id={s.slug}>
                <div className="service-row-copy">
                  <span className={`service-icon tone-${i % 4}`}><Icon size={26} /></span>
                  <h2>{s.title}</h2>
                  <p>{s.description || s.short_description}</p>
                  <Link to="/contact" className="link-arrow">
                    Request this service <ArrowRight size={16} />
                  </Link>
                </div>

                {list.length > 0 && (
                  <div className="service-row-list">
                    <h4>What's included</h4>
                    <ul>
                      {list.map((item) => (
                        <li key={item}><Check size={18} /> {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}