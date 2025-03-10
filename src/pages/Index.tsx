import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CustomButton from "@/components/ui/CustomButton";
import AuthModal from "@/components/auth/AuthModal";
import { ChevronDown, BookOpen, Shield, Users, Key, MessageCircle, Lock, Star, Sparkles } from "lucide-react";
import TermsNotice from "@/components/auth/TermsNotice";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  
  // Refs for different sections to trigger animations
  const heroRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  const isHeroInView = useInView(heroRef, { once: true });
  const isHowItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.3 });
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.3 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.5 });
  
  // Parallax effect values
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);
  const scale1 = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (tab: "login" | "register") => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };
  
  // Animation variants
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
  
  // Testimonials data
  const testimonials = [
    {
      name: "Chiara M.",
      avatar: "CM",
      text: "Whispering Diary mi ha aiutato a esprimere pensieri che non avrei mai condiviso altrimenti. L'anonimato mi dà sicurezza e libertà.",
      role: "Designer",
      color: "bg-ios-pink/10 text-ios-pink",
    },
    {
      name: "Marco L.",
      avatar: "ML",
      text: "Uso l'app ogni giorno. La privacy è impeccabile e la comunità è incredibilmente supportiva. Consigliato a tutti!",
      role: "Insegnante",
      color: "bg-ios-blue/10 text-ios-blue",
    },
    {
      name: "Sofia R.",
      avatar: "SR",
      text: "Finalmente ho trovato un posto sicuro dove posso essere me stessa senza giudizi. L'interfaccia è bellissima e intuitiva.",
      role: "Studente",
      color: "bg-ios-purple/10 text-ios-purple",
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <NavBar />
      
      {/* Hero Section with parallax effect */}
      <motion.section 
        ref={heroRef}
        className="pt-24 pb-16 bg-gradient-to-b from-[#F0F5FF] to-white relative overflow-hidden"
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
      
      {/* How It Works Section */}
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
            {[
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
            ].map((step, index) => (
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
      
      {/* Features Section */}
      <motion.section 
        ref={featuresRef}
        id="features" 
        className="py-16 bg-gradient-to-b from-white to-[#F9FAFB]"
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
            {[
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
            ].map((feature, index) => (
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

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      {/* CTA Section */}
      <motion.section 
        ref={ctaRef}
        className="py-16 bg-gradient-to-b from-[#F9FAFB] to-white"
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
      
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab={authTab}
      />
    </div>
  );
};

export default Index;
