import React, { FC } from 'react';
import { useState, useEffect } from 'react';
import { DashboardResponse } from './types';
import { fetchData, Header } from '../../components/FetchData';
import { DashboardUrl } from '../../services/ApiUrls';
import './styles.css';

const Dashboard: FC = () => {
  const [data, setData] = useState<DashboardResponse>();

  useEffect(()=>{fetchDashboard();});

  const fetchDashboard = async () => {
    try {
      await fetchData(`${DashboardUrl}`, 'GET', null as any, Header).then(
        (res) => {
          if (!res.error) {
            setData(res || []);
          }
        }
      );
    } catch (erro) {
      console.error('Error fetching data', erro);
    }
  };

  return <div className="dashboard-container">
    <div className="dashboard-top-section">
    <div>{/* add the Net income section to the dashboard */} </div>
    <div> {/* add the Deals Number section to the dashboard */} </div>
    <div> {/* add the Win Ratio section to the dashboard */} </div>
    </div>
    <div>
      <div>{/* add the Deal Sources section to the dashboard */}</div>
      <div>{/* add the Deal Overview section to the dashboard */}</div>
    </div>
    <div>
      <div>{/* add the Top Deals section to the dashboard */}</div>
      <div>{/* add the Customers by Countries section to the dashboard */}</div>
    </div>
  </div>
};

export default Dashboard;
