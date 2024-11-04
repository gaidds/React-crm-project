import React, { FC } from 'react';
import { DashboardCardProps } from './types';
import './styles.css';

const DashboardCard: FC<DashboardCardProps> = ({
  title,
  content,
  subContent,
  subContentColor,
}) => {
  return (
    <div className="dashboard-card-container">
      <h3 className="dashboard-card-title">{title}</h3>
      <div className="dashboard-card-content">{content}</div>
      <div
        className={`dashboard-card-sub-content ${
          subContentColor === 'red'
            ? 'dashboard-card-sub-content-red'
            : 'dashboard-card-sub-content-green'
        }`}
      >
        {subContent}
      </div>
    </div>
  );
};

export default DashboardCard;
