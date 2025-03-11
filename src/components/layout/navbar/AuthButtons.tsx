
import { Button } from "@/components/ui/button";
import CustomButton from "@/components/ui/CustomButton";

interface AuthButtonsProps {
  onOpenAuth: (tab: "login" | "register") => void;
}

const AuthButtons = ({ onOpenAuth }: AuthButtonsProps) => {
  return (
    <>
      <Button 
        variant="ghost"
        onClick={() => onOpenAuth("login")}
        className="hidden sm:flex rounded-full hover:scale-105 transition-transform"
      >
        Sign In
      </Button>
      <CustomButton 
        variant="ios" 
        onClick={() => onOpenAuth("register")}
        className="rounded-full hover:scale-105 transition-transform"
      >
        Get Started
      </CustomButton>
    </>
  );
};

export default AuthButtons;
