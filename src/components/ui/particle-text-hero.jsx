import { useEffect, useRef, useState } from 'react';

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.maxSpeed = 4.0;
    this.maxForce = 0.3;
    this.closeEnoughTarget = 80;
    this.isKilled = false;
    this.startColor = { r: 0, g: 0, b: 0 };
    this.targetColor = { r: 255, g: 255, b: 255 };
    this.colorWeight = 0;
    this.colorBlendRate = 0.04;
  }

  move() {
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2)
    );

    let proximityMult = 1;
    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(
      towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y
    );

    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }

    const currentColor = {
      r: Math.round(
        this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight
      ),
      g: Math.round(
        this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight
      ),
      b: Math.round(
        this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight
      ),
    };

    ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
    ctx.fillRect(this.pos.x, this.pos.y, 2.5, 2.5);
  }

  kill(width, height) {
    if (!this.isKilled) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.max(width, height);
      this.target.x = width / 2 + Math.cos(angle) * distance;
      this.target.y = height / 2 + Math.sin(angle) * distance;

      this.startColor = {
        r:
          this.startColor.r +
          (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g:
          this.startColor.g +
          (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b:
          this.startColor.b +
          (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;
      this.isKilled = true;
    }
  }
}

export default function ParticleTextHero({ words = [] }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef();
  const frameCountRef = useRef(0);
  const wordIndexRef = useRef(0);

  const [currentWord, setCurrentWord] = useState(words[0] || '');

  const pixelSteps = 5;

  const generateRandomPos = (x, y, mag) => {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: x + Math.cos(angle) * mag,
      y: y + Math.sin(angle) * mag,
    };
  };

  const nextWord = (word, canvas) => {
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext('2d');

    offscreenCtx.fillStyle = 'white';
    offscreenCtx.font = 'bold 80px Arial';
    offscreenCtx.textAlign = 'center';
    offscreenCtx.textBaseline = 'middle';
    offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2);

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    const newTargets = [];
    for (let y = 0; y < canvas.height; y += pixelSteps) {
      for (let x = 0; x < canvas.width; x += pixelSteps) {
        const index = (y * canvas.width + x) * 4;
        const alpha = pixels[index + 3];

        if (alpha > 128) {
          newTargets.push({
            x,
            y,
            color: {
              r: pixels[index],
              g: pixels[index + 1],
              b: pixels[index + 2],
            },
          });
        }
      }
    }

    // Kill extra particles
    for (let i = newTargets.length; i < particlesRef.current.length; i++) {
      particlesRef.current[i].kill(canvas.width, canvas.height);
    }

    // Create new particles if needed
    while (particlesRef.current.length < newTargets.length) {
      const p = new Particle();
      const randomPos = generateRandomPos(
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );
      p.pos.x = randomPos.x;
      p.pos.y = randomPos.y;
      particlesRef.current.push(p);
    }

    // Assign targets to particles
    for (let i = 0; i < newTargets.length; i++) {
      const target = newTargets[i];
      particlesRef.current[i].target = { x: target.x, y: target.y };
      particlesRef.current[i].startColor = particlesRef.current[i].targetColor;
      particlesRef.current[i].targetColor = target.color;
      particlesRef.current[i].colorWeight = 0;
      particlesRef.current[i].isKilled = false;
    }
  };

  useEffect(() => {
    if (!words || words.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      if (words.length > 0) {
        nextWord(words[wordIndexRef.current], canvas);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial word
    if (words.length > 0) {
      nextWord(words[0], canvas);
      setCurrentWord(words[0]);
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        p.move();
        p.draw(ctx);
      });

      frameCountRef.current++;

      // Change word every 120 frames (about 2 seconds)
      if (frameCountRef.current % 120 === 0 && words.length > 1) {
        wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
        nextWord(words[wordIndexRef.current], canvas);
        setCurrentWord(words[wordIndexRef.current]);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [words]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}
