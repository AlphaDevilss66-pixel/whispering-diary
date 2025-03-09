
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FormErrorProps {
  error: string | null;
}

const FormError = ({ error }: FormErrorProps) => {
  if (!error) return null;
  
  return (
    <motion.div 
      className="bg-destructive/10 p-3 rounded-md flex items-start gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
      <p className="text-sm text-destructive">{error}</p>
    </motion.div>
  );
};

export default FormError;
