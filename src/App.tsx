import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/sections/Footer";
import { ContactForm } from "@/components/sections/ContactForm";
import { CookieConsent } from "@/components/sections/CookieConsent";
import { ReferralModal } from "@/components/sections/ReferralModal";
import Index from "@/pages/Index";
import CatalogPage from "@/pages/CatalogPage";
import { ScrollToTop } from "@/components/ScrollToTop";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import OfferPage from "@/pages/OfferPage";
import CookiesPage from "@/pages/CookiesPage";

function App() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollToTop />
      <Navbar onOpenForm={() => setFormOpen(true)} />
      <Routes>
        <Route path="/" element={<Index onOpenForm={() => setFormOpen(true)} />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/offer" element={<OfferPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
      </Routes>
      <Footer />
      <ContactForm open={formOpen} onClose={() => setFormOpen(false)} />
      <CookieConsent />
      <ReferralModal />
    </div>
  );
}

export default App;
