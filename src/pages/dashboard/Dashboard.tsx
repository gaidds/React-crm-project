import React, { FC } from 'react';
import { useState, useEffect } from 'react';
import { DashboardResponse } from './types';
import { fetchData, Header } from '../../components/FetchData';
import { DashboardUrl } from '../../services/ApiUrls';
import './styles.css';
import DashboardCard from '../../components/dashboard-card/DashboardCard';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';

const Dashboard: FC = () => {
  const [data, setData] = useState<DashboardResponse>();

  useEffect(() => {
    fetchDashboard();
  }, []);

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

  const createSubContent = (growth: number) => {
    let result = (
      <div>
        <FaLongArrowAltDown /> {`${growth}% from last month`}
      </div>
    );
    if (growth >= 0)
      result = (
        <div>
          <FaLongArrowAltUp /> {`${growth}% from last month`}
        </div>
      );
    return result;
  };

  const createSubContentColor = (growth: number) =>
    growth >= 0 ? 'green' : 'red';
  console.log(data);
  return (
    <div className="dashboard-container">
      <div className="dashboard-top-section">
        <div>
          <DashboardCard
            title="Net Income"
            content={'€ ' + data?.total_revenue_in_euros}
            subContent={createSubContent(
              data?.net_income_growth_trendline || 0
            )}
            subContentColor={createSubContentColor(
              data?.net_income_growth_trendline || 0
            )}
          />
        </div>
        <div>
          <DashboardCard
            title="Deals"
            content={'' + data?.deals_count}
            subContent={createSubContent(data?.deals_change_trendline || 0)}
            subContentColor={createSubContentColor(
              data?.deals_change_trendline || 0
            )}
          />
        </div>
        <div>
          <DashboardCard
            title="Won Deals"
            content={data?.win_ratio + '%'}
            subContent={createSubContent(
              data?.percentage_change_closed_won || 0
            )}
            subContentColor={createSubContentColor(
              data?.percentage_change_closed_won || 0
            )}
          />
        </div>
      </div>
      <div>
        <div>{/* add the Deal Sources section to the dashboard */}</div>
        <div>{/* add the Deal Overview section to the dashboard */}</div>
      </div>
      <div>
        <div>{/* add the Top Deals section to the dashboard */}</div>
        <div>
          {/* add the Customers by Countries section to the dashboard */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
