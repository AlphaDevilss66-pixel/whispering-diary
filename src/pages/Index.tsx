
import { useState } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CtaSection from "@/components/landing/CtaSection";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  
  const openAuthModal = (tab: "login" | "register") => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--ios-bg)]">
      <NavBar />
      
      <HeroSection openAuthModal={openAuthModal} />
      <HowItWorksSection />
      <FeaturesSection />
      <CtaSection openAuthModal={openAuthModal} />
      
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
    </div>
  );
};

export default Index;
