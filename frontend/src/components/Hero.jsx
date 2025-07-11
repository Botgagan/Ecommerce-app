import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';


const Hero = () => {
  const { navigate } = useContext(ShopContext);

  return (
    <div className="relative shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)] w-full h-screen max-h-[85vh] sm:max-h-[90vh] overflow-hidden">
      {/* Background Image */}
      <img
        src={assets.hero_img}
        alt="Hero Banner"
        className="w-full h-full object-cover object-center"
      />

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />

      {/* Floating Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-16"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-white text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight drop-shadow-lg"
        >
          Style That Speaks
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-white text-sm sm:text-base md:text-lg mt-4 mb-6 max-w-md drop-shadow-md"
        >
          Curated essentials for everyday expression. Made for movement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex gap-3 flex-wrap justify-center w-full sm:w-auto"
        >
          <button
            onClick={() => navigate('/collection')}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
          >
            Shop Now
          </button>
          <button
            className="px-4 sm:px-6 py-2 sm:py-3 bg-transparent border border-white text-white rounded-md font-semibold hover:bg-white hover:text-black transition text-sm sm:text-base min-w-[120px] sm:min-w-[140px]"
          >
            Explore
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
