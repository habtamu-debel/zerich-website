import Hero from '../components/Home/Hero.jsx';
import Services from '../components/Home/Services.jsx';
import Projects from '../components/Home/Projects.jsx';
import Process from '../components/Home/Process.jsx';
import Testimonials from '../components/Home/Testimonials.jsx';
import CTA from '../components/Home/CTA.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Projects />
      <Process />
      <Testimonials />
      <CTA />
    </>
  );
}