import React, { useState, useEffect, useRef } from 'react';

const WaterRacer = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [nitroActive, setNitroActive] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const touchControls = useRef({
    left: false,
    right: false,
    up: false,
    down: false
  });
  
  const gameRef = useRef({
    boat: {
      x: 250,
      y: 550,
      width: 45,
      height: 70,
      velocityX: 0,
      velocityY: 0,
      speed: 0,
      rotation: 0,
      drift: 0
    },
    keys: {},
    obstacles: [],
    bonuses: [],
    particles: [],
    waveOffset: 0,
    baseSpeed: 0,
    distance: 0,
    lastObstacleTime: 0,
    lastBonusTime: 0,
    nitroTime: 0,
    shieldTime: 0
  });

  const colors = {
    water: '#0a1628',
    waterDark: '#050d16',
    foam: '#4a90a4',
    boat: '#ff6b35',
    boatAccent: '#ffa500',
    rock: '#4a4a4a',
    buoy: '#ff1744',
    ship: '#8b4513',
    nitro: '#ff4500',
    shield: '#00ff88',
    star: '#ffd700'
  };

  useEffect(() => {
    const saved = localStorage.getItem('waterRacerHighScore');
    if (saved) setHighScore(parseInt(saved));
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId;

    const handleKeyDown = (e) => {
      gameRef.current.keys[e.key] = true;
    };

    const handleKeyUp = (e) => {
      gameRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const createObstacle = () => {
      const types = ['rock', 'rock', 'buoy', 'ship', 'rock'];
      const type = types[Math.floor(Math.random() * types.length)];
      const x = 120 + Math.random() * 260;
      
      return {
        x: x,
        y: -100,
        width: type === 'ship' ? 60 : type === 'rock' ? 50 : 35,
        height: type === 'ship' ? 90 : type === 'rock' ? 50 : 35,
        type: type,
        rotation: Math.random() * 360,
        passed: false
      };
    };

    const createBonus = () => {
      const types = ['nitro', 'shield', 'star'];
      const type = types[Math.floor(Math.random() * types.length)];
      const x = 140 + Math.random() * 220;
      
      return {
        x: x,
        y: -50,
        type: type,
        collected: false,
        pulse: 0,
        bob: 0
      };
    };

    const createParticle = (x, y, color = '#ffffff') => {
      return {
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4 - 2,
        life: 1,
        size: Math.random() * 3 + 1,
        color
      };
    };

    const createWake = (x, y) => {
      return {
        x,
        y,
        size: 5,
        life: 1,
        vx: (Math.random() - 0.5) * 2
      };
    };

    const drawBoat = (ctx, x, y, rotation, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(0, 5, 25, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.lineTo(-20, 25);
      ctx.lineTo(-15, 35);
      ctx.lineTo(15, 35);
      ctx.lineTo(20, 25);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = colors.boatAccent;
      ctx.fillRect(-12, -10, 24, 30);
      
      ctx.fillStyle = 'rgba(100, 150, 200, 0.7)';
      ctx.fillRect(-10, -5, 8, 8);
      ctx.fillRect(2, -5, 8, 8);
      
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-18, 30);
      ctx.lineTo(18, 30);
      ctx.stroke();
      
      ctx.restore();
      ctx.shadowBlur = 0;
    };

    const drawRock = (ctx, x, y, size, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      
      ctx.fillStyle = colors.rock;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const radius = size / 2 + (Math.random() - 0.5) * 10;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(-size/4, -size/4, size/3, size/3);
      
      ctx.restore();
      ctx.shadowBlur = 0;
    };

    const drawBuoy = (ctx, x, y) => {
      ctx.save();
      ctx.translate(x, y);
      
      ctx.fillStyle = colors.buoy;
      ctx.shadowBlur = 15;
      ctx.shadowColor = colors.buoy;
      
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-18, -3, 36, 6);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(-6, -6, 6, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
      ctx.shadowBlur = 0;
    };

    const drawShip = (ctx, x, y, rotation) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * Math.PI / 180);
      
      ctx.fillStyle = colors.ship;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      
      ctx.fillRect(-30, -40, 60, 80);
      
      ctx.fillStyle = '#654321';
      ctx.fillRect(-20, -30, 40, 40);
      
      ctx.fillStyle = 'rgba(255, 255, 100, 0.6)';
      ctx.fillRect(-15, -25, 10, 10);
      ctx.fillRect(5, -25, 10, 10);
      
      ctx.restore();
      ctx.shadowBlur = 0;
    };

    const checkCollision = (obj1, obj2, margin = 0) => {
      const dx = obj1.x - obj2.x;
      const dy = obj1.y - obj2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (obj1.width + obj2.width) / 2 - margin;
    };

    const gameLoop = () => {
      const game = gameRef.current;
      const boat = game.boat;
      
      ctx.fillStyle = colors.water;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      game.waveOffset += game.baseSpeed * 0.3;
      if (game.waveOffset > 40) game.waveOffset = 0;
      
      for (let y = -1; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          const waveY = y * 40 + game.waveOffset;
          const waveX = x * 50 + (y % 2) * 25;
          const alpha = 0.15 + Math.sin(waveY * 0.1 + x) * 0.1;
          
          ctx.fillStyle = `rgba(74, 144, 164, ${alpha})`;
          ctx.beginPath();
          ctx.ellipse(waveX, waveY, 15, 8, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = 'rgba(10, 22, 40, 0.3)';
      ctx.fillRect(100, 0, 300, canvas.height);

      ctx.strokeStyle = colors.foam;
      ctx.lineWidth = 8;
      ctx.shadowBlur = 20;
      ctx.shadowColor = colors.foam;
      ctx.strokeRect(100, 0, 300, canvas.height);
      ctx.shadowBlur = 0;

      const acceleration = 0.3;
      const maxSpeed = game.nitroTime > 0 ? 12 : 8;
      const minSpeed = -4;
      const turnSpeed = 0.35;
      const driftFactor = 0.15;
      const friction = 0.98;
      const waterFriction = 0.96;

      const controls = {
        up: game.keys['ArrowUp'] || game.keys['z'] || game.keys['w'] || touchControls.current.up,
        down: game.keys['ArrowDown'] || game.keys['s'] || touchControls.current.down,
        left: game.keys['ArrowLeft'] || game.keys['q'] || game.keys['a'] || touchControls.current.left,
        right: game.keys['ArrowRight'] || game.keys['d'] || touchControls.current.right
      };

      if (controls.up) {
        boat.speed = Math.min(boat.speed + acceleration, maxSpeed);
      } else if (controls.down) {
        boat.speed = Math.max(boat.speed - acceleration * 1.5, minSpeed);
      } else {
        boat.speed *= waterFriction;
        if (Math.abs(boat.speed) < 0.1) boat.speed = 0;
      }

      game.baseSpeed = Math.max(boat.speed, 2);

      if (controls.left) {
        boat.drift -= turnSpeed;
        boat.velocityX -= driftFactor * Math.abs(boat.speed) * 0.3;
        boat.rotation = Math.max(boat.rotation - 1.5, -30);
      } else if (boat.rotation < 0) {
        boat.rotation = Math.min(boat.rotation + 2, 0);
      }

      if (controls.right) {
        boat.drift += turnSpeed;
        boat.velocityX += driftFactor * Math.abs(boat.speed) * 0.3;
        boat.rotation = Math.min(boat.rotation + 1.5, 30);
      } else if (boat.rotation > 0) {
        boat.rotation = Math.max(boat.rotation - 2, 0);
      }

      boat.drift *= 0.88;
      boat.velocityX *= friction;
      boat.x += boat.velocityX;
      
      boat.velocityY = -boat.speed;
      boat.y += boat.velocityY;
      
      if (boat.y < 450) boat.y = 450;
      if (boat.y > 600) boat.y = 600;

      if (boat.x < 120) {
        boat.x = 120;
        boat.velocityX = Math.abs(boat.velocityX) * 0.3;
        for (let i = 0; i < 5; i++) {
          game.particles.push(createParticle(boat.x - 20, boat.y, colors.foam));
        }
      }
      if (boat.x > 380) {
        boat.x = 380;
        boat.velocityX = -Math.abs(boat.velocityX) * 0.3;
        for (let i = 0; i < 5; i++) {
          game.particles.push(createParticle(boat.x + 20, boat.y, colors.foam));
        }
      }

      setSpeed(Math.floor(Math.abs(boat.speed) * 10) / 10);
      game.distance += Math.max(boat.speed, 0);
      
      if (game.nitroTime > 0) {
        game.nitroTime--;
        boat.speed = Math.min(boat.speed + 0.2, 12);
        if (game.nitroTime === 0) setNitroActive(false);
        
        if (Math.random() < 0.5) {
          game.particles.push(createParticle(boat.x, boat.y + 40, colors.nitro));
        }
      }

      if (game.shieldTime > 0) {
        game.shieldTime--;
        if (game.shieldTime === 0) setShieldActive(false);
      }

      const now = Date.now();
      const spawnInterval = Math.max(2000 - game.baseSpeed * 150, 800);
      if (now - game.lastObstacleTime > spawnInterval) {
        game.obstacles.push(createObstacle());
        game.lastObstacleTime = now;
      }

      if (now - game.lastBonusTime > 5000) {
        game.bonuses.push(createBonus());
        game.lastBonusTime = now;
      }

      if (Math.random() < 0.3) {
        game.particles.push(createWake(boat.x - 15, boat.y + 30));
        game.particles.push(createWake(boat.x + 15, boat.y + 30));
      }

      game.obstacles = game.obstacles.filter(obs => {
        obs.y += game.baseSpeed;

        if (!obs.passed && obs.y > boat.y + 50) {
          obs.passed = true;
          setScore(s => s + 15);
          
          for (let i = 0; i < 8; i++) {
            game.particles.push(createParticle(obs.x, obs.y, '#00ff88'));
          }
        }

        if (obs.type === 'rock') {
          drawRock(ctx, obs.x, obs.y, obs.width, obs.rotation);
        } else if (obs.type === 'buoy') {
          drawBuoy(ctx, obs.x, obs.y);
        } else if (obs.type === 'ship') {
          drawShip(ctx, obs.x, obs.y, obs.rotation);
        }

        if (checkCollision(
          {x: boat.x, y: boat.y, width: boat.width},
          {x: obs.x, y: obs.y, width: obs.width},
          5
        )) {
          if (game.shieldTime > 0) {
            game.shieldTime = 0;
            setShieldActive(false);
            for (let i = 0; i < 30; i++) {
              game.particles.push(createParticle(obs.x, obs.y, colors.shield));
            }
            return false;
          } else {
            setGameState('gameOver');
            if (score > highScore) {
              setHighScore(score);
              localStorage.setItem('waterRacerHighScore', score.toString());
            }
          }
        }

        return obs.y < 750;
      });

      game.bonuses = game.bonuses.filter(bonus => {
        bonus.y += game.baseSpeed;
        bonus.pulse += 0.1;
        bonus.bob += 0.15;

        const bobY = bonus.y + Math.sin(bonus.bob) * 5;

        ctx.save();
        ctx.translate(bonus.x, bobY);
        
        const pulseScale = 1 + Math.sin(bonus.pulse) * 0.15;
        ctx.scale(pulseScale, pulseScale);
        
        const bonusColor = bonus.type === 'nitro' ? colors.nitro :
                           bonus.type === 'shield' ? colors.shield : colors.star;
        
        ctx.shadowBlur = 30;
        ctx.shadowColor = bonusColor;
        ctx.fillStyle = bonusColor;
        
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (bonus.type === 'nitro') ctx.fillText('🔥', 0, 0);
        else if (bonus.type === 'shield') ctx.fillText('🛡️', 0, 0);
        else ctx.fillText('⭐', 0, 0);
        
        ctx.restore();

        if (!bonus.collected && checkCollision(
          {x: boat.x, y: boat.y, width: boat.width},
          {x: bonus.x, y: bonus.y, width: 40}
        )) {
          bonus.collected = true;
          
          if (bonus.type === 'nitro') {
            game.nitroTime = 150;
            setNitroActive(true);
          } else if (bonus.type === 'shield') {
            game.shieldTime = 200;
            setShieldActive(true);
          } else {
            setScore(s => s + 100);
          }
          
          for (let i = 0; i < 20; i++) {
            game.particles.push(createParticle(bonus.x, bonus.y, bonusColor));
          }
          
          return false;
        }

        return bonus.y < 750;
      });

      game.particles = game.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        
        if (p.size < 10) {
          ctx.globalAlpha = p.life * 0.6;
          ctx.fillStyle = colors.foam;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        
        ctx.globalAlpha = 1;
        
        return p.life > 0;
      });

      if (game.shieldTime > 0) {
        ctx.save();
        ctx.translate(boat.x, boat.y);
        ctx.strokeStyle = colors.shield;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 25;
        ctx.shadowColor = colors.shield;
        
        const shieldPulse = Math.sin(Date.now() / 100) * 4;
        ctx.beginPath();
        ctx.arc(0, 0, 40 + shieldPulse, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
        ctx.shadowBlur = 0;
      }

      const boatColor = game.nitroTime > 0 ? '#ff3300' : colors.boat;
      drawBoat(ctx, boat.x, boat.y, boat.rotation, boatColor);

      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [gameState, score, highScore]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setSpeed(0);
    setNitroActive(false);
    setShieldActive(false);
    gameRef.current = {
      boat: {
        x: 250,
        y: 550,
        width: 45,
        height: 70,
        velocityX: 0,
        velocityY: 0,
        speed: 0,
        rotation: 0,
        drift: 0
      },
      keys: {},
      obstacles: [],
      bonuses: [],
      particles: [],
      waveOffset: 0,
      baseSpeed: 0,
      distance: 0,
      lastObstacleTime: Date.now(),
      lastBonusTime: Date.now(),
      nitroTime: 0,
      shieldTime: 0
    };
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    background: 'linear-gradient(135deg, #001a33 0%, #003d5c 50%, #006994 100%)',
    fontFamily: 'Arial, sans-serif'
  };

  const canvasContainerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '500px'
  };

  const canvasStyle = {
    position: 'relative',
    border: '4px solid #00d4ff',
    borderRadius: '8px',
    boxShadow: '0 0 60px rgba(0, 200, 255, 0.5)',
    width: '100%',
    maxHeight: '85vh',
    objectFit: 'contain',
    touchAction: 'none',
    display: 'block'
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '8px'
  };

  const buttonStyle = {
    padding: '16px 48px',
    fontSize: '24px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    background: 'linear-gradient(to right, #00d4ff, #0088ff)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 0 30px rgba(0, 200, 255, 0.5)',
    transition: 'transform 0.2s'
  };

  const titleStyle = {
    fontSize: '72px',
    fontWeight: 900,
    marginBottom: '32px',
    background: 'linear-gradient(135deg, #00d4ff 0%, #0088ff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'drop-shadow(0 0 30px rgba(0, 200, 255, 0.7))'
  };

  const hudStyle = {
    position: 'absolute',
    top: '16px',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    padding: '0 16px',
    color: 'white'
  };

  const hudItemStyle = {
    textAlign: 'center'
  };

  const hudLabelStyle = {
    fontSize: '12px',
    textTransform: 'uppercase',
    marginBottom: '4px',
    color: '#00d4ff'
  };

  const hudValueStyle = {
    fontSize: '32px',
    fontWeight: 'bold',
    textShadow: '0 0 20px rgba(0, 255, 255, 0.8)'
  };

  const touchButtonStyle = {
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(0, 212, 255, 0.4)',
    border: '2px solid #00d4ff',
    borderRadius: '8px',
    color: 'white',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    userSelect: 'none'
  };

  const touchControlsStyle = {
    position: 'absolute',
    bottom: '32px',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 32px'
  };

  return (
    <div style={containerStyle}>
      <div style={canvasContainerStyle}>
        <canvas
          ref={canvasRef}
          width={500}
          height={700}
          style={canvasStyle}
        />

        {gameState === 'playing' && (
          <>
            <div style={hudStyle}>
              <div style={hudItemStyle}>
                <div style={hudLabelStyle}>Score</div>
                <div style={hudValueStyle}>{score}</div>
              </div>
              <div style={hudItemStyle}>
                <div style={hudLabelStyle}>Vitesse</div>
                <div style={hudValueStyle}>{speed}</div>
              </div>
              <div style={hudItemStyle}>
                <div style={hudLabelStyle}>Record</div>
                <div style={hudValueStyle}>{highScore}</div>
              </div>
            </div>

            {isMobile && (
              <div style={touchControlsStyle}>
                <div style={{position: 'relative', width: '128px', height: '128px'}}>
                  <div
                    onTouchStart={() => touchControls.current.left = true}
                    onTouchEnd={() => touchControls.current.left = false}
                    style={{...touchButtonStyle, position: 'absolute', left: 0, top: '40px'}}
                  >
                    ←
                  </div>
                  <div
                    onTouchStart={() => touchControls.current.right = true}
                    onTouchEnd={() => touchControls.current.right = false}
                    style={{...touchButtonStyle, position: 'absolute', right: 0, top: '40px'}}
                  >
                    →
                  </div>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  <div
                    onTouchStart={() => touchControls.current.up = true}
                    onTouchEnd={() => touchControls.current.up = false}
                    style={{...touchButtonStyle, width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(0, 255, 0, 0.4)', borderColor: '#00ff00', fontSize: '32px'}}
                  >
                    ↑
                  </div>
                  <div
                    onTouchStart={() => touchControls.current.down = true}
                    onTouchEnd={() => touchControls.current.down = false}
                    style={{...touchButtonStyle, width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255, 0, 0, 0.4)', borderColor: '#ff0000', fontSize: '32px'}}
                  >
                    ↓
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {gameState === 'menu' && (
          <div style={overlayStyle}>
            <div style={{textAlign: 'center', padding: '32px'}}>
              <div style={titleStyle}>WATER<br/>RACER</div>
              <p style={{color: '#00d4ff', marginBottom: '32px', fontSize: '18px'}}>
                {isMobile ? 'Utilise les boutons tactiles !' : '↑ Accélérer | ↓ Freiner | ← → Tourner'}
              </p>
              <button onClick={startGame} style={buttonStyle}>
                NAVIGUER
              </button>
              {highScore > 0 && (
                <p style={{color: '#00d4ff', marginTop: '24px', fontSize: '20px'}}>
                  🏆 Meilleur: {highScore}
                </p>
              )}
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div style={overlayStyle}>
            <div style={{textAlign: 'center', padding: '32px'}}>
              <h2 style={{fontSize: '48px', color: '#ff0000', marginBottom: '24px', textShadow: '0 0 40px rgba(255, 0, 0, 0.8)'}}>
                NAUFRAGE!
              </h2>
              <div style={{color: 'white', marginBottom: '24px'}}>
                <div style={{color: '#00d4ff', fontSize: '18px', marginBottom: '8px'}}>Score final</div>
                <div style={{fontSize: '48px', fontWeight: 'bold', textShadow: '0 0 20px rgba(0, 255, 255, 0.8)'}}>{score}</div>
              </div>
              {score >= highScore && score > 0 && (
                <div style={{color: '#ffd700', fontSize: '24px', fontWeight: 'bold', marginBottom: '24px'}}>
                  🏆 NOUVEAU RECORD ! 🏆
                </div>
              )}
              <button onClick={startGame} style={buttonStyle}>
                REJOUER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterRacer;
