import React, { useRef, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa'; // Import message plane icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../Styles/HomePage.css'; // Import the CSS file

const HomePage = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.globalCompositeOperation = 'lighter';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const textStrip = ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ', 'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'];

    const stripCount = 60,
      stripX = new Array(),
      stripY = new Array(),
      dY = new Array(),
      stripFontSize = new Array();

    for (let i = 0; i < stripCount; i++) {
      stripX[i] = Math.floor(Math.random() * canvas.width);
      stripY[i] = -100;
      dY[i] = Math.floor(Math.random() * 7) + 3;
      stripFontSize[i] = Math.floor(Math.random() * 16) + 8;
    }

    const theColors = ['#cefbe4', '#81ec72', '#5cd646', '#54d13c', '#4ccc32', '#43c728'];

    const drawStrip = (x, y) => {
      for (let k = 0; k <= 20; k++) {
        const randChar = textStrip[Math.floor(Math.random() * textStrip.length)];
        if (context.fillText) {
          context.fillStyle = theColors[k % theColors.length]; // Cycle through colors
          context.fillText(randChar, x, y);
        }
        y -= stripFontSize[k];
      }
    };

    const drawBackground = () => {
      context.fillStyle = 'rgba(255, 255, 255, 0.1)'; // Semi-transparent background
      context.fillRect(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      drawBackground(); // Draw the background first
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.shadowOffsetX = context.shadowOffsetY = 0;
      context.shadowBlur = 8;
      context.shadowColor = '#94f475';

      for (let j = 0; j < stripCount; j++) {
        context.font = stripFontSize[j] + 'px sans-serif';
        context.textBaseline = 'top';
        context.textAlign = 'center';

        if (stripY[j] > canvas.height) {
          stripX[j] = Math.floor(Math.random() * canvas.width);
          stripY[j] = -100;
          dY[j] = Math.floor(Math.random() * 7) + 3;
          stripFontSize[j] = Math.floor(Math.random() * 16) + 8;
        }
        drawStrip(stripX[j], stripY[j]);
        stripY[j] += dY[j];
      }
      requestAnimationFrame(draw);
    };

    draw();

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  // Navigate to /login when the button is clicked
  const handleButtonClick = () => {
    navigate('/login');
  };

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="canvas" />
      <button className="button" onClick={handleButtonClick}>
        <FaPaperPlane className="icon1" />
      </button>
    </div>
  );
};

export default HomePage;
