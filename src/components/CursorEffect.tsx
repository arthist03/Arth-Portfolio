import React, { useEffect, useRef, useCallback } from "react";
import { useTheme } from "./ThemeContext";

const CursorEffect = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerCursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const cursorPos = useRef({ x: -100, y: -100 });
  const animationId = useRef<number>();
  const { theme } = useTheme();

  const colors = ["#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6"];

  const createParticle = useCallback(
    (x: number, y: number) => {
      const particle = document.createElement("div");
      // Spawns a small solid square block
      particle.className = "fixed pointer-events-none z-50 transition-all duration-1000";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.transform = "translate(-50%, -50%) rotate(0deg)";
      particle.style.width = `${Math.random() * 8 + 6}px`;
      particle.style.height = `${Math.random() * 8 + 6}px`;
      particle.style.border = theme === "dark" ? "1.5px solid #ffffff" : "1.5px solid #0f172a";
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      document.body.appendChild(particle);

      // Animate flat block drifting and rotating
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

  const createRipple = useCallback(
    (x: number, y: number) => {
      const ripple = document.createElement("div");
      // stark square border ripple
      ripple.className = "fixed pointer-events-none z-40 transition-all duration-700 border-2";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.width = "10px";
      ripple.style.height = "10px";
      ripple.style.borderColor = theme === "dark" ? "#ffffff" : "#0f172a";
      ripple.style.backgroundColor = "transparent";

      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.style.width = "60px";
        ripple.style.height = "60px";
        ripple.style.opacity = "0";
      }, 50);

      setTimeout(() => {
        if (document.body.contains(ripple)) {
          document.body.removeChild(ripple);
        }
      }, 700);
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
          cursorRef.current.style.backgroundColor = theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(15, 23, 42, 0.08)";
          innerCursorRef.current.style.width = "12px";
          innerCursorRef.current.style.height = "12px";
          innerCursorRef.current.style.backgroundColor = "#ef4444"; // stark red highlight
        } else {
          cursorRef.current.style.width = "28px";
          cursorRef.current.style.height = "28px";
          cursorRef.current.style.backgroundColor = "transparent";
          innerCursorRef.current.style.width = "8px";
          innerCursorRef.current.style.height = "8px";
          innerCursorRef.current.style.backgroundColor = theme === "dark" ? "#ffffff" : "#0f172a";
        }
      }

      // Flat square particle trailing trail
      if (Math.random() > 0.85 && !isNavbar) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const handleMouseDown = () => {
      if (cursorRef.current && innerCursorRef.current) {
        cursorRef.current.style.transform = "translate(-50%, -50%) scale(0.75)";
        innerCursorRef.current.style.transform = "translate(-50%, -50%) scale(0.6)";
        createRipple(mousePos.current.x, mousePos.current.y);
      }
    };

    const handleMouseUp = () => {
      if (cursorRef.current && innerCursorRef.current) {
        cursorRef.current.style.transform = "translate(-50%, -50%) scale(1)";
        innerCursorRef.current.style.transform = "translate(-50%, -50%) scale(1)";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    animationId.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [updateCursor, createParticle, createRipple, theme]);

  return (
    <>
      {/* Outer retro square pointer */}
      <div
        ref={cursorRef}
        className="fixed w-7 h-7 pointer-events-none z-50 transition-all duration-150 ease-out border-[3px] border-slate-900 dark:border-white shadow-[2px_2px_0px_0px_#0f172a] dark:shadow-[2px_2px_0px_0px_#ffffff] -translate-x-1/2 -translate-y-1/2"
        style={{
          borderRadius: "4px", // slight rounded corners for block aesthetic
        }}
      />

      {/* Inner dot */}
      <div
        ref={innerCursorRef}
        className="fixed w-2 h-2 pointer-events-none z-50 rounded-none border border-slate-900 dark:border-white -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color] duration-150"
        style={{
          backgroundColor: theme === "dark" ? "#ffffff" : "#0f172a",
        }}
      />
    </>
  );
};

export default CursorEffect;