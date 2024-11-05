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
  console.log(data);

  useEffect(() => {
    fetchDashboard();
  });

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

  return (
    <div className="dashboard-container">
      <div className="dashboard-top-section">
        <div>
          <DashboardCard
            title="Net Income"
            content={'€ ' + data?.total_revenue_in_euros}
            subContent={
              data?.net_income_growth_trendline &&
              data?.net_income_growth_trendline > 0 ? (
                <div>
                  <FaLongArrowAltUp />{' '}
                  {`${data?.net_income_growth_trendline}% from last month`}
                </div>
              ) : (
                <div>
                  <FaLongArrowAltDown />{' '}
                  {`${data?.net_income_growth_trendline}% from last month`}
                </div>
              )
            }
            subContentColor={
              data?.net_income_growth_trendline &&
              data?.net_income_growth_trendline > 0
                ? 'green'
                : 'red'
            }
          />{' '}
        </div>
        <div>
          <DashboardCard
            title="Deals"
            content={'' + data?.deals_count}
            subContent={
              data?.deals_change_trendline &&
              data?.deals_change_trendline > 0 ? (
                <div>
                  <FaLongArrowAltUp />{' '}
                  {`${data?.deals_change_trendline}% from last month`}
                </div>
              ) : (
                <div>
                  <FaLongArrowAltDown />{' '}
                  {`${data?.deals_change_trendline}% from last month`}
                </div>
              )
            }
            subContentColor={
              data?.deals_change_trendline && data?.deals_change_trendline > 0
                ? 'green'
                : 'red'
            }
          />{' '}
        </div>
        <div> {/* add the Win Ratio section to the dashboard */} </div>
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
