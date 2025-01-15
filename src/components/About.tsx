import { motion } from "framer-motion";
import { Rocket, Shield, Users } from "lucide-react";

const features = [
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Deflationary Tokenomics",
    description: "Built-in burn mechanism ensures increasing value over time",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community Driven",
    description: "Governance controlled by MORO holders",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Audited",
    description: "Contract verified and audited for safety",
  },
];

export const About = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-green-100 text-secondary rounded-full">
            About MORO
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What is MORO?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            MORO is a BEP20 token on the Binance Smart Chain inspired by the iconic Morocco Mole. It's not just a meme—it's a movement.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-white to-orange-50 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
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
            src="/lovable-uploads/51a42c25-c995-41d3-9515-d39c77766a22.png"
            alt="Morocco Mole Vision"
            className="max-w-2xl mx-auto rounded-2xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};