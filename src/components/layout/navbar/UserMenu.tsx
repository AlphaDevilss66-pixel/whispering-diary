
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Book, LogOut, Settings, User } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface UserMenuProps {
  onSignOut: () => Promise<void>;
}

const UserMenu = ({ onSignOut }: UserMenuProps) => {
  const navigate = useNavigate();
  const { profile } = useProfile();

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
        <DropdownMenuItem onClick={() => navigate("/settings")} className="rounded-lg focus:bg-secondary group">
          <Settings className="mr-2 h-4 w-4 text-ios-blue group-hover:scale-110 transition-transform" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-ios-gray-5" />
        <DropdownMenuItem onClick={onSignOut} className="rounded-lg focus:bg-secondary text-ios-red group">
          <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
