
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Shield, Users, Key } from "lucide-react";

const FeaturesSection = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.3 });
  
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
  
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-ios-blue" />,
      title: "Diario Personale",
      description: "Mantieni i tuoi pensieri privati al sicuro, accessibili solo a te."
    },
    {
      icon: <Shield className="h-8 w-8 text-ios-green" />,
      title: "Condivisione Anonima",
      description: "Condividi le tue esperienze in modo anonimo quando vuoi connetterti."
    },
    {
      icon: <Users className="h-8 w-8 text-ios-purple" />,
      title: "Connessione Comunitaria",
      description: "Trova altri con esperienze simili e costruisci connessioni significative."
    },
    {
      icon: <Key className="h-8 w-8 text-ios-orange" />,
      title: "Sicurezza Crittografata",
      description: "I tuoi dati sono crittografati e sicuri, dandoti tranquillità."
    }
  ];

  return (
    <motion.section 
      ref={featuresRef}
      id="features" 
      className="py-16 bg-gradient-to-b from-white to-[var(--ios-card-bg)]"
      initial={{ opacity: 0 }}
      animate={isFeaturesInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="page-container">
        <motion.div 
          className="text-center mb-10"
          variants={containerVariants}
          initial="hidden"
          animate={isFeaturesInView ? "visible" : "hidden"}
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center px-3 py-1 rounded-full bg-ios-green/10 text-sm text-ios-green font-medium mb-4"
          >
            Funzionalità
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-medium mb-4 tracking-tight"
          >
            I Tuoi Pensieri, a Modo Tuo
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Whispering Diary offre una combinazione unica di journaling privato con l'opzione di condividere in modo anonimo.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate={isFeaturesInView ? "visible" : "hidden"}
          custom={1}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              variants={cardVariants}
              whileHover={{ 
                y: -6, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              className="ios-card p-6 transform transition-all duration-500"
            >
              <motion.div 
                className="rounded-2xl p-3 inline-block mb-4 bg-[#F5F7FA]"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
