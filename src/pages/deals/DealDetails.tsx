import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DealUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';
import { Box, Container, Paper, Grid } from '@mui/material';
import { CustomToolbar } from '../../styles/CssStyled';
import DynamicModal from '../../components/modal/modal';
import { useMyContext } from '../../context/Context';
import DescriptionEditor from '../../components/Description';
import ProgressBar from '../../components/progress-bar/ProgressBar';
import ContactDetails from '../../components/ContactInfo';

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
        description: updatedDescription,  // Pass the updated description
      };
      console.log("NEW DESC", data)
      const Header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token') ?? '', // Ensure token is not null
        org: localStorage.getItem('org') ?? '', // Ensure org is not null
      };
  
      try {
        const res = await fetchData(`${DealUrl}/${dealId}/`, 'PUT', JSON.stringify(data), Header);
        if (!res.error) {
          console.log('Description updated successfully:', res);
          // Re-fetch the deal to update the state
          fetchDeal();  // This will re-fetch the deal and update the state with the new description
        } else {
          console.error('Error updating description:', res.error);
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    };
  
    // Call the submit form function
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
            <Grid container spacing={2} paddingLeft={10}>
              <Grid item xs={12} sm={4}>
              <ContactDetails
                profilePic='' // Add your profile picture here
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
              <Grid item xs={12} sm={4} paddingBottom={4}>
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
                  <Grid item> Notes and Attachmend Component's Place</Grid>
                  </Box>
                </Grid>
                <Grid container>
                  <Grid item paddingRight={10}>
                  <p><strong>Description</strong> {deal.description}</p>
                  <DescriptionEditor
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
