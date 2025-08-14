import { Variants } from "framer-motion";

export const scaleGlowRing: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
};

export const rotateRing: Variants = {
  animate: {
    rotate: 360,
    transition: { repeat: Infinity, ease: "linear", duration: 6 },
  },
};

export const buttonTap = { whileTap: { scale: 0.98 } };
