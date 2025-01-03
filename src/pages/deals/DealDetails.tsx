import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DealUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';
import { Box, Paper, Grid } from '@mui/material';
import { CustomToolbar } from '../../styles/CssStyled';
import DynamicModal from '../../components/modal/modal';
import { useMyContext } from '../../context/Context';
import ProgressBar from '../../components/progress-bar/ProgressBar';
import ContactDetails from '../../components/ContactInfo';
import ButtonsComponent from '../../components/notesattachments';
import DescriptionComponent from '../../components/DealsDescription';

{
  /* Define the interface Deal which describes the shape of the deal data fetched from the API, ensuring TypeScript type safety. */
}
interface Deal {
  name: string;
  account_name: string;
  assigned_to: [
    {
      user_details: {
        email: string;
      };
    }
  ];
  contacts: [
    {
      first_name: string;
      last_name: string;
      primary_email: string;
      profile_pic: string;
      mobile_number: string;
      department: string;
      address: {
        address_line: string;
        city: string;
        country: string;
        postcode: string;
        state: string;
        street: string;
      };
    }
  ];
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
  created_by: { id: string };
}
{
  /* Component State and Context // The dealId is extracted from the route parameters using useParams */
}
const DealDetails: React.FC = () => {
  const { dealId } = useParams<{ dealId: string }>();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [data, setData] = useState<any[]>([]);
  const { userRole, setUserRole, userId } = useMyContext();
  const [stages, setStages] = useState<any[]>([]);

  useEffect(() => {
    if (dealId) {
      fetchDeal();
      getDeals();
    }
  }, [dealId]);

  {
    /* Fetching Deals and Deal Details */
  }
  const getDeals = async () => {
    //getDeals fetches a list of deals from the server and stores it in data.
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    try {
      await fetchData(`${DealUrl}`, 'GET', null as any, Header).then((res) => {
        if (!res.error) {
          setData(res || []);
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDeal = async () => {
    //fetches the specific deal using dealId and updates the deal state.
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    try {
      await fetchData(`${DealUrl}/${dealId}`, 'GET', null as any, Header).then(
        (res) => {
          if (!res.error) {
            setDeal(res?.deal_obj);
            let lastStage = 'CLOSED';
            if (
              res?.deal_obj.stage === 'CLOSED WON' ||
              res?.deal_obj.stage === 'CLOSED LOST'
            ) {
              lastStage = res?.deal_obj.stage;
            }
            setStages([
              { state: 'ASSIGNED LEAD', color: '#004E85' },
              { state: 'IN PROCESS', color: '#1C7EC3' },
              { state: 'OPPORTUNITY', color: '#1CBEC3' },
              { state: 'QUALIFICATION', color: '#EBDA25' },
              { state: 'NEGOTIATION', color: '#94C31C' },
              {
                state: lastStage,
                color:
                  res?.deal_obj.stage === 'CLOSED LOST' ? '#CA1D1F' : '#075F18',
              },
            ]);
          }
        }
      );
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  if (!deal) {
    return <div>Loading...</div>;
  }

  {
    /* Handling Description Save */
  }
  const handleSaveDescription = (updatedDescription: string) => {
    // allows updating the deal’s description via an API call. It uses the PATCH method to only update the description field.
    const submitForm = async () => {
      const data = {
        description: updatedDescription, // Only updating the description field
      };

      const Header = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token') ?? '',
        org: localStorage.getItem('org') ?? '',
      };

      try {
        // Using PATCH for partial update
        const res = await fetchData(
          `${DealUrl}/${dealId}/`,
          'PATCH',
          JSON.stringify(data),
          Header
        );
        if (!res.error) {
          await fetchDeal(); // Re-fetch the updated deal
        } else {
          console.error('Error updating description:', res.error);
        }
      } catch (error) {
        console.error('Request failed:', error);
      }
    };

    submitForm();
  };

  {
    /* Rendering the UI */
  }
  return (
    <Box sx={{ boxSizing: 'border-box', padding: '24px', height: '100%' }}>
      <CustomToolbar
        sx={{
          marginBottom: '12px',
        }}
      >
        {(userRole === 'ADMIN' ||
          deal.created_by.id === userId ||
          deal.assigned_to.some(
            (assignee: any) => assignee.user_details.id === userId
          )) && (
          <DynamicModal
            page="Deals"
            id={dealId}
            mode="edit"
            data={data}
            onSaveSuccess={async () => {
              await fetchDeal();
            }}
          />
        )}
      </CustomToolbar>
      <Box
        sx={{
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <Paper
          sx={{
            boxSizing: 'border-box',
            width: '100%',
            p: '24px 40px',
            borderRadius: '16px',
          }}
        >
          <Grid container spacing={2} sx={{ boxSizing: 'border-box' }}>
            {/* Deal name and website */}
            <Grid item xs={12} sm={6}>
              <Box>
                <h1 style={{ fontSize: '32px' }}>{deal.name}</h1>
              </Box>
              <Box
                sx={{
                  color: 'grey',
                  marginTop: '20px',
                }}
              >
                <h2 style={{ fontSize: '24px' }}>{deal.website}</h2>
              </Box>
            </Grid>

            {/* Closing date based on the stage */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  fontSize: '16px', // Set font size to 16px
                }}
              >
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
          {/* Progress Bar for deal stages */}
          <Grid
            container
            spacing={2}
            paddingRight={4}
            paddingLeft={4}
            mb={8}
            mt={2}
          >
            <Grid item xs={12} sm={12}>
              <ProgressBar status={stages} currentState={deal.stage} />
            </Grid>
          </Grid>
          {/* Contact Info, Deal Details, Notes/Attachments */}
          <Grid container spacing={2}>
            {/* Contact Details */}
            <Grid item xs={12} sm={4}>
              <Box sx={{ height: '90%' }}>
                <ContactDetails
                  src={
                    deal.contacts[0]?.profile_pic ??
                    'data:image/png;base64,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'
                  }
                  fullName={`${deal.contacts[0]?.first_name || '---'} ${
                    deal.contacts[0]?.last_name || '---'
                  }`}
                  email={deal.contacts[0]?.primary_email || '---'}
                  phone={deal.contacts[0]?.mobile_number || '---'}
                  department={deal.contacts[0]?.department || '---'}
                  address={`
                  ${deal.contacts[0]?.address?.street || '---'}, ${
                    deal.contacts[0]?.address?.city || '---'
                  },
                  ${deal.contacts[0]?.address?.state || '---'}, ${
                    deal.contacts[0]?.address?.postcode || '---'
                  }, 
                  ${deal.contacts[0]?.address?.country || '---'}
                `}
                />
              </Box>
            </Grid>
            {/* Deal Details like Account, Industry, etc. */}
            <Grid item xs={12} sm={4} justifyItems={'center'}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '150px 1fr',
                  rowGap: 2,
                  columnGap: 2,
                }}
              >
                <p>
                  <strong>Account</strong>
                </p>
                <p>{deal.account_name}</p>

                <p>
                  <strong>Industry</strong>
                </p>
                <p>{deal.industry}</p>

                <p>
                  <strong>Deal Source</strong>
                </p>
                <p>{deal.deal_source}</p>

                <p>
                  <strong>Probability</strong>
                </p>
                <p>{deal.probability}%</p>

                <p>
                  <strong>Assigned To</strong>
                </p>
                <p>
                  {deal.assigned_to
                    .map((user) => user.user_details.email)
                    .join(', ')}
                </p>

                <p>
                  <strong>Value</strong>
                </p>
                <p>{deal.value}</p>

                <p>
                  <strong>Currency</strong>
                </p>
                <p>{deal.currency}</p>

                <p>
                  <strong>Country</strong>
                </p>
                <p>{deal.country}</p>
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Grid
                container
                mb={5}
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Box height={300} borderColor={'black'}>
                  <Grid item>
                    <ButtonsComponent />
                  </Grid>
                </Box>
              </Grid>
              <Grid
                container
                sx={{ display: 'flex', justifyContent: 'flex-end' }}
              >
                <Grid item>
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
    </Box>
  );
};

export default DealDetails;
