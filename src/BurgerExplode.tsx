import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { burgerLayers } from "./data";
import "./BurgerExplode.css";

gsap.registerPlugin(ScrollTrigger);

export default function BurgerExplode() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const gap = () => Math.min(window.innerHeight * 0.14, 108);

      gsap.set(".burger-layer", {
        y: (i: number) => (i - 2.5) * 16,
        opacity: 0,
        scale: 0.9,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(".burger-whole", { opacity: 0, scale: 0.85, duration: 0.6 }, 0)
        .to(".burger-layer", { opacity: 1, scale: 1, duration: 0.4 }, 0.3)
        .to(
          ".burger-layer",
          { y: (i: number) => (i - 2.5) * gap(), duration: 1, ease: "power2.out" },
          0.5,
        )
        .to(".layer-label", { opacity: 1, duration: 0.4, stagger: 0.08 }, 1.3);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="explode-section" id="anatomy" ref={sectionRef}>
      <div className="explode-heading">
        <span className="eyebrow">INSIDE OUR SMASH BURGER</span>
        <h2>
          What's in your <em>burger?</em>
        </h2>
        <p>Keep scrolling and see every real ingredient.</p>
      </div>

      <div className="burger-stage">
        <img
          className="burger-whole"
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85"
          alt="Smash beef burger"
        />
        {burgerLayers.map((item, i) => (
          <div className="burger-layer" key={item.name + i} style={{ zIndex: 10 - i }}>
            <img src={item.image} alt={item.name} />
            <div className={`layer-label ${item.side}`}>
              <strong>{item.name}</strong>
              <span>{item.note}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}