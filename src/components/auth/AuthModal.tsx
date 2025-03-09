
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PhoneAuth from "./PhoneAuth";
import VerificationCode from "./VerificationCode";
import OAuthProviders from "./OAuthProviders";
import FormError from "./FormError";
import TermsNotice from "./TermsNotice";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string | null>(null);

  const handleVerificationSent = (phone: string) => {
    setPhoneNumber(phone);
    setShowVerification(true);
  };

  const handleVerified = () => {
    onClose();
  };

  const handleBack = () => {
    setShowVerification(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={onClose}>
        <DialogHeader>
          <DialogTitle className="text-center font-serif text-xl">
            Accedi o Registrati
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          <FormError error={formErrors} />

          {!showVerification ? (
            <PhoneAuth 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onVerificationSent={handleVerificationSent}
              setFormErrors={setFormErrors}
              formErrors={formErrors}
            />
          ) : (
            <VerificationCode 
              phoneNumber={phoneNumber}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              onVerified={handleVerified}
              onBack={handleBack}
              setFormErrors={setFormErrors}
            />
          )}

          <OAuthProviders 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setFormErrors={setFormErrors}
          />
        </div>

        <TermsNotice />
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
