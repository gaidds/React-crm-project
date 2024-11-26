import React, { FC, useState, useEffect } from 'react';
import { DashboardResponse, DealStage } from './types';
import { fetchData, Header } from '../../components/FetchData';
import { DashboardUrl } from '../../services/ApiUrls';
import './styles.css';
import DashboardCard from '../../components/dashboard-card/DashboardCard';
import DealStagesDonutChart from './DealStagesDonutChart';
import DealSourcesBarChart from './DealSourcesBarChart';
import { FaLongArrowAltDown, FaLongArrowAltUp } from 'react-icons/fa';
import TopDealsTable from './TopDealsTable';
import MapDashboard from './MapDashboard';

const Dashboard: FC = () => {
  const [data, setData] = useState<DashboardResponse>();
  const [dealStages, setDealStages] = useState<DealStage[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      await fetchData(`${DashboardUrl}`, 'GET', null as any, Header).then(
        (res) => {
          if (!res.error) {
            setData(res || []);
            // Prepare data for the deal stages chart
            const stagesData: DealStage[] = [
              {
                state: 'ASSIGNED LEAD',
                count: res?.deal_stage_counts['ASSIGNED LEAD'] || 0,
                color: '#004E85',
              },
              {
                state: 'IN PROCESS',
                count: res?.deal_stage_counts['IN PROCESS'] || 0,
                color: '#1C7EC3',
              },
              {
                state: 'OPPORTUNITY',
                count: res?.deal_stage_counts['OPPORTUNITY'] || 0,
                color: '#1CBEC3',
              },
              {
                state: 'QUALIFICATION',
                count: res?.deal_stage_counts['QUALIFICATION'] || 0,
                color: '#EBDA25',
              },
              {
                state: 'NEGOTIATION',
                count: res?.deal_stage_counts['NEGOTIATION'] || 0,
                color: '#94C31C',
              },
              {
                state: 'CLOSED WON',
                count: res?.deal_stage_counts['CLOSED WON'] || 0,
                color: '#075F18',
              },
              {
                state: 'CLOSED LOST',
                count: res?.deal_stage_counts['CLOSED LOST'] || 0,
                color: '#CA1D1F',
              },
            ];
            setDealStages(stagesData);
          }
        }
      );
    } catch (erro) {
      console.error('Error fetching data', erro);
    }
  };

  const createSubContent = (growth: number) => {
    return growth >= 0 ? (
      <div>
        <FaLongArrowAltUp /> {`${growth}% from last month`}
      </div>
    ) : (
      <div>
        <FaLongArrowAltDown /> {`${growth}% from last month`}
      </div>
    );
  };

  const createSubContentColor = (growth: number) =>
    growth >= 0 ? 'green' : 'red';
  return (
    <div className="dashboard-container">
      <div className="dashboard-top-section">
        <DashboardCard
          title="Net Income"
          content={'€ ' + data?.total_revenue_in_euros}
          subContent={createSubContent(data?.net_income_growth_trendline || 0)}
          subContentColor={createSubContentColor(
            data?.net_income_growth_trendline || 0
          )}
        />
        <DashboardCard
          title="Deals"
          content={'' + data?.deals_count}
          subContent={createSubContent(data?.deals_change_trendline || 0)}
          subContentColor={createSubContentColor(
            data?.deals_change_trendline || 0
          )}
        />
        <DashboardCard
          title="Won Deals"
          content={data?.win_ratio + '%'}
          subContent={createSubContent(data?.percentage_change_closed_won || 0)}
          subContentColor={createSubContentColor(
            data?.percentage_change_closed_won || 0
          )}
        />
      </div>
      <div className="dashboard-section">
        <div className="dashboard-section-left">
          <DashboardCard
            title="Deal Sources"
            content={
              <DealSourcesBarChart data={data?.deal_sources_count || {}} />
            }
          />
        </div>
        <div className="dashboard-section-right">
          <DashboardCard
            title="Deals Overview"
            content={<DealStagesDonutChart data={dealStages} />}
          />
        </div>
      </div>
      <div className="dashboard-section">
        <div className="dashboard-section-left">
          <DashboardCard
            title="Top Deals"
            content={<TopDealsTable data={data?.top_five_deals || []} />}
          />
        </div>
        <div className="dashboard-section-right">
          <DashboardCard
            title="Deals"
            content={
              <MapDashboard
                dealsByCountry={data?.deals_group_by_country || {}}
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
