import React, { useEffect, useRef, useCallback, useState } from "react";
import { useTheme } from "./ThemeContext";

const CursorEffect = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerCursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const animationId = useRef<number>();
  const { theme } = useTheme();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect mobile touch devices (coarse pointer)
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  const colors = ["#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6"];

  const createParticle = useCallback(
    (x: number, y: number) => {
      const particle = document.createElement("div");
      particle.className = "fixed pointer-events-none z-50 transition-all duration-1000";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.transform = "translate(-50%, -50%) rotate(0deg)";
      particle.style.width = `${Math.random() * 8 + 6}px`;
      particle.style.height = `${Math.random() * 8 + 6}px`;
      particle.style.border = theme === "dark" ? "1.5px solid #ffffff" : "1.5px solid #0f172a";
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      document.body.appendChild(particle);

      setTimeout(() => {
        particle.style.opacity = "0";
        const angle = Math.random() * 360;
        const radius = Math.random() * 40 + 20;
        const rad = (angle * Math.PI) / 180;
        const tx = Math.cos(rad) * radius;
        const ty = Math.sin(rad) * radius;
        particle.style.transform = `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${angle}deg) scale(0.2)`;
      }, 50);

      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle);
        }
      }, 1000);
    },
    [theme]
  );

  const updateCursor = useCallback(() => {
    const dx = mousePos.current.x - cursorPos.current.x;
    const dy = mousePos.current.y - cursorPos.current.y;

    cursorPos.current.x += dx * 0.25;
    cursorPos.current.y += dy * 0.25;

    if (cursorRef.current) {
      cursorRef.current.style.left = `${cursorPos.current.x}px`;
      cursorRef.current.style.top = `${cursorPos.current.y}px`;
    }

    if (innerCursorRef.current) {
      innerCursorRef.current.style.left = `${mousePos.current.x}px`;
      innerCursorRef.current.style.top = `${mousePos.current.y}px`;
    }

    animationId.current = requestAnimationFrame(updateCursor);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isNavbar = target.closest("nav");
      const isClickable = target.closest("a, button, input, textarea");

      mousePos.current = { x: e.clientX, y: e.clientY };

      if (cursorRef.current && innerCursorRef.current) {
        if (isNavbar) {
          cursorRef.current.style.opacity = "0";
          innerCursorRef.current.style.opacity = "0";
          return;
        }

        cursorRef.current.style.opacity = "1";
        innerCursorRef.current.style.opacity = "1";

        if (isClickable) {
          cursorRef.current.style.width = "42px";
          cursorRef.current.style.height = "42px";
          cursorRef.current.style.backgroundColor =
            theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(15, 23, 42, 0.08)";
          innerCursorRef.current.style.width = "12px";
          innerCursorRef.current.style.height = "12px";
          innerCursorRef.current.style.backgroundColor = "#ef4444";
        } else {
          cursorRef.current.style.width = "28px";
          cursorRef.current.style.height = "28px";
          cursorRef.current.style.backgroundColor = "transparent";
          innerCursorRef.current.style.width = "8px";
          innerCursorRef.current.style.height = "8px";
          innerCursorRef.current.style.backgroundColor = theme === "dark" ? "#ffffff" : "#0f172a";
        }
      }

      if (Math.random() > 0.88 && !isNavbar) {
        createParticle(e.clientX, e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animationId.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [isTouchDevice, theme, updateCursor, createParticle]);

  // Completely omit custom cursor DOM on touch screens
  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-50 rounded-lg border-2 border-slate-900 dark:border-white transition-all duration-75 ease-out opacity-0 hidden md:block"
        style={{
          width: "28px",
          height: "28px",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        ref={innerCursorRef}
        className="fixed pointer-events-none z-50 rounded-sm transition-all duration-75 ease-out opacity-0 hidden md:block"
        style={{
          width: "8px",
          height: "8px",
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
};

export default CursorEffect;
