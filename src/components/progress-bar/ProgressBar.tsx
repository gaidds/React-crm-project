import { FC, useEffect, useRef, useState } from 'react';
import { Stack, LinearProgress, Box } from '@mui/material';
import './styles.css';
import { ProgressBarProps } from './types';

const ProgressBar: FC<ProgressBarProps> = ({ status, currentState }) => {
  const [totalWidth, setTotalWidth] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [progressValue, setProgressValue] = useState<number>(0);
  const [progressColor, setProgressColor] = useState<string>('#000000');

  const ref = useRef<HTMLDivElement>(null);

  const calculateProgressValue = (
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
    const currentStateIndex = status.findIndex((s) => s.state === currentState);

    if (currentStateIndex !== -1) {
      setProgressColor(status[currentStateIndex].color);
    }

    setTotalWidth(ref.current ? ref.current.offsetWidth : 0);
    setWidth(totalWidth / statusLength);
    setProgressValue(calculateProgressValue(currentStateIndex, statusLength));
  }, [ref.current, totalWidth, status, currentState]);

  return (
    <Stack spacing={2} sx={{ flexGrow: 1 }}>
      <div className="progress-bar-container" ref={ref}>
        <LinearProgress
          variant="determinate"
          value={progressValue}
          sx={{
            '& .MuiLinearProgress-bar': {
              backgroundColor: progressColor,
            },
          }}
        />
      </div>
      <div className="progress-bar-labels-container">
        {status?.map(({ state, color }) => (
          <Box
            key={state}
            sx={{
              width: `${width}px`,
              textAlign: 'center',
            }}
            className="progress-bar-label"
          >
            {currentState === state && (
              <div className="progress-bar-circle"></div>
            )}
            {state.toUpperCase()}
          </Box>
        ))}
      </div>
    </Stack>
  );
};

export default ProgressBar;
