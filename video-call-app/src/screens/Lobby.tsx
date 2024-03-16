import { motion } from "framer-motion";
import VideoCallImg from './7744490_3717792-removebg-preview.png';
import { useState } from "react";

const Lobby = () => {
    const [name,setName]=useState()
    const [room,setRoom]=useState()
  return (
    <div className="h-screen w-full bg-gradient-to-tr from-gray-900 to-gray-700">
      <div className="h-full w-full flex items-center justify-center">
        <div className="h-full w-full flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }} 
            className="flex flex-col hover:blur-0 h-full bg-center bg-cover items-center justify-center w-full gap-5 bg-gradient-to-tr from-violet-700 to-violet-500"
          >
            <img src={VideoCallImg} className="w-72 justify-self-start" alt="" />

            <div className="flex flex-col gap-4">
              <h1 className="text-3xl md:text-4xl text-white font-semibold text-center mb-4">Welcome </h1>
              <input
                type="email"
                name=""
                id=""
                className="bg-white/50 hover:bg-white md:bg-white placeholder:text-violet-500 placeholder:text-sm text-violet-500 py-3 px-5 focus:text-violet-500 focus:outline focus:outline-offset-1 focus:outline-violet-500 rounded-md"
                placeholder="Enter Your Email Here!"
              />
              <input
                type="password"
                name=""
                id=""
                className="bg-white/50 hover:bg-white md:bg-white placeholder:text-violet-500 placeholder:text-sm text-violet-500 py-3 px-5 focus:text-violet-500 focus:outline focus:outline-offset-1 focus:outline-violet-500 rounded-md"
                placeholder="Enter Your Password Here!"
              />

              <button
                className="px-6 py-2 bg-violet-500 rounded hover:bg-white hover:text-violet-700 font-semibold transition-all text-white hover:scale-110"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Lobby;
