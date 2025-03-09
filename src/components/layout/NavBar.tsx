
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/CustomButton";
import AuthModal from "@/components/auth/AuthModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book, LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

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

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();
    } else if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const navVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };
  
  const listItemVariants = {
    initial: { y: -20, opacity: 0 },
    animate: (i: number) => ({ 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.4,
        delay: i * 0.1,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.header 
      className={`fixed w-full top-0 z-40 transition-all duration-200 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]/60 shadow-sm" 
          : "bg-transparent"
      }`}
      variants={navVariants}
      initial="initial"
      animate="animate"
    >
      <div className="page-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
          <motion.span 
            className="font-medium text-xl text-gradient"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Whispers
          </motion.span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <motion.div className="flex items-center gap-6">
            {[
              { path: "/", label: "Home", index: 0 },
              ...(user ? [
                { path: "/dashboard", label: "My Diary", index: 1 },
                { path: "/explore", label: "Explore", index: 2 }
              ] : []),
              { path: "#", label: "About", index: user ? 3 : 1 }
            ].map((item) => (
              <motion.div
                key={item.path}
                custom={item.index}
                variants={listItemVariants}
                initial="initial"
                animate="animate"
              >
                <Link
                  to={item.path}
                  className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium relative overflow-hidden group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ios-blue origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </nav>

        {/* User Menu or Auth Buttons */}
        <AnimatePresence mode="wait">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-10 w-10 p-0 overflow-hidden hover:scale-110 transition-transform">
                    <Avatar className="border border-ios-gray-4">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="bg-ios-blue/10 text-ios-blue">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="ios-card border-ios-gray-4 p-1 w-48 animate-slide-down">
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="rounded-lg focus:bg-secondary group">
                    <User className="mr-2 h-4 w-4 text-ios-blue group-hover:scale-110 transition-transform" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-lg focus:bg-secondary group">
                    <Book className="mr-2 h-4 w-4 text-ios-blue group-hover:scale-110 transition-transform" />
                    <span>My Diary</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg focus:bg-secondary group">
                    <Settings className="mr-2 h-4 w-4 text-ios-blue group-hover:scale-110 transition-transform" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-ios-gray-5" />
                  <DropdownMenuItem onClick={handleSignOut} className="rounded-lg focus:bg-secondary text-ios-red group">
                    <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => openAuthModal("login")}
                  className="hidden sm:flex rounded-full hover:scale-105 transition-transform"
                >
                  Sign In
                </Button>
                <CustomButton 
                  variant="ios" 
                  onClick={() => openAuthModal("register")}
                  className="rounded-full hover:scale-105 transition-transform"
                >
                  Get Started
                </CustomButton>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Auth Modal - only show when not logged in */}
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
