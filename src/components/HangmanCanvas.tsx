import React, { useEffect, useRef } from 'react';

interface HangmanCanvasProps {
  wrongGuesses: number;
}

const HangmanCanvas: React.FC<HangmanCanvasProps> = ({ wrongGuesses }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw hangman based on wrong guesses
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;

    if (wrongGuesses >= 1) {
      // Base line
      ctx.beginPath();
      ctx.moveTo(50, 250);
      ctx.lineTo(150, 250);
      ctx.stroke();
    }

    if (wrongGuesses >= 2) {
      // Pole
      ctx.beginPath();
      ctx.moveTo(100, 250);
      ctx.lineTo(100, 50);
      ctx.stroke();
    }

    if (wrongGuesses >= 3) {
      // Top beam
      ctx.beginPath();
      ctx.moveTo(100, 50);
      ctx.lineTo(200, 50);
      ctx.stroke();
    }

    if (wrongGuesses >= 4) {
      // Support beam
      ctx.beginPath();
      ctx.moveTo(100, 100);
      ctx.lineTo(150, 50);
      ctx.stroke();
    }

    if (wrongGuesses >= 5) {
      // Noose
      ctx.beginPath();
      ctx.moveTo(200, 50);
      ctx.lineTo(200, 70);
      ctx.stroke();
    }

    if (wrongGuesses >= 6) {
      // Head
      ctx.beginPath();
      ctx.arc(200, 90, 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (wrongGuesses >= 7) {
      // Body
      ctx.beginPath();
      ctx.moveTo(200, 110);
      ctx.lineTo(200, 170);
      ctx.stroke();
    }

    if (wrongGuesses >= 8) {
      // Left arm
      ctx.beginPath();
      ctx.moveTo(200, 120);
      ctx.lineTo(180, 150);
      ctx.stroke();
    }

    if (wrongGuesses >= 9) {
      // Right arm
      ctx.beginPath();
      ctx.moveTo(200, 120);
      ctx.lineTo(220, 150);
      ctx.stroke();
    }

    if (wrongGuesses >= 10) {
      // Left leg
      ctx.beginPath();
      ctx.moveTo(200, 170);
      ctx.lineTo(180, 200);
      ctx.stroke();
    }

    if (wrongGuesses >= 11) {
      // Right leg
      ctx.beginPath();
      ctx.moveTo(200, 170);
      ctx.lineTo(220, 200);
      ctx.stroke();
    }
  }, [wrongGuesses]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      style={{ border: '1px solid #000', marginBottom: '20px' }}
    />
  );
};

export default HangmanCanvas;