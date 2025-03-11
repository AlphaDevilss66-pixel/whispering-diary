
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Lock, BookOpen, MessageCircle } from "lucide-react";

const HowItWorksSection = () => {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const isHowItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.3 });
  
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
  
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80,
        delay: i * 0.1
      }
    })
  };
  
  const steps = [
    {
      icon: <Lock className="h-8 w-8 text-white" />,
      title: "Accesso Sicuro",
      description: "Accedi con la tua email. La tua sicurezza è la nostra priorità.",
      color: "bg-ios-blue",
      step: "01"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-white" />,
      title: "Scrivi Liberamente",
      description: "Crea le tue note personali e diario, tutto protetto da crittografia end-to-end.",
      color: "bg-ios-indigo",
      step: "02"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-white" />,
      title: "Condividi se Vuoi",
      description: "Scegli cosa condividere in modo anonimo e connettiti con altri utenti.",
      color: "bg-ios-purple",
      step: "03"
    }
  ];

  return (
    <motion.section 
      ref={howItWorksRef}
      className="py-16 bg-white"
      initial={{ opacity: 0 }}
      animate={isHowItWorksInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="page-container">
        <motion.div 
          className="text-center mb-10"
          variants={containerVariants}
          initial="hidden"
          animate={isHowItWorksInView ? "visible" : "hidden"}
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center px-3 py-1 rounded-full bg-ios-blue/10 text-sm text-ios-blue font-medium mb-4"
          >
            Come funziona
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-medium mb-4 tracking-tight"
          >
            Semplicità e Privacy in Ogni Passaggio
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Un'esperienza utente intuitiva che mette la tua privacy al primo posto in ogni momento.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mt-8"
          variants={containerVariants}
          initial="hidden"
          animate={isHowItWorksInView ? "visible" : "hidden"}
          custom={1}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              custom={index}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
              className="ios-card p-7 flex flex-col items-center text-center relative group hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute -right-3 -top-3 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md font-medium text-ios-blue">
                {step.step}
              </div>
              <motion.div 
                className={`rounded-2xl p-4 inline-flex items-center justify-center mb-5 ${step.color} shadow-lg`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                {step.icon}
              </motion.div>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;
