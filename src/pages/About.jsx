export default function About() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold">About This App</h1>
      <p className="mt-4 text-gray-600">
        This app helps you track workouts and monitor progress over time.
      </p>
    </div>
  );
}

//signup 
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { signUp } from "@aws-amplify/auth";
// import { motion } from "framer-motion";

// export default function Signup() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await signUp({
//         username,
//         password,
//         options: { userAttributes: { email } },
//       });
//       alert("Signup successful! Please check your email for confirmation.");
//       navigate("/login");
//     } catch (err) {
//       alert(err.message || "Error signing up");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-white text-black font-sans">
//       {/* Left Section */}
//       <motion.div
//         initial={{ x: -80, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="flex-1 flex flex-col justify-center items-center bg-gray-50 border-r border-gray-200 p-10"
//       >
//         <motion.h1
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2 }}
//           className="text-4xl md:text-5xl font-normal mb-4"
//         >
//           IRONLOG
//         </motion.h1>
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.3 }}
//           className="text-gray-600 text-lg text-center max-w-sm"
//         >
//           Track. Train. Transform.  
//           Join the Ironlog community and take control of your fitness journey.
//         </motion.p>
//       </motion.div>

//       {/* Right Section (Signup Form) */}
//       <motion.div
//         initial={{ x: 80, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.8 }}
//         className="flex-1 flex justify-center items-center p-10"
//       >
//         <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
//           <h2 className="text-3xl font-normal text-center mb-8">
//             Create Your Account
//           </h2>

//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {/* Username */}
//             <div>
//               <label className="block text-sm text-gray-600 mb-2">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 placeholder="Enter your username"
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm text-gray-600 mb-2">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm text-gray-600 mb-2">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-black focus:outline-none transition"
//               />
//             </div>

//             {/* Submit */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.97 }}
//               type="submit"
//               className="w-full py-2.5 b   +order border-black hover:bg-black hover:text-white rounded-lg transition-all duration-300"
//             >
//               Sign Up
//             </motion.button>
//           </form>

//           <p className="text-sm text-center mt-6 text-gray-600">
//             Already have an account?{" "}
//             <Link to="/login" className="text-black hover:underline font-medium">
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
