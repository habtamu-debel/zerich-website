import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import api from '../lib/api.js';

const empty = { name: '', email: '', phone: '', service: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [services, setServices] = useState([]);
  const [info, setInfo] = useState({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text }

  useEffect(() => {
    api.get('/services').then((r) => setServices(r.data)).catch(() => {});
    api.get('/settings').then((r) => setInfo(r.data)).catch(() => {});
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const res = await api.post('/leads', form);
      setStatus({ type: 'success', text: res.data.message });
      setForm(empty);
    } catch (err) {
      setStatus({
        type: 'error',
        text: err.response?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Let's Build Something Great Together"
        text="Tell us about your project and we will get back to you with a free consultation."
      />

      <section className="section">
        <div className="container contact-grid">
          <aside className="contact-info">
            <h2>Get in touch</h2>
            <p>Prefer to talk directly? Reach us through any of these channels.</p>
            <ul>
              <li><span><Mail size={20} /></span><div><small>Email</small><b>{info.contact_email}</b></div></li>
              <li><span><Phone size={20} /></span><div><small>Phone</small><b>{info.contact_phone}</b></div></li>
              <li><span><MapPin size={20} /></span><div><small>Address</small><b>{info.contact_address}</b></div></li>
            </ul>
          </aside>

          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <div className="form-row">
              <label>
                Full name *
                <input name="name" value={form.name} onChange={onChange} required />
              </label>
              <label>
                Email 
                <input type="email" name="email" value={form.email} onChange={onChange} />
              </label>
            </div>

            <div className="form-row">
              <label>
                Phone *
                <input name="phone" value={form.phone} onChange={onChange} required />
              </label>
              <label>
                Service
                <select name="service" value={form.service} onChange={onChange}>
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>

            <label>
              Tell us about your project
              <textarea name="message" rows="5" value={form.message} onChange={onChange} />
            </label>

            {status && (
              <div className={`form-status ${status.type}`}>
                {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                {status.text}
              </div>
            )}

            <button className="btn btn-primary" disabled={sending}>
              {sending ? 'Sending...' : 'Send Message'} <Send size={17} />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}