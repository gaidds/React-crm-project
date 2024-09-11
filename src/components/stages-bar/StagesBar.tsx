import { FC } from 'react';
import './styles.css';
import { StagesBarProps } from './types';

const StagesBar: FC<StagesBarProps> = ({ stages, vertical }) => {
  return (
    <div className={`stages-bar-container${vertical ? '-vertical' : ''}`}>
      {stages?.map(({ name, color }) => (
        <div className="stages-bar-stage-container">
          <div
            className="stages-bar-stage-top"
            style={{ backgroundColor: color }}
          >
            <div className="stages-bar-circle"></div>
          </div>
          <span className="stages-bar-label">{name.toUpperCase()}</span>
        </div>
      ))}
    </div>
  );
};

export default StagesBar;
