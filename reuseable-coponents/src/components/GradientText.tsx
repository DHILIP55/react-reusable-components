import  {  useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  direction?: "horizontal" | "vertical" | "diagonal";
  pauseOnHover?: boolean;
  yoyo?: boolean;
}

const GradientText = ({
  children,
  className = "",
  colors = ["#edaa25", "#fff19f", "#EAB308"],
  animationSpeed = 3,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
}: GradientTextProps) => {
  const [isPaused, setIsPaused] = useState(false);

  const progress = useMotionValue(0);

  const elapsedRef = useRef(0);

  const lastTimeRef = useRef<number | null>(null);

  const animationDuration = animationSpeed * 1000;

  useAnimationFrame((time) => {
    if (isPaused) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const delta = time - lastTimeRef.current;

    lastTimeRef.current = time;

    elapsedRef.current += delta;

    if (yoyo) {
      const cycle = animationDuration * 2;

      const cycleTime = elapsedRef.current % cycle;

      if (cycleTime < animationDuration) {
        progress.set((cycleTime / animationDuration) * 100);
      } else {
        progress.set(
          100 -
            ((cycleTime - animationDuration) / animationDuration) * 100
        );
      }
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100);
    }
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationSpeed, yoyo, progress]);

  const backgroundPosition = useTransform(progress, (p) => {
    switch (direction) {
      case "vertical":
        return `50% ${p}%`;

      case "diagonal":
        return `${p}% ${p}%`;

      default:
        return `${p}% 50%`;
    }
  });

  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${[
      ...colors,
      colors[0],
    ].join(",")})`,
    backgroundSize: "300% 100%",
    backgroundRepeat: "repeat",
  };

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  return (
    <motion.span
      className={`inline-block text-transparent bg-clip-text ${className}`}
      style={{
        ...gradientStyle,
        backgroundPosition,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.span>
  );
};

export default GradientText;