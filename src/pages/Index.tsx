import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Tokenomics } from "@/components/Tokenomics";
import { Community } from "@/components/Community";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden"
    >
      <Hero />
      <About />
      <Tokenomics />
      <Community />
    </motion.div>
  );
};

export default Index;