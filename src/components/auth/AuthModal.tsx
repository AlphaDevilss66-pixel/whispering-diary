
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm";
import FormError from "./FormError";
import TermsNotice from "./TermsNotice";
import { motion, AnimatePresence } from "framer-motion";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

type AuthView = "login" | "register" | "resetPassword" | "success";

const AuthModal = ({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) => {
  const [view, setView] = useState<AuthView>(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSuccess = () => {
    if (view === "register") {
      setSuccessMessage("Registrazione completata! Controlla la tua email per verificare il tuo account.");
      setView("success");
    } else if (view === "resetPassword") {
      setSuccessMessage("Ti abbiamo inviato un'email con le istruzioni per reimpostare la password.");
      setView("success");
    } else {
      onClose();
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2, ease: "easeIn" }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-md overflow-hidden" 
        onPointerDownOutside={onClose}
        onEscapeKeyDown={onClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogHeader>
            <DialogTitle className="text-center font-serif text-xl">
              {view === "login" && "Accedi al tuo account"}
              {view === "register" && "Crea il tuo account"}
              {view === "resetPassword" && "Reimposta la password"}
              {view === "success" && "Operazione completata"}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <FormError error={formErrors} />

            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {view === "login" && (
                  <LoginForm 
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    onSuccess={handleSuccess}
                    setFormErrors={setFormErrors}
                    switchToRegister={() => {
                      setFormErrors(null);
                      setView("register");
                    }}
                    switchToResetPassword={() => {
                      setFormErrors(null);
                      setView("resetPassword");
                    }}
                  />
                )}

                {view === "register" && (
                  <RegisterForm 
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    onSuccess={handleSuccess}
                    setFormErrors={setFormErrors}
                    switchToLogin={() => {
                      setFormErrors(null);
                      setView("login");
                    }}
                  />
                )}

                {view === "resetPassword" && (
                  <ResetPasswordForm 
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    onSuccess={handleSuccess}
                    setFormErrors={setFormErrors}
                    switchToLogin={() => {
                      setFormErrors(null);
                      setView("login");
                    }}
                  />
                )}

                {view === "success" && (
                  <div className="text-center py-6 space-y-4 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mx-auto">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    
                    <h3 className="text-lg font-medium">Successo!</h3>
                    <p className="text-gray-500">{successMessage}</p>
                    
                    <button
                      className="text-ios-blue hover:underline mt-4 block mx-auto"
                      onClick={() => setView("login")}
                    >
                      Torna al login
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <TermsNotice />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
