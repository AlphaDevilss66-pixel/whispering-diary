
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeOff, Eye, Lock, Mail, User, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

const AuthModal = ({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState<{
    login?: string;
    register?: string;
  }>({});

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({});

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        throw error;
      }
      
      toast.success("Accesso effettuato con successo");
      onClose();
    } catch (error: any) {
      console.error("Login error:", error);
      setFormErrors({ login: error.message || "Accesso fallito" });
      toast.error("Accesso fallito");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({});

    try {
      const { error } = await signUp(registerData.email, registerData.password, {
        name: registerData.name,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Account creato con successo!");
      onClose();
    } catch (error: any) {
      console.error("Registration error:", error);
      setFormErrors({ register: error.message || "Impossibile creare l'account" });
      toast.error("Registrazione fallita");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={onClose}>
        <DialogHeader>
          <DialogTitle className="text-center font-serif text-xl">
            {activeTab === "login" ? "Bentornato" : "Crea un Account"}
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Accedi</TabsTrigger>
            <TabsTrigger value="register">Registrati</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {formErrors.login && (
                <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{formErrors.login}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="la.tua.email@esempio.com"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={toggleShowPassword}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-gray-500 hover:text-primary p-0 h-auto"
                  disabled={isLoading}
                >
                  Password dimenticata?
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Accesso in corso..." : "Accedi"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {formErrors.register && (
                <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{formErrors.register}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="register-name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-name"
                    name="name"
                    type="text"
                    placeholder="Mario Rossi"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="la.tua.email@esempio.com"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    onClick={toggleShowPassword}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creazione account..." : "Crea Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center text-sm text-gray-500">
          Continuando, accetti i nostri{" "}
          <a href="#" className="text-primary hover:underline">
            Termini di Servizio
          </a>{" "}
          e la nostra{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
