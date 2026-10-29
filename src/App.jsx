import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home       from "./pages/Home";
import About      from "./pages/About";
import Services   from "./pages/Services";
import Insight    from "./pages/Insight";
import Blog       from "./pages/Blog";
import BlogPost   from "./pages/BlogPost";
import Career     from "./pages/Career";
import CareerDetail from "./pages/CareerDetail";
import Contact    from "./pages/Contact";
import NotFound   from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppShell() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/about"         element={<About />} />
          <Route path="/services"      element={<Services />} />
          <Route path="/insight"       element={<Insight />} />
          <Route path="/blog"          element={<Blog />} />
          <Route path="/blog/:slug"    element={<BlogPost />} />
          <Route path="/career"        element={<Career />} />
          <Route path="/career/:slug"  element={<CareerDetail />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </LanguageProvider>
  );
}
