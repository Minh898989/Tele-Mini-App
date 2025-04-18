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
  const [playerPosition, setPlayerPosition] = useState(250);
  const { difficulty } = useParams();
  const navigate = useNavigate();

  const numericDifficulty = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
  const difficultyLabel = difficulty === "easy" ? "Dễ" : difficulty === "medium" ? "Trung bình" : "Khó";

  // Các loại gà khác nhau
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 400;

    let animationId;
    let frame = 0;

    const shootBullet = () => {
      bulletsRef.current.push({ x: playerPosition + 15, y: 360 });
    };

    const handleKeyDown = (e) => {
      if (e.code === "Space") shootBullet();
      if (e.code === "ArrowLeft" && playerPosition > 0) setPlayerPosition((prev) => prev - 15);
      if (e.code === "ArrowRight" && playerPosition < 570) setPlayerPosition((prev) => prev + 15);
    };
    window.addEventListener("keydown", handleKeyDown);

    const spawnChicken = () => {
      const randomChicken = chickenTypes[Math.floor(Math.random() * chickenTypes.length)];
      chickensRef.current.push({
        x: Math.random() * 550,
        y: -50,
        speed: randomChicken.speed * numericDifficulty, // tăng tốc độ theo độ khó
        hitPoints: randomChicken.hitPoints,
        score: randomChicken.score,
        type: randomChicken.type,
        image: randomChicken.image,
      });
    };

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Vẽ người chơi
      const playerImage = new Image();
      playerImage.src = "/images/playerShip1_blue.png";
      ctx.drawImage(playerImage, playerPosition, 350, 30, 30);

      // Di chuyển và vẽ gà
      chickensRef.current.forEach((chicken) => {
        const chickenImage = new Image();
        chickenImage.src = chicken.image;
        chicken.y += chicken.speed;
        ctx.drawImage(chickenImage, chicken.x, chicken.y, 30, 30);
      });

      chickensRef.current = chickensRef.current.filter((chicken) => chicken.y < canvas.height + 50);

      // Di chuyển và vẽ đạn
      bulletsRef.current.forEach((b) => {
        b.y -= 5;
        ctx.fillStyle = "red";
        ctx.fillRect(b.x, b.y, 5, 10);
      });

      bulletsRef.current = bulletsRef.current.filter((b) => b.y > 0);

      // Kiểm tra va chạm
      const newChickens = [];
      chickensRef.current.forEach((chicken) => {
        const hitIndex = bulletsRef.current.findIndex(
          (b) =>
            b.x >= chicken.x - 20 &&
            b.x <= chicken.x + 20 &&
            b.y >= chicken.y - 20 &&
            b.y <= chicken.y + 20
        );

        if (hitIndex !== -1) {
          chicken.hitPoints -= 1;
          if (chicken.hitPoints <= 0) {
            setScore((prev) => prev + chicken.score);
          } else {
            newChickens.push(chicken); // còn máu thì giữ lại
          }
          bulletsRef.current.splice(hitIndex, 1);
        } else {
          newChickens.push(chicken);
        }
      });

      chickensRef.current = newChickens;

      // Gọi gà theo tốc độ xuất hiện tương ứng với độ khó
      const spawnRate = 40 / numericDifficulty;
      if (frame % spawnRate === 0) spawnChicken();

      frame++;
      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [numericDifficulty, playerPosition]);

  return (
    <div className="game-container">
      <div className="score">Điểm: {score}</div>
      <div className="difficulty">Độ khó: {difficultyLabel}</div>
      <canvas ref={canvasRef} />
      <button onClick={() => navigate(-1)} className="back-button">
        Quay lại
      </button>
    </div>
  );
}
