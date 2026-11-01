import Icon from './Icon.jsx';
import React, { useEffect, useRef } from 'react';

export default function WinnerCelebration({ winner, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let fireworks = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const colors = ['#FFD100', '#F36E21', '#FF4D6D', '#00DBE9', '#10B981', '#A855F7', '#FFFFFF'];

    class Firework {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * (canvas.height * 0.45) + (canvas.height * 0.1);
        this.speed = Math.random() * 4 + 7;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.radius = 3;
        this.exploded = false;
      }

      update() {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.exploded = true;
          this.explode();
        }
      }

      explode() {
        const count = 40 + Math.floor(Math.random() * 30);
        for (let i = 0; i < count; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }

      draw() {
        if (!this.exploded) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
          ctx.fill();
        }
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.08;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.radius = Math.random() * 2.5 + 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.alpha -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    // Confetti particles
    class Confetti {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 6;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speedY = Math.random() * 2 + 1.5;
        this.speedX = (Math.random() - 0.5) * 2;
        this.rotation = Math.random() * 360;
        this.rotSpeed = (Math.random() - 0.5) * 8;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotSpeed;
        if (this.y > canvas.height + 20) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        ctx.restore();
      }
    }

    let confettiList = [];
    for (let i = 0; i < 50; i++) {
      confettiList.push(new Confetti());
    }

    let lastFireworkTime = 0;

    const loop = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (timestamp - lastFireworkTime > 350) {
        fireworks.push(new Firework());
        lastFireworkTime = timestamp;
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].exploded) {
          fireworks.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      confettiList.forEach((c) => {
        c.update();
        c.draw();
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    // Auto-proceed to results screen after 4.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(7, 6, 14, 0.75)',
      backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Canvas for fireworks & confetti */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Victory Celebration Card */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'rgba(26, 24, 52, 0.95)',
        backdropFilter: 'blur(30px)',
        border: '2px solid rgba(251, 191, 36, 0.6)',
        borderRadius: '28px',
        padding: '2.5rem 3.5rem',
        textAlign: 'center',
        boxShadow: '0 0 50px rgba(251, 191, 36, 0.35), 0 25px 60px rgba(0,0,0,0.8)',
        maxWidth: '520px',
        width: '90%',
        animation: 'celebratePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }}>
        {/* Glowing Trophy */}
        <div style={{
          fontSize: '5rem',
          lineHeight: 1,
          marginBottom: '0.75rem',
          filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))',
          animation: 'trophyBounce 1s infinite alternate ease-in-out'
        }}>
          🏆
        </div>

        {/* Victory Headline */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#FBBF24',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '0.9rem',
          fontWeight: 800,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
          backgroundColor: 'rgba(251, 191, 36, 0.15)',
          padding: '0.35rem 1rem',
          borderRadius: '9999px',
          border: '1px solid rgba(251, 191, 36, 0.35)'
        }}>
          <span>★ VICTORY CHAMPION ★</span>
        </div>

        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '2.75rem',
          fontWeight: 900,
          color: '#ffffff',
          margin: '0 0 0.5rem 0',
          letterSpacing: '-0.02em',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.4)'
        }}>
          {winner?.name || 'Player 1'} Won!
        </h1>

        <p style={{
          color: '#FFBE93',
          fontSize: '1.05rem',
          fontWeight: 700,
          margin: '0 0 1.5rem 0',
          fontFamily: "'Plus Jakarta Sans', sans-serif"
        }}>
          Successfully safely navigated the board with {winner?.color} tokens!
        </p>

        {/* Slogan */}
        <div style={{
          backgroundColor: 'rgba(13, 12, 28, 0.8)',
          border: '1px solid rgba(243, 110, 33, 0.3)',
          borderRadius: '12px',
          padding: '0.6rem 1rem',
          marginBottom: '1.75rem',
          color: '#FFA066',
          fontSize: '0.85rem',
          fontWeight: 700
        }}>
          💡 "Soch Kar, Samajh Kar, Invest Kar"
        </div>

        {/* Proceed Button */}
        <button
          onClick={onComplete}
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            padding: '0.85rem 2.25rem',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.1rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
            transition: 'all 0.2s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span>View Final Standings</span>
          <Icon className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</Icon>
        </button>
      </div>

      <style>{`
        @keyframes celebratePop {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes trophyBounce {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-10px) scale(1.08); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
