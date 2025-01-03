import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import pressedButton from "../../../assets/wheel/button-active.png";
import normalButton from "../../../assets/wheel/button-normal.png";
import frameImage from "../../../assets/wheel/frame.png";
import css from "./Wheel.module.scss";

const segmentColors = ["#a83edb", "#21996c"];
const borderColor = ["#10593e", "#571877"];
const textColor = ["#b8eae7", "#ffb6ff"];

const SecondWheel = ({ segments, onSpinEnd, title }) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const spinResult = useSelector((state) => state.spin);
  const [isPressed, setIsPressed] = useState(false);

  const data = useMemo(() => {
    if (segments && segments.length > 0) {
      return segments.map((segment, index) => ({
        option: segment.name,
        color: segmentColors[index % segmentColors.length],
        border: borderColor[index % borderColor.length],
        text: textColor[index % textColor.length],
      }));
    }
    return [];
  }, [segments]);

  useEffect(() => {
    if (spinResult.status === "succeeded" && isSpinning) {
      const prizeIndex = segments.findIndex(
        (segment) => segment.name === spinResult.secondWheelPrize.name
      );
      const segmentAngle = 360 / segments.length;
      const prizeAngle = segmentAngle * prizeIndex;
      const extraRotation = 360 * 5;
      const totalRotation =
        extraRotation + (360 - prizeAngle - segmentAngle / 2);

      const spinDuration = 3000;

      const animate = (startTime) => {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = elapsed / spinDuration;

        if (progress < 1) {
          const easeOutQuad = (t) => t * (2 - t);
          setRotation(totalRotation * easeOutQuad(progress));
          requestAnimationFrame(() => animate(startTime));
        } else {
          setRotation(totalRotation % 360);
          setTimeout(() => {
            onSpinEnd();
            setIsSpinning(false);
          }, 500);
        }
      };

      requestAnimationFrame(() => animate(performance.now()));
    }
  }, [spinResult, segments, onSpinEnd, isSpinning]);

  const [spinWheelSound] = useState(
    new Audio(require("../../../assets/sounds/spin-232536.mp3"))
  );

  const handlePlaySpinWheelSound = () => {
    spinWheelSound.loop = false;
    spinWheelSound.volume = 1;
    spinWheelSound.play().catch((error) => {
      console.error("Ошибка воспроизведения аудио:", error);
    });
  };

  const handleSpinClick = () => {
    setIsSpinning(true);
    handlePlaySpinWheelSound();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawWheel = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      data.forEach((segment, index) => {
        const angle =
          (index * 2 * Math.PI) / data.length + rotation * (Math.PI / 180);
        const nextAngle =
          ((index + 1) * 2 * Math.PI) / data.length +
          rotation * (Math.PI / 180);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, angle, nextAngle);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();

        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          radius
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.31)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.31)");

        ctx.lineWidth = 8;
        ctx.strokeStyle = gradient;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle + (nextAngle - angle) / 2);
        ctx.rotate(Math.PI / 2);

        ctx.fillStyle = segment.text;
        ctx.font = "60px RaceSport, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.lineWidth = 4;
        ctx.strokeStyle = segment.border;
        ctx.strokeText(segment.option, 0, -radius / 2);
        ctx.fillText(segment.option, 0, -radius / 2);

        ctx.restore();
      });
    };

    drawWheel();
  }, [data, rotation]);

  return (
    <div>
      <h2 className={css.title}>{title}</h2>
      <div className={css.hidden}>Spins left:</div>
      <div className={css.wheelContainer}>
        <div className={css.wheelFrame}>
          <img src={frameImage} alt="Frame" className={css.frameImage} />
          <div className={css.wrapper}>
            <canvas ref={canvasRef} width="500" height="500" />
          </div>
        </div>
      </div>
      <button
        onClick={handleSpinClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        className={css.spinButton}
      >
        <img
          src={isPressed || isSpinning ? pressedButton : normalButton}
          alt="Spin Button"
        />
      </button>
    </div>
  );
};

export default SecondWheel;
