import React, { useState, useEffect } from 'react';

function CountdownTimer({ countdown, onFinish }) {
  const [seconds, setSeconds] = useState(countdown);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else {
        clearInterval(intervalId);
        onFinish();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds, onFinish]);

  return <span>{seconds}</span>;
}

export default CountdownTimer;
