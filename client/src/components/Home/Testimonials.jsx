import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import api from '../../lib/api.js';

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const track = useRef(null);

  useEffect(() => {
    api.get('/testimonials').then((res) => setItems(res.data)).catch(() => {});
  }, []);

  const scroll = (dir) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
  };

  if (!items.length) return null;

  return (
    <section className="section section-soft">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Client Testimonials</span>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-sub">Trusted by businesses from various industries.</p>
          </div>
          <div className="carousel-controls">
            <button onClick={() => scroll(-1)} aria-label="Previous"><ChevronLeft size={20} /></button>
            <button onClick={() => scroll(1)} aria-label="Next"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="testimonial-track" ref={track}>
          {items.map((t) => (
            <article className="testimonial-card" key={t.id}>
              <div className="stars" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p>“{t.message}”</p>
              <div className="testimonial-person">
                {t.photo ? (
                  <img src={t.photo} alt={t.name} loading="lazy" />
                ) : (
                  <span className="avatar">{t.name.charAt(0)}</span>
                )}
                <div>
                  <strong>{t.name}</strong>
                  <small>{[t.role, t.company].filter(Boolean).join(', ')}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}