import { motion } from "framer-motion";
import { WalletConnect } from "./WalletConnect";
import { PurchaseToken } from "./PurchaseToken";
import { Dashboard } from "./Dashboard";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-orange-50 to-white">
      <Dashboard />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-orange-100 text-primary rounded-full animate-shine">
            Welcome to the Future of Meme Coins
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Unleashing the Power of the Mole
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the crypto underground revolution with Morocco Mole Meme Coin. A token for the community, by the community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <WalletConnect />
            <PurchaseToken />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-16 max-w-3xl mx-auto animate-float"
        >
          <img
            src="/lovable-uploads/d41e23b1-c327-4449-9931-7b26ef8b0430.png"
            alt="Morocco Mole"
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};