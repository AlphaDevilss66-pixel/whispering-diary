
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CustomButton from "@/components/ui/CustomButton";
import TermsNotice from "@/components/auth/TermsNotice";

interface CtaSectionProps {
  openAuthModal: (tab: "login" | "register") => void;
}

const CtaSection = ({ openAuthModal }: CtaSectionProps) => {
  const ctaRef = useRef<HTMLDivElement>(null);
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.5 });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i }
    })
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.section 
      ref={ctaRef}
      className="py-16 bg-gradient-to-b from-[var(--ios-bg)] to-white"
      initial={{ opacity: 0 }}
      animate={isCtaInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="page-container">
        <motion.div 
          className="max-w-3xl mx-auto text-center ios-card py-12 px-6 shadow-xl relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={isCtaInView ? "visible" : "hidden"}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="absolute inset-0 bg-white opacity-90 z-0"></div>
          <motion.div 
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ios-blue/5 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          ></motion.div>
          
          <motion.div 
            className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-ios-pink/5 blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          ></motion.div>
          
          <div className="relative z-10">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-medium mb-3 tracking-tight"
            >
              Pronto a Iniziare il Tuo Viaggio?
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-gray-600 max-w-2xl mx-auto mb-6"
            >
              Unisciti a migliaia di altri che hanno trovato chiarezza, connessione e conforto attraverso la scrittura.
            </motion.p>
            
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <CustomButton 
                variant="ios"
                size="lg" 
                onClick={() => openAuthModal("register")}
                className="shadow-lg shadow-ios-blue/20"
              >
                Crea il Tuo Account Gratuito
              </CustomButton>
            </motion.div>
            
            <motion.div 
              className="mt-6"
              variants={itemVariants}
            >
              <TermsNotice />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CtaSection;
