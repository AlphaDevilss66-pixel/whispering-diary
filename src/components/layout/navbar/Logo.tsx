
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
      <motion.span 
        className="font-medium text-xl text-gradient"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Whispers
      </motion.span>
    </Link>
  );
};

export default Logo;
