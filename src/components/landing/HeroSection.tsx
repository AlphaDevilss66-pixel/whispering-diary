
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Sparkles } from "lucide-react";
import CustomButton from "@/components/ui/CustomButton";
import { motion, useTransform, useScroll, useInView } from "framer-motion";

interface HeroSectionProps {
  openAuthModal: (tab: "login" | "register") => void;
}

const HeroSection = ({ openAuthModal }: HeroSectionProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);
  const scale1 = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  
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
      ref={heroRef}
      className="pt-24 pb-16 bg-gradient-to-b from-[var(--ios-bg)] to-[var(--ios-card-bg)] relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] z-0"></div>
      
      <motion.div 
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ios-blue/5 blur-3xl"
        style={{ y: y1, opacity: opacity1 }}
      ></motion.div>
      
      <motion.div 
        className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-ios-pink/5 blur-3xl"
        style={{ y: y2, scale: scale1 }}
      ></motion.div>
      
      <div className="page-container relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
        >
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-ios-gray-5/50 text-sm text-ios-blue font-medium mb-6 shadow-sm"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            <span>Una nuova esperienza di journaling</span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-5 tracking-tight"
            variants={itemVariants}
          >
            Racconta la tua storia, <br />
            <span className="bg-gradient-to-r from-ios-blue via-ios-indigo to-ios-purple bg-clip-text text-transparent font-semibold">
              proteggi la tua privacy
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed"
            variants={itemVariants}
          >
            Uno spazio sicuro dove esprimere liberamente i tuoi pensieri. Scrivi nel tuo diario personale, condividi in modo anonimo e connettiti con altri.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            variants={itemVariants}
          >
            <CustomButton 
              variant="ios" 
              size="lg" 
              onClick={() => openAuthModal("register")}
              className="w-full sm:w-auto shadow-lg shadow-ios-blue/20 hover:scale-105 transition-transform"
            >
              Inizia il tuo diario
            </CustomButton>
            
            <CustomButton 
              variant="outline" 
              size="lg"
              onClick={() => openAuthModal("login")}
              className="w-full sm:w-auto hover:scale-105 transition-transform"
              isIOS={true}
            >
              Accedi
            </CustomButton>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Link 
            to="#features" 
            className="flex flex-col items-center text-gray-500 hover:text-ios-blue transition-colors"
          >
            <span className="text-sm mb-1">Scopri di più</span>
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
