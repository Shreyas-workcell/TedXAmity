import "@/App.css";
import { CustomCursor } from '@/components/CustomCursor';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Gallery } from '@/components/Gallery';
import { Events } from '@/components/Events';
import { Speakers } from '@/components/Speakers';
import { Registration } from '@/components/Registration';
import { Team } from '@/components/Team';
import { Sponsors } from '@/components/Sponsors';
import { Footer } from '@/components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from '@/pages/AdminDashboard';
import Register from '@/pages/Register';
import RegisterForm from '@/pages/RegisterForm';
import Recruitment from '@/pages/Recruitment';

const HomePage = () => (
  <>
    <CustomCursor />
    <Navbar />
    <Hero />
    <About />
    <Gallery />
    <Events />
    <Speakers />
    <Registration />
    <Team />
    <Sponsors />
    <Footer />
  </>
);

function App() {
  return (
    <div className="App bg-black">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/:eventId" element={<RegisterForm />} />
          <Route path="/recruitment" element={<Recruitment />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;