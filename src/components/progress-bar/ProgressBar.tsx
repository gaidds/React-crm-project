import { FC, useEffect, useRef, useState } from 'react';
import { Stack, LinearProgress } from '@mui/material';
import './styles.css';
import { ProgressBarProps } from './types';

const ProgressBar: FC<ProgressBarProps> = ({ status, currentState }) => {
  const [totalWidth, setTotalWidth] = useState<number>(0);
  const [width, setWidht] = useState<number>(0);
  const [progressValue, setProgressValue] = useState<number>(0);

  const ref = useRef<HTMLDivElement>(null);

  const calculateProgressVlaue = (
    currentStateIndex: number,
    statusLength: number
  ) => {
    let result = 100;
    if (currentStateIndex !== statusLength - 1) {
      result =
        (100 / statusLength) * (currentStateIndex + 1) - 100 / statusLength / 2;
    }
    return result;
  };

  useEffect(() => {
    const statusLength = status.length;
    const currentStateIndex = status.indexOf(currentState);
    setTotalWidth(ref.current ? ref.current.offsetWidth : 0);
    setWidht(totalWidth / statusLength);
    setProgressValue(calculateProgressVlaue(currentStateIndex, statusLength));
  }, [ref.current]);

  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <div className="progress-bar-container" ref={ref}>
        <LinearProgress variant="determinate" value={progressValue} />
      </div>
      <div className="progress-bar-labels-container">
        {status?.map((state) => (
          <span
            style={{ width: `${width}px`, textAlign: 'center' }}
            className="progress-bar-label"
          >
            {currentState === state && (
              <div className="progress-bar-circle"></div>
            )}
            {state.toUpperCase()}
          </span>
        ))}
      </div>
    </Stack>
  );
};

export default ProgressBar;
