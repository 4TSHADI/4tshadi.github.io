import React from 'react';

export default function Hero() {
  const roles = [ "creative engineer" , "Visual Communicator", "Researcher", "Animator", "Filmmaker"];
  
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-greeting">Hi! I'm Amantle <span className="sparkle-icon">✺</span></p>
        <h1 className="hero-title">
          I am a 
          <div className="scrolling-words-container"> 
            <ul className="scrolling-words">
              {roles.map((role, i) => (
                <li key={i}>{role}</li>
              ))}
              {/* Duplicate first element for seamless loop */}
              <li aria-hidden="true">{roles[0]}</li>
            </ul>
          </div>
        </h1>
      </div>
    </section>
  );
}
