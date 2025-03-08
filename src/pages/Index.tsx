
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import CustomButton from "@/components/ui/CustomButton";
import AuthModal from "@/components/auth/AuthModal";
import { ChevronDown, BookOpen, Shield, Users, Key } from "lucide-react";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [isVisible, setIsVisible] = useState(Array(4).fill(false));

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
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <NavBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-white to-[#F9FAFB]">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6">
              Share Your Story, <br />
              <span className="text-gradient">Keep Your Privacy</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              A safe space to express yourself freely. Write private diary entries, share anonymously, and connect with others on similar journeys.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CustomButton 
                variant="ios" 
                size="lg" 
                onClick={() => openAuthModal("register")}
                className="w-full sm:w-auto"
              >
                Start Your Diary
              </CustomButton>
              <CustomButton 
                variant="outline" 
                size="lg"
                onClick={() => openAuthModal("login")}
                className="w-full sm:w-auto"
                isIOS={true}
              >
                Sign In
              </CustomButton>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Link 
              to="#features" 
              className="flex flex-col items-center text-gray-500 hover:text-ios-blue transition-colors"
            >
              <span className="text-sm mb-2">Learn More</span>
              <ChevronDown className="h-5 w-5 animate-pulse-subtle" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium mb-4">
              Your Thoughts, Your Way
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whispering Diary offers a unique blend of private journaling with the option to share anonymously and connect with others.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-ios-blue" />,
                title: "Private Journaling",
                description: "Keep your personal thoughts secure and private, accessible only to you."
              },
              {
                icon: <Shield className="h-8 w-8 text-ios-green" />,
                title: "Anonymous Sharing",
                description: "Share your experiences anonymously when you want to connect without revealing your identity."
              },
              {
                icon: <Users className="h-8 w-8 text-ios-purple" />,
                title: "Community Connection",
                description: "Find others with similar experiences and build meaningful connections."
              },
              {
                icon: <Key className="h-8 w-8 text-ios-orange" />,
                title: "Encrypted Security",
                description: "Your data is encrypted and secure, giving you peace of mind."
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`animate-on-scroll ios-card p-8 transform transition-all duration-500 ${
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
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-[#F9FAFB] to-white">
        <div className="page-container">
          <div className="max-w-3xl mx-auto text-center ios-card py-16 px-8">
            <h2 className="text-3xl font-medium mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Join thousands of others who have found clarity, connection, and comfort through writing.
            </p>
            <CustomButton 
              variant="ios"
              size="lg" 
              onClick={() => openAuthModal("register")}
            >
              Create Your Free Account
            </CustomButton>
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
