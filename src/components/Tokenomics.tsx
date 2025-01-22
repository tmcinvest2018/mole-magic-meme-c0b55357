import { motion } from "framer-motion";
import { Flame, RefreshCw, Lock, Megaphone } from "lucide-react";

const tokenomics = [
  {
    icon: <Flame className="w-6 h-6" />,
    title: "Burn",
    value: "2%",
    description: "Of every transaction burned",
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Rewards",
    value: "1%",
    description: "Distributed to racers",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Liquidity",
    value: "5%",
    description: "Locked for stability",
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    title: "Marketing",
    value: "3%",
    description: "For growth & development",
  },
];

export const Tokenomics = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#F2F2F2]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full">
            Tokenomics
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transparent, Fair, and High-Performance
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Total Supply: 1,000,000,000 DGP
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {tokenomics.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all text-center"
            >
              <div className="w-12 h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-3xl font-bold text-primary mb-2">{item.value}</p>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mt-16"
        >
          <img
            src="/lovable-uploads/d72d77da-e5f1-4be8-af84-1bd13e62eb52.png"
            alt="Degen Grand Prix Trading"
            className="max-w-2xl mx-auto rounded-2xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};