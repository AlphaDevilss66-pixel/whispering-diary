
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import Logo from "./navbar/Logo";
import Navigation from "./navbar/Navigation";
import UserMenu from "./navbar/UserMenu";
import AuthButtons from "./navbar/AuthButtons";

const NavBar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (tab: "login" | "register") => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <motion.header 
      className={`fixed w-full top-0 z-40 transition-all duration-200 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]/60 shadow-sm" 
          : "bg-transparent"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="page-container flex items-center justify-between h-16">
        <Logo />
        <Navigation isAuthenticated={!!user} />
        
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {user ? (
            <UserMenu onSignOut={handleSignOut} />
          ) : (
            <AuthButtons onOpenAuth={openAuthModal} />
          )}
        </motion.div>
      </div>

      {!user && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab={authTab}
        />
      )}
    </motion.header>
  );
};

export default NavBar;
