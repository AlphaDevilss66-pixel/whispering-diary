
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface NavigationProps {
  isAuthenticated: boolean;
}

const Navigation = ({ isAuthenticated }: NavigationProps) => {
  const listItemVariants = {
    initial: { y: -20, opacity: 0 },
    animate: (i: number) => ({ 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.4,
        delay: i * 0.1,
        ease: "easeOut"
      }
    })
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="hidden md:flex items-center gap-6">
      <motion.div className="flex items-center gap-6">
        {[
          { path: "/dashboard", label: "My Diary", index: 0 },
          { path: "/explore", label: "Explore", index: 1 }
        ].map((item) => (
          <motion.div
            key={item.path}
            custom={item.index}
            variants={listItemVariants}
            initial="initial"
            animate="animate"
          >
            <Link
              to={item.path}
              className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium relative overflow-hidden group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-ios-blue origin-left transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </nav>
  );
};

export default Navigation;
