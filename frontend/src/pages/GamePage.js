import React, { useEffect, useRef, useState } from 'react';

const GamePage = () => {
  const canvasRef = useRef(null);
  const playerRef = useRef({ x: 400, y: 600, width: 60, height: 60 });
  const bulletsRef = useRef([]);
  const enemiesRef = useRef([]);
  const keysRef = useRef({});
  const scoreRef = useRef(0);
  const hitCountRef = useRef(0);

  const [gameOver, setGameOver] = useState(false);
  const [images, setImages] = useState({});

  // Load all images
  useEffect(() => {
    const loadImage = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
      });

    const loadImages = async () => {
      const [player, bullet, enemy1, enemy2, enemy3, background] = await Promise.all([
        loadImage('/images/playerShip1_blue.png'),
        loadImage('/images/laserRed16.png'),
        loadImage('/images/enemyBlack3.png'),
        loadImage('/images/enemyGreen1.png'),
        loadImage('/images/enemyRed5.png'),
        loadImage('https://img.pikbest.com/ai/illus_our/20230422/a38920d0d1e7c9c765f37965c6b24623.jpg!w700wp'),
      ]);
      setImages({ player, bullet, enemy1, enemy2, enemy3, background });
    };

    loadImages();
  }, []);

  // Main game logic
  useEffect(() => {
    if (!images.player || !images.bullet || !images.enemy1 || !images.background) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let lastEnemySpawn = 0;

    const spawnEnemy = () => {
      const type = Math.floor(Math.random() * 3) + 1; // Random type 1,2,3
      enemiesRef.current.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 40,
        height: 40,
        type: type,   // loại enemy
        hp: type,     // máu tương ứng (1,2,3)
      });
    };

    const isColliding = (a, b) => {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    };

    const update = (deltaTime) => {
      if (gameOver) return;

      // Player movement
      const speed = 7;
      if (keysRef.current['ArrowLeft'] && playerRef.current.x > 0) {
        playerRef.current.x -= speed;
      }
      if (keysRef.current['ArrowRight'] && playerRef.current.x < canvas.width - playerRef.current.width) {
        playerRef.current.x += speed;
      }
      if (keysRef.current['ArrowUp'] && playerRef.current.y > 0) {
        playerRef.current.y -= speed;
      }
      if (keysRef.current['ArrowDown'] && playerRef.current.y < canvas.height - playerRef.current.height) {
        playerRef.current.y += speed;
      }

      // Move bullets
      bulletsRef.current = bulletsRef.current
        .map((bullet) => ({ ...bullet, y: bullet.y - 15 }))
        .filter((bullet) => bullet.y > 0);

      // Move enemies
      enemiesRef.current = enemiesRef.current
        .map((enemy) => ({ ...enemy, y: enemy.y + 1 }));

      // Bullet vs Enemy collision
      bulletsRef.current.forEach((bullet, bulletIndex) => {
        enemiesRef.current.forEach((enemy, enemyIndex) => {
          if (isColliding({ ...bullet, width: 10, height: 20 }, enemy)) {
            bulletsRef.current.splice(bulletIndex, 1);
            enemy.hp -= 1; // giảm máu

            if (enemy.hp <= 0) {
              enemiesRef.current.splice(enemyIndex, 1);
              scoreRef.current += enemy.type; // cộng điểm theo loại
            }
          }
        });
      });

      // Enemy vs Player collision
      enemiesRef.current = enemiesRef.current.filter((enemy) => {
        if (isColliding(playerRef.current, enemy)) {
          setGameOver(true);
          return false;
        }
        if (enemy.y > canvas.height) {
          hitCountRef.current += 1;
          if (hitCountRef.current >= 10) {
            setGameOver(true);
          }
          return false;
        }
        return true;
      });

      // Spawn new enemies every 1.5s
      lastEnemySpawn += deltaTime;
      if (lastEnemySpawn > 1500) {
        spawnEnemy();
        lastEnemySpawn = 0;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);

      // Draw player
      ctx.drawImage(
        images.player,
        playerRef.current.x,
        playerRef.current.y,
        playerRef.current.width,
        playerRef.current.height
      );

      // Draw bullets
      bulletsRef.current.forEach((bullet) => {
        ctx.drawImage(images.bullet, bullet.x, bullet.y, 10, 20);
      });

      // Draw enemies
      enemiesRef.current.forEach((enemy) => {
        const enemyImage = images[`enemy${enemy.type}`];
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
      });

      // Draw score
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(`🎯Hạ: ${scoreRef.current}`, 10, 30);
      ctx.fillText(`❤️Mạng: ${hitCountRef.current}`, 10, 60);

      if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '50px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2);
      }
    };

    let lastTime = performance.now();
    const gameLoop = (timestamp) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      update(deltaTime);
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    // Key events
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true;
      if (e.key === ' ' && !gameOver) {
        bulletsRef.current.push({
          x: playerRef.current.x + playerRef.current.width / 2 - 5,
          y: playerRef.current.y,
        });
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [images, gameOver]);

  return (
    <div style={{ textAlign: 'center', paddingTop: 30 }}>
      <h1>🎮 BẮN GÀ SIÊU VUI 🐔</h1>
      <canvas
        ref={canvasRef}
        width={950}
        height={700}
        style={{ border: '3px solid black', borderRadius: 10 }}
      />
    </div>
  );
};

export default GamePage;
