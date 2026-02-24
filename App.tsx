// App.tsx
import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Ingredients from './pages/Ingredients';
import Menu from './pages/Menu';
import Delivery from './pages/Delivery';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Events from './pages/Events';
import Careers from './pages/Careers';
import Locations from './pages/Locations';
import Franchise from './pages/Franchise';
import FAQ from './pages/FAQ';

// ✅ NUEVO: Páginas legales
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppLayout = () => {
  return (
    <Layout>
      <ScrollToTop />
      <Outlet />
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/events" element={<Events />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/faq" element={<FAQ />} />

          {/* ✅ NUEVO: Rutas legales */}
          <Route path="/terminos-y-condiciones" element={<Terms />} />
          <Route path="/aviso-de-privacidad" element={<Privacy />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;