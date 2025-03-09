
import { motion } from "framer-motion";

const TermsNotice = () => {
  return (
    <motion.div 
      className="mt-4 text-center text-sm text-gray-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      Continuando, accetti i nostri{" "}
      <a href="#" className="text-ios-blue hover:underline transition-colors">
        Termini di Servizio
      </a>{" "}
      e la nostra{" "}
      <a href="#" className="text-ios-blue hover:underline transition-colors">
        Privacy Policy
      </a>
      .
    </motion.div>
  );
};

export default TermsNotice;
