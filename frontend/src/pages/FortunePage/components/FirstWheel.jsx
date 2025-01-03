import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import pressedButton from "../../../assets/wheel/button-active.png";
import normalButton from "../../../assets/wheel/button-normal.png";
import dogeImage from "../../../assets/wheel/Doge.png";
import frameImage from "../../../assets/wheel/frame.png";
import spinsImage from "../../../assets/wheel/Free-spin.png";
import loseImage from "../../../assets/wheel/Lose.png";
import pepeImage from "../../../assets/wheel/Pepe.png";
import usdtImage from "../../../assets/wheel/Tether.png";
import tokenImage from "../../../assets/wheel/Token.png";
import { spinWheel } from "../../../redux/features/spinSlice";
import css from "./Wheel.module.scss";
import ClosedPlanetContent from "../../../Components/Contents/ClosedPlanetContent";
import ComingSoonContent from "../../../Components/Contents/ComingSoonContent";

const segmentColors = ["#a83edb", "#21996c"];

const segmentConfig = {
  "Free spin": {
    img: "spinsImage",
    sizeMultiplier: 0.25,
    offsetMultiplier: 0.35,
  },
  Token: {
    img: "tokenImage",
    sizeMultiplier: 0.6,
    offsetMultiplier: 0.65,
  },
  USDT: {
    img: "usdtImage",
    sizeMultiplier: 0.55,
    offsetMultiplier: 0.65,
  },
  Lose: {
    img: "loseImage",
    sizeMultiplier: 0.25,
    offsetMultiplier: 0.35,
  },
  PEPE: {
    img: "pepeImage",
    sizeMultiplier: 0.55,
    offsetMultiplier: 0.65,
  },
  SHIB: {
    img: "dogeImage",
    sizeMultiplier: 0.55,
    offsetMultiplier: 0.65,
  },
};

const FirstWheel = ({ segments, onSpinEnd, title, openModal }) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [localSpins, setLocalSpins] = useState(0);
  const user = useSelector((state) => state.user);
  const spinResult = useSelector((state) => state.spin);
  const [isPressed, setIsPressed] = useState(false);
  const dispatch = useDispatch();
  const [preloadedImages, setPreloadedImages] = useState({});
  const user_id = useSelector((state) => state.user.userId);

  // const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const imageSources = {
      tokenImage,
      spinsImage,
      usdtImage,
      loseImage,
      pressedButton,
      normalButton,
      frameImage,
      pepeImage,
      dogeImage,
    };

    const images = {};
    let loadedCount = 0;
    const totalImages = Object.keys(imageSources).length;

    const onImageLoad = () => {
      loadedCount += 1;
      if (loadedCount === totalImages) {
        setPreloadedImages(images);
      }
    };

    Object.keys(imageSources).forEach((key) => {
      const img = new Image();
      img.src = imageSources[key];
      img.onload = onImageLoad;
      images[key] = img;
    });
  }, []);

  useEffect(() => {
    setLocalSpins(user.spins);
  }, [user.spins]);

  const data = useMemo(() => {
    return segments.map((segment, index) => {
      const config = segmentConfig[segment.specialType] || {};
      const imgKey = config.img;
      const image = preloadedImages[imgKey]
        ? {
            img: preloadedImages[imgKey],
            sizeMultiplier: config.sizeMultiplier,
            offsetMultiplier: config.offsetMultiplier,
          }
        : null;

      return {
        option: segment.name,
        image: image,
        color: segmentColors[index % segmentColors.length],
        specialType: segment.specialType,
      };
    });
  }, [segments, preloadedImages]);

  useEffect(() => {
    if (spinResult.status === "succeeded" && isSpinning) {
      const prizeIndex = segments.findIndex(
        (segment) => segment.name === spinResult.firstWheelPrize.name
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
    if (localSpins === 0) {
      openModal("get-spins");
    }

    if (user.spins > 0 && !isSpinning) {
      handlePlaySpinWheelSound();

      setIsSpinning(true);
      dispatch(spinWheel(user_id));
      setLocalSpins(localSpins - 1);
    }
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

        if (segment.image) {
          const img = segment.image.img;
          if (img) {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + (nextAngle - angle) / 2);
            const imgWidth = img.width * (segment.image.sizeMultiplier || 1);
            const imgHeight = img.height * (segment.image.sizeMultiplier || 1);

            if (
              segment.specialType !== "Free spin" &&
              segment.specialType !== "Lose"
            ) {
              ctx.rotate(Math.PI / 2);
              ctx.drawImage(
                img,
                -imgWidth / 2,
                -radius * segment.image.offsetMultiplier - imgHeight / 2,
                imgWidth,
                imgHeight
              );
            } else {
              ctx.drawImage(
                img,
                radius * segment.image.offsetMultiplier,
                -imgHeight / 2,
                imgWidth,
                imgHeight
              );
            }

            ctx.restore();
          }
        } else {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle + (nextAngle - angle) / 2);
          ctx.fillStyle = "#000000";
          ctx.fillText(segment.option, radius / 3, 0);
          ctx.restore();
        }
      });
    };

    drawWheel();
  }, [data, rotation, preloadedImages]);

  return (
    <>
      <h2 className={css.title}>{title}</h2>
      <p className={css.spins}>Spins left: {localSpins}</p>
      <div className={css.wheelContainer}>
        <div className={css.wheelFrame}>
          <img
            src={
              preloadedImages.frameImage
                ? preloadedImages.frameImage.src
                : frameImage
            }
            alt="Frame"
            className={css.frameImage}
          />
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
          src={
            isPressed || isSpinning
              ? preloadedImages.pressedButton
                ? preloadedImages.pressedButton.src
                : pressedButton
              : preloadedImages.normalButton
              ? preloadedImages.normalButton.src
              : normalButton
          }
          alt="Spin Button"
        />
      </button>
    </>
  );
};

export default FirstWheel;
