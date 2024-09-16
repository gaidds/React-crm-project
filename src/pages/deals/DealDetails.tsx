import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DealUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';
import { Box, Container, Paper } from '@mui/material';
import { CustomToolbar } from '../../styles/CssStyled';
import DynamicModal from '../../components/modal/modal';
import { useMyContext } from '../../context/Context';


interface Deal {
  name: string;
  account_name: string;
  assigned_to: [{
    user_details:{ 
      email:string;}
  }];
  contacts: [{
    first_name:string;
    last_name: string;
  }];
  website: string;
  stage: string;
  deal_source: string;
  industry: string;
  currency: string;
  country: string;
  value: string;
  probability: number;
  close_date: string;
  description: string;
  tags: string[];
  created_by: { id: string; }
}

const DealDetails: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>(); 
  const [deal, setDeal] = useState<Deal | null>(null);
  const [data, setData] = useState<any[]>([]);
  const { userRole, setUserRole , userId} = useMyContext();

  useEffect(() => { if (dealId) {
    fetchDeal();
    getDeals();
  }
}, [dealId]);

const getDeals = async () => {
        const Header = {Accept: 'application/json', 'Content-Type': 'application/json', Authorization: localStorage.getItem('Token'), org: localStorage.getItem('org')};
        try {
            await fetchData(`${DealUrl}`,'GET',null as any,Header).then((res) => {
                if (!res.error) {
                    setData(res || []);
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const fetchDeal = async () => {
        const Header = {Accept: 'application/json','Content-Type': 'application/json',Authorization: localStorage.getItem('Token'),org: localStorage.getItem('org')};
        try {
            await fetchData(`${DealUrl}/${dealId}`,'GET',null as any,Header).then((res) => {
                if (!res.error) {
                    setDeal(res?.deal_obj);
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
  if (!deal) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ mt: '60px' }}>
      <CustomToolbar sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {(userRole === 'ADMIN' || 
                                                                    deal.created_by.id === userId || 
                                                                    deal.assigned_to.some((assignee: any) => assignee.user_details.id === userId)) && (
                                                                      <DynamicModal page='Deals' id={dealId} mode='edit' data={data} onSaveSuccess={async () => {
                                                                        await fetchDeal();}} />
                                                          )}
      </CustomToolbar>
      <Container sx={{ width: '100%', maxWidth: '100%', minWidth: '100%'}}>
        <Box sx={{ width: '100%', minWidth: '100%', m: '15px 0px 0px 0px'}}>
            <Paper sx={{ width: 'calc(100% - 15px)', mb: 2, p: '15px 15px 15px 15px', borderRadius:'16px' }}>
                <div>
                  <h1>Deal Details</h1>
                  <p><strong>Name:</strong> {deal.name}</p>
                  <p><strong>Account:</strong> {deal.account_name}</p>
                  <p><strong>Assigned To:</strong> {deal.assigned_to.map(user => user.user_details.email).join(', ')}</p>
                  <p><strong>Contacts:</strong> {deal.contacts[0].first_name} {deal.contacts[0].last_name}</p>
                  <p><strong>Website:</strong> {deal.website}</p>
                  <p><strong>Stage:</strong> {deal.stage}</p>
                  <p><strong>Deal Source:</strong> {deal.deal_source}</p>
                  <p><strong>Industry:</strong> {deal.industry}</p>
                  <p><strong>Currency:</strong> {deal.currency}</p>
                  <p><strong>Country:</strong> {deal.country}</p>
                  <p><strong>Value:</strong> {deal.value}</p>
                  <p><strong>Probability:</strong> {deal.probability}%</p>
                  <p><strong>Close Date:</strong> {new Date(deal.close_date).toLocaleDateString()}</p>
                  <p><strong>Description:</strong> {deal.description}</p>
                  <p><strong>Tags:</strong> {deal.tags.join(', ')}</p>
                </div>
              </Paper>
            </Box>
          </Container>
      </Box>
  );
};

export default DealDetails;
