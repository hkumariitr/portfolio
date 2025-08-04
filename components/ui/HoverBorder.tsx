"use client";
import React, { useState, useEffect, ElementType, ReactNode, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

interface HoverBorderGradientProps extends React.HTMLAttributes<HTMLElement> {
  as?: ElementType;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
  children?: ReactNode;
}

export const HoverBorderGradient = forwardRef<HTMLElement, HoverBorderGradientProps>(
  ({
    as = "button",
    containerClassName,
    className,
    duration = 1,
    clockwise = true,
    children,
    onMouseEnter,
    onMouseLeave,
    ...rest
  }, ref) => {
    const Tag = as;

    const [hovered, setHovered] = useState(false);
    const [direction, setDirection] = useState<Direction>("TOP");

    const rotateDirection = (current: Direction): Direction => {
      const directions: Direction[] = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
      const index = directions.indexOf(current);
      const nextIndex = clockwise
        ? (index - 1 + directions.length) % directions.length
        : (index + 1) % directions.length;
      return directions[nextIndex];
    };

    const movingMap: Record<Direction, string> = {
      TOP: "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
      LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
      BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
      RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, hsl(0, 0%, 100%) 0%, rgba(255, 255, 255, 0) 100%)",
    };

    const highlight =
      "radial-gradient(75% 181.16% at 50% 50%, #3275F8 0%, rgba(255, 255, 255, 0) 100%)";

    useEffect(() => {
      if (!hovered) {
        const interval = setInterval(() => {
          setDirection((prev) => rotateDirection(prev));
        }, duration * 1000);
        return () => clearInterval(interval);
      }
    }, [hovered, duration, clockwise]);

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
      setHovered(true);
      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
      setHovered(false);
      onMouseLeave?.(event);
    };

    return React.createElement(
      Tag,
      {
        ref,
        ...rest,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        className: cn(
          "relative flex rounded-full border content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
          containerClassName
        ),
      },
      <>
        <div
          className={cn(
            "w-auto text-white z-10 bg-black px-4 py-2 rounded-[inherit]",
            className
          )}
        >
          {children}
        </div>
        <motion.div
          className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
          style={{
            filter: "blur(2px)",
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          initial={{ background: movingMap[direction] }}
          animate={{
            background: hovered
              ? [movingMap[direction], highlight]
              : movingMap[direction],
          }}
          transition={{ ease: "linear", duration }}
        />
        <div className="bg-black absolute z-1 flex-none inset-[2px] rounded-[100px]" />
      </>
    );
  }
);

HoverBorderGradient.displayName = "HoverBorderGradient";