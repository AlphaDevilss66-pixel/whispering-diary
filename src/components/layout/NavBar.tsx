
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile } = useProfile();

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
    <header className="fixed w-full top-0 z-40 bg-white/80 backdrop-blur-md border-b">
      <div className="page-container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-medium text-primary">Whispers</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
            Home
          </Link>
          {user && (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
                My Diary
              </Link>
              <Link to="/explore" className="text-gray-600 hover:text-primary transition-colors">
                Explore
              </Link>
            </>
          )}
          <Link to="#" className="text-gray-600 hover:text-primary transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-10 w-10 p-0 overflow-hidden">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  <Book className="mr-2 h-4 w-4" />
                  <span>My Diary</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
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
                className="hidden sm:flex"
              >
                Sign In
              </Button>
              <Button onClick={() => openAuthModal("register")}>
                Get Started
              </Button>
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
