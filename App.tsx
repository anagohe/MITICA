// App.tsx
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
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
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let timeoutId: number | undefined;

    if (hash) {
      timeoutId = window.setTimeout(() => {
        const elementId = decodeURIComponent(hash.replace('#', ''));
        const element = document.getElementById(elementId);

        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }, 120);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [pathname, hash]);

  return null;
};

const AppLayout = () => {
  return (
    <Layout>
      <ScrollManager />
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
          <Route path="/terminos-y-condiciones" element={<Terms />} />
          <Route path="/aviso-de-privacidad" element={<Privacy />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;