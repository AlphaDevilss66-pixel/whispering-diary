
import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  error: string | null;
}

const FormError = ({ error }: FormErrorProps) => {
  if (!error) return null;
  
  return (
    <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2">
      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <p className="text-sm text-destructive">{error}</p>
    </div>
  );
};

export default FormError;
