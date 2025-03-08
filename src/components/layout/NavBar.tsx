
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

  return (
    <header className={`fixed w-full top-0 z-40 transition-all duration-200 ${
      isScrolled 
        ? "bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]/60 shadow-sm" 
        : "bg-transparent"
    }`}>
      <div className="page-container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-medium text-xl text-gradient">Whispers</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
            Home
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
                My Diary
              </Link>
              <Link to="/explore" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
                Explore
              </Link>
            </>
          )}
          <Link to="#" className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0 overflow-hidden">
                  <Avatar className="border border-ios-gray-4">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-ios-blue/10 text-ios-blue">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="ios-card border-ios-gray-4 p-1 w-48">
                <DropdownMenuItem onClick={() => navigate("/profile")} className="rounded-lg focus:bg-secondary">
                  <User className="mr-2 h-4 w-4 text-ios-blue" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="rounded-lg focus:bg-secondary">
                  <Book className="mr-2 h-4 w-4 text-ios-blue" />
                  <span>My Diary</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg focus:bg-secondary">
                  <Settings className="mr-2 h-4 w-4 text-ios-blue" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 bg-ios-gray-5" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-lg focus:bg-secondary text-ios-red">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost"
                onClick={() => openAuthModal("login")}
                className="hidden sm:flex rounded-full"
              >
                Sign In
              </Button>
              <CustomButton 
                variant="ios" 
                onClick={() => openAuthModal("register")}
                className="rounded-full"
              >
                Get Started
              </CustomButton>
            </>
          )}
        </div>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
    </header>
  );
};

export default NavBar;
