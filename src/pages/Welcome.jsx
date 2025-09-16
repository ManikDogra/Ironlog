import React from "react";
import { motion } from "framer-motion";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50 transition-all duration-300"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold"
          >
            IRONshlong
          </motion.span>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 hover:underline transition-all duration-300"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-black hover:bg-black hover:text-white transition-all duration-300"
            >
              Signup
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6"
          >
            Rise Stronger Every Day
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-gray-600 mb-12"
          >
            Track your fitness journey, set goals, and crush your personal
            records with the most powerful gym tracking app.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border border-black hover:bg-black hover:text-white transition-all duration-300"
          >
            Start Your Journey
          </motion.button>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-normal text-center mb-20"
        >
          Features That Power Your Progress
        </motion.h2>

        {[
          {
            title: "Workout Tracking",
            desc: "Log exercises, sets, reps, and weights with our intuitive interface. See your progress over time with detailed charts and analytics that help you understand your growth.",
            img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1170&q=80",
            reverse: false,
          },
          {
            title: "Progress Analytics",
            desc: "Visualize your strength gains, body measurements, and workout consistency with beautiful, interactive charts. Set goals and track your journey to achieving them.",
            img: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1170&q=80",
            reverse: true,
          },
          {
            title: "Workout Planner",
            desc: "Create and customize workout routines for any goal. Our smart planner suggests optimal training splits based on your schedule, preferences, and recovery needs.",
            img: "https://images.unsplash.com/photo-1608138278561-4b1ade407411?auto=format&fit=crop&w=1170&q=80",
            reverse: false,
          },
          {
            title: "Community Challenges",
            desc: "Join workout challenges with friends or the global IronLog community. Compete, motivate each other, and celebrate achievements together in your fitness journey.",
            img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1170&q=80",
            reverse: true,
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className={`flex flex-col ${
              f.reverse ? "md:flex-row-reverse" : "md:flex-row"
            } items-center justify-between mb-24`}
          >
            <div className="md:w-1/2 mb-8 md:mb-0 md:px-12">
              <h3 className="text-xl font-normal mb-4">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
            <div className="md:w-1/2 overflow-hidden transition-transform hover:scale-[1.01]">
              <motion.img
                whileHover={{ scale: 1.03 }}
                src={f.img}
                alt={f.title}
                className="w-full h-64 object-cover grayscale"
              />
            </div>
          </motion.div>
        ))}
      </section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-24 bg-gray-50"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-normal mb-8">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of fitness enthusiasts who are tracking their
            progress and achieving their goals with IronLog.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 border border-black hover:bg-black hover:text-white transition-all duration-300"
          >
            Get Started For Free
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white py-12 border-t border-gray-200"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl font-normal mb-8">IRONLOG</div>
          <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <i className="fa-brands fa-facebook text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <i className="fa-brands fa-twitter text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <i className="fa-brands fa-instagram text-xl"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors">
              <i className="fa-brands fa-youtube text-xl"></i>
            </a>
          </div>
          <div className="text-gray-600 mb-4">
            <p>Contact: support@ironlog.com | (555) 123-4567</p>
          </div>
          <div className="text-sm text-gray-500">
            <p>© 2025 IronLog. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
