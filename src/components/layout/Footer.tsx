
import { Link } from "react-router-dom";
import { Heart, BookOpen, Github, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-[#E5E7EB]/60">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-ios-blue" />
              <span className="font-medium text-xl text-gradient">Whispering Diary</span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 max-w-md">
              A private space for your thoughts, with the option to anonymously share and connect with others on similar journeys.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Navigation</h3>
            <ul className="mt-4 space-y-2">
              {["Home", "Explore", "Dashboard", "Profile"].map((item) => (
                <li key={item}>
                  <Link to={item === "Home" ? "/" : `/${item.toLowerCase()}`} className="text-sm text-gray-600 hover:text-ios-blue">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-gray-600 hover:text-ios-blue">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-[#E5E7EB]/60 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Whispering Diary. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-ios-blue transition-colors">
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-ios-blue transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
            <span className="flex items-center text-sm text-gray-500">
              Made with <Heart className="h-4 w-4 mx-1 text-ios-red" /> using Lovable
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
