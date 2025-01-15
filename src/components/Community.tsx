import { motion } from "framer-motion";

export const Community = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-green-100 text-secondary rounded-full">
            Community
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Mole's Underground Network
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            MORO thrives because of its strong and passionate community. Follow us on our social channels to stay updated and help shape the future of MORO.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <img
            src="/lovable-uploads/363c688d-5a9a-413b-a0f6-c5525cebaab8.png"
            alt="Morocco Mole Community"
            className="max-w-2xl mx-auto rounded-2xl shadow-2xl"
          />
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {["Telegram", "Discord", "Twitter", "Reddit"].map((platform, index) => (
            <motion.button
              key={platform}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="px-8 py-3 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary/10 transition-all transform hover:scale-105"
            >
              Join {platform}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};