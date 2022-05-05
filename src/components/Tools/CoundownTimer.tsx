import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 60,
  strokeWidth: 2,
};

const renderTime = (time: number) => {
  return (
    <div className="text-xl">
      <div className="time">{time}</div>
    </div>
  );
};

const getTimeSeconds = (time: number) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time: number) =>
  ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time: number) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time: number) => (time / daySeconds) | 0;

export default function CoundownTimer({ timestamp }: { timestamp: number }) {
  // These come from the blockchain
  const startTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = startTime + timestamp / 1000; // use UNIX timestamp in seconds
  console.log(startTime + timestamp);

  const remainingTime = endTime - startTime;
  const days = Math.ceil(remainingTime / daySeconds);
  const daysDuration = days * daySeconds;

  return (
    <div className="grid grid-cols-4 grid-rows-1 place-items-center">
      <div>
        <CountdownCircleTimer
          {...timerProps}
          colors="#46ADAA"
          duration={daysDuration}
          initialRemainingTime={remainingTime}
        >
          {({ elapsedTime, color }) => (
            <span style={{ color }}>
              {renderTime(getTimeDays(daysDuration - elapsedTime))}
            </span>
          )}
        </CountdownCircleTimer>
        <div className="text-xs mt-2" style={{ color: "#46ADAA" }}>
          days
        </div>
      </div>
      <div>
        <CountdownCircleTimer
          {...timerProps}
          colors="#46ADAA"
          duration={daySeconds}
          initialRemainingTime={remainingTime % daySeconds}
          onComplete={(totalElapsedTime) => ({
            shouldRepeat: remainingTime - totalElapsedTime > hourSeconds,
          })}
        >
          {({ elapsedTime, color }) => (
            <span style={{ color }}>
              {renderTime(getTimeHours(daySeconds - elapsedTime))}
            </span>
          )}
        </CountdownCircleTimer>
        <div className="text-xs mt-2" style={{ color: "#46ADAA" }}>
          Hours
        </div>
      </div>
      <div>
        <CountdownCircleTimer
          {...timerProps}
          colors="#46ADAA"
          duration={hourSeconds}
          initialRemainingTime={remainingTime % hourSeconds}
          onComplete={(totalElapsedTime) => ({
            shouldRepeat: remainingTime - totalElapsedTime > minuteSeconds,
          })}
        >
          {({ elapsedTime, color }) => (
            <span style={{ color }}>
              {renderTime(getTimeMinutes(hourSeconds - elapsedTime))}
            </span>
          )}
        </CountdownCircleTimer>
        <div className="text-xs mt-2" style={{ color: "#46ADAA" }}>
          Minutes
        </div>
      </div>
      <div>
        <CountdownCircleTimer
          {...timerProps}
          colors="#46ADAA"
          duration={minuteSeconds}
          initialRemainingTime={remainingTime % minuteSeconds}
          onComplete={(totalElapsedTime) => ({
            shouldRepeat: remainingTime - totalElapsedTime > 0,
          })}
        >
          {({ elapsedTime, color }) => (
            <span style={{ color }}>
              {renderTime(getTimeSeconds(elapsedTime))}
            </span>
          )}
        </CountdownCircleTimer>
        <div className="text-xs mt-2" style={{ color: "#46ADAA" }}>
          Seconds
        </div>
      </div>
    </div>
  );
}
