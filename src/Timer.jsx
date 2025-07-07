import { useEffect, useRef, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import useSound from "use-sound";
import "./Timer.css";

const Timer = () => {
  const [workDuration, setWorkDuration] = useState(30000);
  const [restDuration, setRestDuration] = useState(30000);
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("work");
  const [isFinished, setIsFinished] = useState(false);
  const [displayPrecision, setDisplayPrecision] = useState(2);
  const [totalRounds, setTotalRounds] = useState(3);
  const [currentRound, setCurrentRound] = useState(1);

  const timerRef = useRef(null);
  const lastBeepSecondRef = useRef(null);

  // 使用 use-sound 加載音效
  const [playBeep] = useSound("/beep.mp3", { volume: 1.0 });
  const [playWinSound] = useSound("/Winning-sound-effect.mp3", { volume: 1.0 });

  const currentDuration = mode === "work" ? workDuration : restDuration;
  const percentage = Math.round((1 - timeLeft / currentDuration) * 100);

  useEffect(() => {
    if (!isRunning) return;

    const start = Date.now();
    const end = start + timeLeft;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, end - now);
      setTimeLeft(remaining);

      const secondsLeft = Math.floor(remaining / 1000);
      if (
        secondsLeft < 3 &&
        secondsLeft >= 0 &&
        secondsLeft !== lastBeepSecondRef.current
      ) {
        lastBeepSecondRef.current = secondsLeft;
        playBeep(); // 播放音效
      }

      if (remaining === 0) {
        clearInterval(timerRef.current);
        setIsRunning(false);
        setIsFinished(true);
        playWinSound();

        if (mode === "work") {
          if (currentRound < totalRounds) {
            setTimeout(() => {
              setMode("rest");
              setTimeLeft(restDuration);
              setIsFinished(false);
              setIsRunning(true);
            }, 0);
          } else {
            setMode("done");
            setIsFinished(true);
            setIsRunning(false);
          }
        } else if (mode === "rest") {
          if (currentRound < totalRounds) {
            setTimeout(() => {
              setMode("work");
              setTimeLeft(workDuration);
              setCurrentRound((prev) => prev + 1);
              setIsFinished(false);
              setIsRunning(true);
            }, 0);
          }
        }
      }
    };

    timerRef.current = setInterval(updateTimer, 20); // 增加間隔至100ms

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft, mode, playBeep, playWinSound]);

  const handleStart = () => {
    if (timeLeft > 0) {
      setIsRunning(true);
      setIsFinished(false);
    }
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setCurrentRound(1);
    setMode("work");
    // setTimeLeft(mode === "work" ? workDuration : restDuration);
    setTimeLeft(workDuration);
  };

  const togglePrecision = () => {
    setDisplayPrecision((prev) => (prev === 0 ? 2 : 0));
  };

  const handleWorkDurationChange = (e) => {
    const val = Math.max(0, Number(e.target.value)) * 1000;
    setWorkDuration(val);
    if (mode === "work") setTimeLeft(val);
  };

  const handleRestDurationChange = (e) => {
    const val = Math.max(0, Number(e.target.value)) * 1000;
    setRestDuration(val);
    if (mode === "rest") setTimeLeft(val);
  };

  const handleTotalRoundsChange = (e) => {
    const value = Math.max(1, Number(e.target.value)); // 至少 1 組
    setTotalRounds(value);
  };

  const getProgressColor = () => {
    if (percentage > 80) return "#f44336";
    if (percentage > 50) return "#ff9800";
    return "#4caf50";
  };

  return (
    <div className="timer-content">
      <div className={`progress-ring ${percentage > 80 ? "warning-ring" : ""}`}>
        <CircularProgressbar
          key={mode + timeLeft} // 每次模式變換或剩餘時間變化時強制重渲染
          value={percentage}
          text={`${(timeLeft / 1000).toFixed(displayPrecision)}`}
          styles={buildStyles({
            pathColor: getProgressColor(),
            textColor: "#333",
            trailColor: "#eee",
            rotation: 0,
            pathTransitionDuration: 0.75, // 保持這個為 0.75 秒過渡
            counterClockwise: true,
          })}
        />
      </div>

      <h2>{mode === "work" ? "🔥 運動中" : "💤 休息中"}</h2>
      {/* <h2>剩餘：{(timeLeft / 1000).toFixed(displayPrecision)} 秒</h2> */}
      <h4>
        第 {currentRound} 組 / 共 {totalRounds} 組
      </h4>
      <button onClick={isRunning ? handlePause : handleStart}>
        {isRunning ? "暫停" : "開始"}
      </button>
      {/* <button onClick={handlePause}>暫停</button> */}
      <button onClick={handleReset}>重設</button>
      <button onClick={togglePrecision}>
        {displayPrecision == 0 ? "切換成毫秒" : "切換成秒"}
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          padding: "0 20px",
        }}
      >
        <div>
          <h3>運動時間（秒）</h3>
          <input
            type="number"
            min="0"
            value={workDuration / 1000}
            onChange={handleWorkDurationChange}
            style={{ width: "80px", fontSize: "1rem" }}
          />
        </div>

        <div>
          <h3>休息時間（秒）</h3>
          <input
            type="number"
            min="0"
            value={restDuration / 1000}
            onChange={handleRestDurationChange}
            style={{ width: "80px", fontSize: "1rem" }}
          />
        </div>

        <div>
          <h3>組數</h3>
          <input
            type="number"
            min="0"
            value={totalRounds}
            onChange={handleTotalRoundsChange}
            style={{ width: "80px", fontSize: "1rem" }}
          />
        </div>
      </div>

      {isFinished && <h2>🎉 時間到了！</h2>}
    </div>
  );
};

export default Timer;
