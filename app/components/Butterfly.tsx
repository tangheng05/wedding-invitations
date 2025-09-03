'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ButterflyProps {
  color?: string;
}

export default function Butterfly({ color = "#8b5cf6" }: ButterflyProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Random initial position
    const x = Math.random() * 100; // percentage of viewport width
    const y = Math.random() * 100; // percentage of viewport height
    const rotation = Math.random() * 360;
    
    setPosition({ x, y });
    setRotation(rotation);
  }, []);

  // Generate a random flight path
  const generatePath = () => {
    const newX = Math.random() * 100;
    const newY = Math.random() * 100;
    const newRotation = Math.random() * 360;
    
    setPosition({ x: newX, y: newY });
    setRotation(newRotation);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      generatePath();
    }, 8000 + Math.random() * 5000); // Random interval between 8-13 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="absolute pointer-events-none z-10"
      initial={{ x: `${position.x}vw`, y: `${position.y}vh`, rotate: rotation }}
      animate={{ 
        x: `${position.x}vw`, 
        y: `${position.y}vh`,
        rotate: rotation,
      }}
      transition={{
        type: "spring",
        stiffness: 10,
        damping: 10,
        duration: 8,
      }}
      style={{ 
        width: '32px',
        height: '32px',
      }}
    >
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Left upper wing */}
        <motion.path
          d="M16 16 C10 12, 6 8, 4 6 C2 4, 2 8, 4 10 C6 12, 10 14, 16 16"
          fill={color}
          opacity="0.8"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 0.9, 0.8]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        
        {/* Right upper wing */}
        <motion.path
          d="M16 16 C22 12, 26 8, 28 6 C30 4, 30 8, 28 10 C26 12, 22 14, 16 16"
          fill={color}
          opacity="0.8"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 0.9, 0.8]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        
        {/* Left lower wing */}
        <motion.path
          d="M16 16 C12 18, 8 22, 6 26 C4 28, 8 28, 10 26 C12 24, 14 20, 16 16"
          fill={color}
          opacity="0.7"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.7, 0.8, 0.7]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        
        {/* Right lower wing */}
        <motion.path
          d="M16 16 C20 18, 24 22, 26 26 C28 28, 24 28, 22 26 C20 24, 18 20, 16 16"
          fill={color}
          opacity="0.7"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.7, 0.8, 0.7]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        
        {/* Wing patterns */}
        <circle cx="10" cy="10" r="1.5" fill="white" opacity="0.3" />
        <circle cx="22" cy="10" r="1.5" fill="white" opacity="0.3" />
        <circle cx="8" cy="20" r="1" fill="white" opacity="0.2" />
        <circle cx="24" cy="20" r="1" fill="white" opacity="0.2" />
        
        {/* Butterfly body */}
        <ellipse cx="16" cy="16" rx="1" ry="8" fill="#4a4a4a" opacity="0.8" />
        
        {/* Antennae */}
        <path
          d="M16 8 Q14 6 13 5"
          stroke="#4a4a4a"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M16 8 Q18 6 19 5"
          stroke="#4a4a4a"
          strokeWidth="0.5"
          fill="none"
        />
        <circle cx="13" cy="5" r="0.5" fill="#4a4a4a" />
        <circle cx="19" cy="5" r="0.5" fill="#4a4a4a" />
      </svg>
    </motion.div>
  );
}

export function ButterflySwarm({ count = 10 }: { count?: number }) {
  const colors = [
    "#8b5cf6", // Purple
    "#a78bfa", // Light purple
    "#c4b5fd", // Lavender
    "#ddd6fe", // Pale lavender
    "#7c3aed", // Violet
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#10b981", // Emerald
    "#3b82f6", // Blue
    "#ec4899", // Pink
  ];

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Butterfly 
          key={index} 
          color={colors[index % colors.length]} 
        />
      ))}
    </>
  );
}