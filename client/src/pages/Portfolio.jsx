import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import api from '../lib/api.js';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState('All');

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data)).catch(() => {});
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))],
    [projects]
  );

  const visible = active === 'All' ? projects : projects.filter((p) => p.category === active);

  return (
    <>
      <PageHeader
        eyebrow="Our Portfolio"
        title="Work We're Proud Of"
        text="A selection of websites and systems we have built for real businesses."
      />

      <section className="section">
        <div className="container">
          <div className="filters">
            {categories.map((c) => (
              <button
                key={c}
                className={active === c ? 'active' : ''}
                onClick={() => setActive(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <p className="section-sub">No projects to show yet.</p>
          ) : (
            <div className="portfolio-grid">
              {visible.map((p) => {
                const Tag = p.link ? 'a' : 'div';
                const linkProps = p.link ? { href: p.link, target: '_blank', rel: 'noopener noreferrer' } : {};
                return (
                  <Tag className="project-card" key={p.id} {...linkProps}>
                    <div className="project-thumb">
                      {p.image ? <img src={p.image} alt={p.title} loading="lazy" /> : <span>{p.title.charAt(0)}</span>}
                    </div>
                    <div className="project-info">
                      <div>
                        <h3>{p.title}</h3>
                        <small>{p.category}</small>
                      </div>
                      {p.link && <ArrowUpRight size={18} />}
                    </div>
                  </Tag>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}