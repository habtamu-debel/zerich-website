import { Link } from 'react-router-dom';
import { Search, ClipboardList, PenTool, Code2, Rocket, ArrowRight } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Discovery', text: 'We understand your goals and needs.' },
  { icon: ClipboardList, title: 'Planning', text: 'We create the strategy and project plan.' },
  { icon: PenTool, title: 'Design', text: 'We design the UI/UX and prototype.' },
  { icon: Code2, title: 'Development', text: 'We build and test your solution.' },
  { icon: Rocket, title: 'Launch', text: 'We deploy and support your growth.' },
];

export default function Process() {
  return (
    <section className="section">
      <div className="container process-wrap">
        <div className="process-intro">
          <span className="eyebrow">Our Work Process</span>
          <h2 className="section-title">From Idea to Reality</h2>
          <p className="section-sub">
            We follow a clear and transparent process to make sure your project gets the best results.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Start Your Project <ArrowRight size={18} />
          </Link>
        </div>

        <ol className="process-steps">
          {steps.map((s, i) => (
            <li key={s.title}>
              <span className="step-icon"><s.icon size={24} /></span>
              <b>0{i + 1}</b>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}