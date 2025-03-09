
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CustomButton from "@/components/ui/CustomButton";
import AuthModal from "@/components/auth/AuthModal";
import { ChevronDown, BookOpen, Shield, Users, Key, MessageCircle, Lock, Star, Sparkles } from "lucide-react";
import TermsNotice from "@/components/auth/TermsNotice";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [isVisible, setIsVisible] = useState(Array(4).fill(false));
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }, index * 100);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const openAuthModal = (tab: "login" | "register") => {
    setAuthTab(tab);
    setShowAuthModal(true);
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
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#F0F5FF] to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] z-0"></div>
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ios-blue/5 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-ios-pink/5 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        ></div>
        
        <div className="page-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-ios-gray-5/50 text-sm text-ios-blue font-medium mb-8 shadow-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Una nuova esperienza di journaling</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-tight mb-6 tracking-tight">
              Racconta la tua storia, <br />
              <span className="bg-gradient-to-r from-ios-blue via-ios-indigo to-ios-purple bg-clip-text text-transparent font-semibold">
                proteggi la tua privacy
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Uno spazio sicuro dove esprimere liberamente i tuoi pensieri. Scrivi nel tuo diario personale, condividi in modo anonimo e connettiti con altri in un percorso simile al tuo.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CustomButton 
                variant="ios" 
                size="lg" 
                onClick={() => openAuthModal("register")}
                className="w-full sm:w-auto shadow-lg shadow-ios-blue/20"
              >
                Inizia il tuo diario
              </CustomButton>
              
              <CustomButton 
                variant="outline" 
                size="lg"
                onClick={() => openAuthModal("login")}
                className="w-full sm:w-auto"
                isIOS={true}
              >
                Accedi
              </CustomButton>
            </div>
            
            <div className="mt-16 mx-auto max-w-3xl">
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-ios-gray-5/50 shadow-2xl shadow-ios-gray-1/10">
                <div className="absolute inset-0 bg-gradient-to-tr from-black/5 to-black/0"></div>
                <img 
                  src="https://placehold.co/1200x675/F9FAFB/e2e8f0?text=Whispering+Diary+Screenshot" 
                  alt="Whispering Diary App Interface" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Link 
              to="#features" 
              className="flex flex-col items-center text-gray-500 hover:text-ios-blue transition-colors"
            >
              <span className="text-sm mb-2">Scopri di più</span>
              <ChevronDown className="h-5 w-5 animate-pulse-subtle" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ios-blue/10 text-sm text-ios-blue font-medium mb-4">
              Come funziona
            </div>
            <h2 className="text-4xl font-medium mb-6 tracking-tight">
              Semplicità e Privacy in Ogni Passaggio
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Un'esperienza utente intuitiva che mette la tua privacy al primo posto in ogni momento.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: <Lock className="h-8 w-8 text-white" />,
                title: "Accesso Sicuro",
                description: "Accedi con Google, Microsoft o il tuo telefono. Nessuna password da ricordare.",
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
              <div
                key={step.title}
                className="ios-card p-8 flex flex-col items-center text-center relative group hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute -right-3 -top-3 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md font-medium text-ios-blue">
                  {step.step}
                </div>
                <div className={`rounded-2xl p-4 inline-flex items-center justify-center mb-6 ${step.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-white to-[#F9FAFB]">
        <div className="page-container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ios-green/10 text-sm text-ios-green font-medium mb-4">
              Funzionalità
            </div>
            <h2 className="text-4xl font-medium mb-6 tracking-tight">
              I Tuoi Pensieri, a Modo Tuo
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whispering Diary offre una combinazione unica di journaling privato con l'opzione di condividere in modo anonimo e connettersi con gli altri.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-ios-blue" />,
                title: "Diario Personale",
                description: "Mantieni i tuoi pensieri privati al sicuro, accessibili solo a te."
              },
              {
                icon: <Shield className="h-8 w-8 text-ios-green" />,
                title: "Condivisione Anonima",
                description: "Condividi le tue esperienze in modo anonimo quando vuoi connetterti senza rivelare la tua identità."
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
              <div
                key={feature.title}
                className={`animate-on-scroll ios-card p-8 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-lg ${
                  isVisible[index] ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                <div className="rounded-2xl p-3 inline-block mb-4 bg-[#F5F7FA]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-ios-yellow/10 text-sm text-ios-yellow font-medium mb-4">
              Recensioni
            </div>
            <h2 className="text-4xl font-medium mb-6 tracking-tight">
              Cosa Dicono Gli Utenti
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Scopri come Whispering Diary sta aiutando le persone a trovare la loro voce in uno spazio sicuro.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className="ios-card p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-medium text-lg ${testimonial.color} mr-4`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-ios-yellow fill-ios-yellow" />
                  ))}
                </div>
                <p className="text-gray-600 italic">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-[#F9FAFB] to-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center ios-card py-16 px-8 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-90 z-0"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-ios-blue/5 blur-3xl"></div>
            <div className="absolute top-40 -left-24 w-72 h-72 rounded-full bg-ios-pink/5 blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-medium mb-4 tracking-tight">
                Pronto a Iniziare il Tuo Viaggio?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Unisciti a migliaia di altri che hanno trovato chiarezza, connessione e conforto attraverso la scrittura.
              </p>
              <CustomButton 
                variant="ios"
                size="lg" 
                onClick={() => openAuthModal("register")}
                className="shadow-lg shadow-ios-blue/20"
              >
                Crea il Tuo Account Gratuito
              </CustomButton>
              
              <div className="mt-8">
                <TermsNotice />
              </div>
            </div>
          </div>
        </div>
      </section>
      
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
