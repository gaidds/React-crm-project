import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DealUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';
import { Box, Container, Paper, Grid } from '@mui/material';
import { CustomToolbar } from '../../styles/CssStyled';
import DynamicModal from '../../components/modal/modal';
import { useMyContext } from '../../context/Context';
import ProgressBar from '../../components/progress-bar/ProgressBar';
import ContactDetails from '../../components/ContactInfo';
import ButtonsComponent from '../../components/Notesattachments';
import DescriptionComponent from '../../components/DealsDescription';

  const stages = [
    { state: 'ASSIGNED LEAD', color: '#004E85' },
    { state: 'IN PROCESS', color: '#1C7EC3' },
    { state: 'OPPORTUNITY', color: '#1CBEC3' },
    { state: 'QUALIFICATION', color: '#EBDA25' },
    { state: 'NEGOTIATION', color: '#94C31C' },
    { state: 'CLOSED', color: '#075F18' },
  ];

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
    primary_email: string;
    mobile_number: string;
    department: string;
    address: {
      address_line: string;
      city: string;
      country: string;
      postcode: string;
      state: string;
      street: string;
    }

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
  const { userRole, setUserRole , userId } = useMyContext();

  useEffect(() => { 
    if (dealId) {
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

  const handleSaveDescription = (updatedDescription: string) => {
    const submitForm = async () => {
      const data = {
        description: updatedDescription,  // Only updating the description field
      };
  
      const Header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token') ?? '',
        org: localStorage.getItem('org') ?? '',
      };
  
      try {
        // Using PATCH for partial update
        const res = await fetchData(`${DealUrl}/${dealId}/`, 'PATCH', JSON.stringify(data), Header);
        if (!res.error) {
          console.log('Description updated successfully:', res);
          await fetchDeal();  // Re-fetch the updated deal
        } else {
          console.error('Error updating description:', res.error);
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    };
  
    submitForm();
  };
  
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
              <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
              <Box sx={{ padding: '0px 0px 0px 100px' }}>
                <h1>{deal.name}</h1>
              </Box>
              <Box sx={{ padding: '0px 0px 0px 100px',  color:'grey'}}>
              <h2> {deal.website}</h2>
              </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ padding: '80px 0px 0px 500px' }}>
                  <p>
                    <strong>
                      {deal.stage === 'CLOSED WIN' || deal.stage === 'CLOSED LOST'
                        ? 'Close Date:'
                        : 'Expected Closing Date:'}
                    </strong>{' '}
                    {new Date(deal.close_date).toLocaleDateString()}
                  </p>
                </Box>
              </Grid>
              </Grid>
              <Grid container spacing={2} paddingRight={25} paddingLeft={25} mb={10}>
                <Grid item xs={12} sm={12}>
              <ProgressBar status={stages} currentState={deal.stage} />
              </Grid>
              </Grid>
            <Grid container spacing={2} padding={'0px 0px 80px 80px'}>
              <Grid item xs={12} sm={4}>
              <ContactDetails
                src='data:image/png;base64,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'
                fullName={`${deal.contacts[0]?.first_name ?? '---'} ${deal.contacts[0]?.last_name ?? '---'}`}
                email={deal.contacts[0]?.primary_email ?? '---'}
                phone={deal.contacts[0]?.mobile_number ?? '---'}
                department={deal.contacts[0]?.department ?? '---'}
                address={`
                  ${deal.contacts[0]?.address?.street ?? '---'}, ${deal.contacts[0]?.address?.city ?? '---'},
                  ${deal.contacts[0]?.address?.state ?? '---'}, ${deal.contacts[0]?.address?.postcode ?? '---'}, 
                  ${deal.contacts[0]?.address?.country ?? '---'}
                `}
              />
              </Grid>
              <Grid item xs={12} sm={4} >
                <Box sx={{ lineHeight: 3 }}>
                  <p><strong>Account:</strong> {deal.account_name}</p>
                  <p><strong>Industry:</strong> {deal.industry}</p>
                  <p><strong>Deal Source:</strong> {deal.deal_source}</p>
                  <p><strong>Probability:</strong> {deal.probability}%</p>
                  <p><strong>Assigned To:</strong> {deal.assigned_to.map(user => user.user_details.email).join(', ')}</p>
                  <p><strong>Value:</strong> {deal.value}</p>
                  <p><strong>Currency:</strong> {deal.currency}</p>
                  <p><strong>Country:</strong> {deal.country}</p>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Grid container mb={5}>
                <Box height={300} borderColor={'black'}>
                  <Grid item> <ButtonsComponent/> </Grid>
                  </Box>
                </Grid>
                <Grid container >
                  <Grid item paddingRight={10}>
                  <DescriptionComponent
                  initialDescription={deal.description}
                  onSave={handleSaveDescription}
                />
                </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default DealDetails;
