import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export default function Welcome() {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    if (newTheme === "dark") html.classList.add("dark");
    else html.classList.remove("dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-950 dark:text-gray-100 font-sans transition-colors duration-300">
      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 transition-all duration-300"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold tracking-tight"
          >
            IRONLOG
          </motion.span>

          <div className="flex items-center gap-6">
            {/* Theme Toggle with Lucide Icons (minimal, not flashy) */}
            {/* Theme Toggle with Lucide Icons (wider, cleaner) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`relative w-[52px] h-6 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
                isDark ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  isDark ? "translate-x-[29px]" : "translate-x-[2px]"
                }`}
              />
              {/* Sun (left) */}
              <div className="absolute left-[5px] flex items-center justify-center pointer-events-none">
                <Sun
                  size={13}
                  className={`text-gray-600 ${
                    isDark ? "opacity-40" : "opacity-100"
                  } transition-opacity`}
                />
              </div>
              {/* Moon (right) */}
              <div className="absolute right-[4px] flex items-center justify-center pointer-events-none">
                <Moon
                  size={13}
                  className={`text-gray-300 ${
                    isDark ? "opacity-100" : "opacity-40"
                  } transition-opacity`}
                />
              </div>
</button>
            <div className="flex gap-4 ml-4">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 hover:underline transition-all duration-300"
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border border-black dark:border-gray-100 hover:bg-black dark:hover:bg-gray-100 hover:text-white dark:hover:text-black transition-all duration-300"
                >
                  Signup
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-24">
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
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12"
          >
            Track your fitness journey, set goals, and crush your personal
            records with the most powerful gym tracking app.
          </motion.p>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border border-black dark:border-gray-100 hover:bg-black dark:hover:bg-gray-100 hover:text-white dark:hover:text-black transition-all duration-300"
            >
              Start Your Journey
            </motion.button>
          </Link>
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
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
            <div className="md:w-1/2 overflow-hidden transition-transform hover:scale-[1.01]">
              <motion.img
                whileHover={{ scale: 1.03 }}
                src={f.img}
                alt={f.title}
                className="w-full h-64 object-cover grayscale dark:opacity-90"
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
        className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-normal mb-8">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of fitness enthusiasts who are tracking their
            progress and achieving their goals with IronLog.
          </p>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 border border-black dark:border-gray-100 hover:bg-black dark:hover:bg-gray-100 hover:text-white dark:hover:text-black transition-all duration-300"
            >
              Get Started For Free
            </motion.button>
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white dark:bg-gray-900 py-12 border-t border-gray-200 dark:border-gray-800 transition-colors"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl font-normal mb-8">IRONLOG</div>
          <div className="flex justify-center gap-8 mb-8">
            {[faFacebook, faTwitter, faInstagram, faYoutube].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <FontAwesomeIcon icon={icon} className="text-xl" />
              </a>
            ))}
          </div>
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            <p>Contact: support@ironlog.com | (555) 123-4567</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-500">
            <p>© 2025 IronLog. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
