import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';

import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import LeadManager from './pages/admin/LeadManager';
import ProjectManager from './pages/admin/ProjectManager';
import TrainingManager from './pages/admin/TrainingManager';

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<Layout />}>
        <Route path="/"          element={<Home />} />
        <Route path="/about"     element={<About />} />
        <Route path="/services"  element={<Services />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact"   element={<Contact />} />
      </Route>

      {/* Admin — login (unauthenticated) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin — protected */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route index           element={<Dashboard />} />
          <Route path="leads"    element={<LeadManager />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="training" element={<TrainingManager />} />
        </Route>
      </Route>
    </Routes>
  );
}