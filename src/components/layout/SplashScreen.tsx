import { motion } from "framer-motion";
import { scaleGlowRing, rotateRing } from "@/animations/componentAnimations";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background">
      <div className="relative w-40 h-40">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30 glow"
          variants={rotateRing}
          animate="animate"
        />
        <motion.div
          className="absolute inset-4 rounded-3xl gradient-primary shadow-glow"
          variants={scaleGlowRing}
          initial="initial"
          animate="animate"
        />
        <div className="absolute inset-0 grid place-items-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-lg font-semibold"
          >
            SmartCalc+
          </motion.span>
        </div>
      </div>
    </div>
  );
}
