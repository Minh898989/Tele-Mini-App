import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import "./Game.css";

const chickenTypes = [
  { type: "normal", score: 10, hitPoints: 1, speed: 1, image: "/images/enemyBlue2.png" },
  { type: "tough", score: 20, hitPoints: 2, speed: 1.2, image: "/images/enemyGreen2.png" },
  { type: "boss", score: 50, hitPoints: 3, speed: 0.8, image: "/images/enemyRed5.png" },
];


export default function Game() {
  const canvasRef = useRef(null);
  const bulletsRef = useRef([]);
  const chickensRef = useRef([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [playerPosition, setPlayerPosition] = useState(430);
  const [bulletLevel, setBulletLevel] = useState(1);
  const { difficulty } = useParams();
  const navigate = useNavigate();

  const numericDifficulty = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
  const difficultyLabel = difficulty === "easy" ? "Dễ" : difficulty === "medium" ? "Trung bình" : "Khó";
  
  

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 900;
    canvas.height = 700;

    let animationId;
    let frame = 0;

    const shootBullet = () => {
      switch (bulletLevel) {
        case 1:
          bulletsRef.current.push({ x: playerPosition + 25, y: 660, damage: 1 });
          break;
        case 2:
          bulletsRef.current.push({ x: playerPosition + 15, y: 660, damage: 1 });
          bulletsRef.current.push({ x: playerPosition + 35, y: 660, damage: 1 });
          break;
        case 3:
          bulletsRef.current.push({ x: playerPosition + 25, y: 660, damage: 2 });
          break;
        case 4:
          bulletsRef.current.push({ x: playerPosition + 10, y: 660, damage: 1 });
          bulletsRef.current.push({ x: playerPosition + 25, y: 660, damage: 1 });
          bulletsRef.current.push({ x: playerPosition + 40, y: 660, damage: 1 });
          break;
        default:
          bulletsRef.current.push({ x: playerPosition + 25, y: 660, damage: 1 });
      }
    };
    // Kiểm tra thiết bị

    const handleKeyDown = (e) => {
      if (isGameOver || isWin) return;
      if (e.code === "Space") shootBullet();
      if (e.code === "ArrowLeft" && playerPosition > 0) setPlayerPosition((prev) => prev - 10);
      if (e.code === "ArrowRight" && playerPosition < canvas.width - 60) setPlayerPosition((prev) => prev + 10);
    };

    window.addEventListener("keydown", handleKeyDown);

    const spawnChicken = () => {
      const randomChicken = chickenTypes[Math.floor(Math.random() * chickenTypes.length)];
      chickensRef.current.push({
        x: Math.random() * (canvas.width - 30),
        y: -50,
        speed: randomChicken.speed * numericDifficulty,
        hitPoints: randomChicken.hitPoints,
        score: randomChicken.score,
        type: randomChicken.type,
        image: randomChicken.image,
      });
    };

    const gameLoop = () => {
      if (isGameOver || isWin) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Vẽ người chơi
      const playerImage = new Image();
      playerImage.src = "/images/playerShip1_blue.png";
      ctx.drawImage(playerImage, playerPosition, 650, 60, 60);

      // Vẽ và xử lý gà
      const newChickens = [];
      chickensRef.current.forEach((chicken) => {
        const chickenImage = new Image();
        chickenImage.src = chicken.image;
        chicken.y += chicken.speed;
        ctx.drawImage(chickenImage, chicken.x, chicken.y, 30, 30);

        // Va chạm chính xác với người chơi
        const hitPlayer =
          chicken.y + 30 >= 650 &&
          chicken.y <= 710 &&
          chicken.x + 30 >= playerPosition &&
          chicken.x <= playerPosition + 60;

        if (hitPlayer) {
          setLives((prev) => {
            const newLives = prev - 1;
            if (newLives <= 0) setIsGameOver(true);
            return newLives;
          });
        } else if (chicken.y < canvas.height) {
          newChickens.push(chicken);
        }
      });
      chickensRef.current = newChickens;

      // Vẽ đạn
      const bulletImage = new Image();
      bulletImage.src = "/images/laserRed16.png";

      bulletsRef.current.forEach((b) => {
        b.y -= 7;
        ctx.drawImage(bulletImage, b.x, b.y, 10, 20);
      });
      bulletsRef.current = bulletsRef.current.filter((b) => b.y > 0);

      // Xử lý va chạm đạn với gà
      const remainingChickens = [];
      chickensRef.current.forEach((chicken) => {
        const hitIndex = bulletsRef.current.findIndex(
          (b) =>
            b.x >= chicken.x - 20 &&
            b.x <= chicken.x + 20 &&
            b.y >= chicken.y - 20 &&
            b.y <= chicken.y + 20
        );

        if (hitIndex !== -1) {
          chicken.hitPoints -= bulletsRef.current[hitIndex].damage;
          bulletsRef.current.splice(hitIndex, 1);

          if (chicken.hitPoints <= 0) {
            setScore((prev) => {
              const newScore = prev + chicken.score;
              if (newScore >= 1000) setIsWin(true);
              if (newScore >= 600) setBulletLevel(4);
              else if (newScore >= 300) setBulletLevel(3);
              else if (newScore >= 100) setBulletLevel(2);
              return newScore;
              
            });
            const killStats = JSON.parse(localStorage.getItem("killStats") || "{}");
  killStats[chicken.type] = (killStats[chicken.type] || 0) + 1;
  localStorage.setItem("killStats", JSON.stringify(killStats));
          } else {
            remainingChickens.push(chicken);
          }
        } else {
          remainingChickens.push(chicken);
        }
      });
      chickensRef.current = remainingChickens;

      // Sinh gà theo độ khó
      const baseSpawnRate = 30;
      const spawnRate = baseSpawnRate * (4 - numericDifficulty);
      if (frame % spawnRate === 0) spawnChicken();

      frame++;
      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [numericDifficulty, playerPosition, isGameOver, isWin, bulletLevel]);

  const handleRestart = () => {
    setScore(0);
    setLives(5);
    bulletsRef.current = [];
    chickensRef.current = [];
    setIsGameOver(false);
    setIsWin(false);
    setPlayerPosition(430);
    setBulletLevel(1);
  };

  return (
    <div className="game-container">
      <div className="score">Điểm: {score}</div>
      <div className="difficulty">Độ khó: {difficultyLabel}</div>
      <div className="lives">
        Mạng:
        {Array(lives)
          .fill(0)
          .map((_, i) => (
            <span key={i} style={{ color: "red", fontSize: "20px", marginRight: "4px" }}>
              ❤️
            </span>
          ))}
      </div>
      <canvas ref={canvasRef} />
      {(isGameOver || isWin) && (
        <div className="game-overlay">
          <h2>{isWin ? "🎉 Bạn đã thắng!" : "💀 Bạn đã thua!"}</h2>
          <button
            style={{ color: "black", fontFamily: "'Orbitron', sans-serif" }}
            onClick={handleRestart}
          >
            Chơi lại
          </button>
        </div>
      )}
      <button onClick={() => navigate(-1)} className="back-button">
        Quay lại
      </button>
    </div>
  );
}
