import { motion } from "framer-motion";
import { WalletConnect } from "./WalletConnect";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { PurchaseToken } from "./PurchaseToken";
import { Dashboard } from "./Dashboard";

export const Hero = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#F2F2F2] to-white">
      <Dashboard />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="inline-block px-4 py-1 mb-6 text-sm font-medium bg-primary/10 text-primary rounded-full animate-shine">
            Welcome to the Future of Racing and Gaming
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Start Your Engines: Join the Degen Grand Prix!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Accelerate into the crypto revolution with Degen Grand Prix. A blockchain game and token for racers, by racers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <WalletConnect />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Buy DGP
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <PurchaseToken />
              </DialogContent>
            </Dialog>
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
            alt="Degen Grand Prix"
            className="w-full h-auto rounded-2xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};