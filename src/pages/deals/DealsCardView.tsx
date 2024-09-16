import { DealUrl } from '../../services/ApiUrls';
import { Box, IconButton, Stack, Paper, Container, Tabs, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { CustomTab, CustomToolbar} from '../../styles/CssStyled';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../components/FetchData';
import DynamicModal from '../../components/modal/modal';
import { useMyContext } from '../../context/Context'
import DealsCard from '../../components/DealsCard';
import StagesBar from '../../components/stages-bar/StagesBar';
import {FaFilter} from "react-icons/fa"


interface AssignedTo {
    user_details: {
        email: string;
        profile_pic: string;
    };
}

interface Deal {
    id: string;
    name: string;
    probability: number;
    stage: string;
    country: string;
    assigned_to: AssignedTo[];
    value: string;
    created_by: {
       id: string;
    }
}

export default function DealsCardView(props: any) {
    const { userRole, setUserRole , userId} = useMyContext();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [dealsByStage, setDealsByStage] = useState<{ [key: string]: Deal[] }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [data,setData] = useState<any[]>([]);
    const [tab, setTab] = useState('card-view');
    const navigate = useNavigate();

    
    const stagesData = [
        { name: 'ASSIGNED LEAD', color: '#004E85' },
        { name: 'IN PROCESS', color: '#1C7EC3' },
        { name: 'OPPORTUNITY', color: '#1CBEC3' },
        { name: 'QUALIFICATION', color: '#EBDA25' },
        { name: 'NEGOTIATION', color: '#94C31C' },
        { name: 'CLOSED', color: '#075F18' }
      ];

      
    useEffect(() => {
        getDeals();
    }, []);

    const getDeals = async () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        };
        try {
            await fetchData(
                `${DealUrl}`,
                'GET',
                null as any,
                Header
            ).then((res) => {
                console.log(res, 'deals');
                if (!res.error) {
                    const fetchedDeals: Deal[] = res.deals || [];
                    setDeals(fetchedDeals);
                    setData(res || []);
                    const groupedDeals = fetchedDeals.reduce((acc: { [key: string]: Deal[] }, deal) => {
                        const stage = deal.stage === 'CLOSED WON' || deal.stage === 'CLOSED LOST' ? 'CLOSED' : deal.stage;
                        if (!acc[stage]) {
                          acc[stage] = [];
                        }
                        acc[stage].push(deal);
                        return acc;
                      }, {});
              
                    setDealsByStage(groupedDeals);
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

      const showAddButton = userRole !== 'USER' && userRole !== 'SALES REP';

      const handleChangeTab = (newValue: string) => {
        setTab(newValue);
        if (newValue === 'card-view') {
          navigate('/app/deals/card-view'); // Navigate to Card View
        } else if (newValue === 'list-view') {
          navigate('/app/deals'); // Navigate to List View
        }
      };

console.log(deals,'deals')

    return (

      <Box sx={{ mt: '60px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CustomToolbar sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 3, }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    {showAddButton && (
                        <>
                        <IconButton color="primary" >
                            <FaFilter style={{ color: '#333F49' }} />
                        </IconButton>
                        <DynamicModal mode='add' page='Deals' data={data} onSaveSuccess={async () => {
                                                                                                  await getDeals();
                                                                                                }}/>
                    </>
                    )}
                </Stack>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'right', mt: '26px' }}>
                    <Button
                        variant={tab === 'card-view' ? 'contained' : 'outlined'}
                        onClick={() => handleChangeTab('card-view')}
                        sx={{
                        backgroundColor: tab === 'card-view' ? 'white' : '#E2E7EB',
                        color: 'black',
                        border: '1px solid black',
                        borderRadius: 2,
                        mr: '5px', // Adds spacing between buttons
                        }}
                    >
                        Card View
                    </Button>
                    <Button
                        variant={tab === 'list-view' ? 'contained' : 'outlined'}
                        onClick={() => handleChangeTab('list-view')}
                        sx={{
                        backgroundColor: tab === 'list-view' ? 'white' : '#E2E7EB',
                        color: 'black',
                        border: '1px solid black',
                        borderRadius: 2,
                        }}
                    >
                        List View
                    </Button>
                </Box>
            </CustomToolbar>
            <Container sx={{ width: '100%', maxWidth: '100%', minWidth: '100%' }}>
                <Box sx={{ width: '100%', minWidth: '100%', m: '15px 0px 0px 0px' }}>
                    <Paper sx={{ width: 'calc(100% - 15px)', mb: 2, p: '0px 15px 15px 15px', borderRadius:'16px'}}>
                        <Box sx={{pt:3, flexShrink: 0 }}>
                            <StagesBar stages={stagesData} />
                        </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        overflowX: 'hidden',
                        height: '100%',
                        flexGrow: 1,
                        mt: 3
                    }}
                >
                    {stagesData.map(stage => (
                        <Box
                            key={stage.name}
                            sx={{
                                flex: '1 0 0',
                                p: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                overflowY: 'auto',
                                height: '100%',
                                overflowX: 'hidden',
                                alignItems: 'center',
                            }}
                        >
                            {dealsByStage[stage.name]?.map(deal => (
                                <DealsCard
                                    key={deal.id}
                                    name={deal.name}
                                    country={deal.country}
                                    assignedUsers={deal.assigned_to.map(user => ({
                                        name: user.user_details.email,
                                        photo: user.user_details.profile_pic
                                    }))}
                                    probability={deal.probability}
                                    stage={deal.stage}
                                />
                            ))}
                        </Box>
                    ))}
                    </Box>
                    </Paper>
                </Box>
            </Container>
            </Box>
    );
}
