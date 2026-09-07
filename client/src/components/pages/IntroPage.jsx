import { useEffect, useRef } from 'react';
import bgImage from '../../assets/firstPageBackground.jpeg';

const BRAND = 'FASHION GALAXY';

export default function IntroPage() {
  const particleRef = useRef(null);

  useEffect(() => {
    const container = particleRef.current;
    if (!container) return;

    // Create 12 floating particles
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('div');
      dot.className = 'particle';
      const size = Math.random() * 3 + 1.5;
      dot.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${60 + Math.random() * 40}%;
        animation-duration: ${5 + Math.random() * 8}s;
        animation-delay: ${Math.random() * 4}s;
      `;
      container.appendChild(dot);
    }

    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return (
    <div className="page intro-page">
      {/* Ken Burns background — actual image */}
      <div
        className="intro-bg"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Floating particles */}
      <div className="intro-particles" ref={particleRef} />

      {/* Main content */}
      <div className="intro-content">
        {/* Brand name — letter by letter */}
        <div className="intro-brand" aria-label={BRAND}>
          {BRAND.split('').map((char, i) => (
            <span
              key={i}
              className="letter"
              style={{ animationDelay: `${0.05 * i + 0.2}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </div>

        {/* Divider line */}
        <div className="intro-divider" />

        {/* Tagline */}
        <div className="intro-tagline">Curriculum vitae : The course of life of people in fashion.</div>
      </div>


    </div>
  );
}
