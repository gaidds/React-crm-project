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
import FilterComponent from '../../components/filters/DealsFIlter';
import { Deal } from './Deals'; // Adjust path as necessary


export default function DealsCardView(props: any) {
    const { userRole } = useMyContext();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [dealsByStage, setDealsByStage] = useState<{ [key: string]: Deal[] }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any[]>([]);
    const [tab, setTab] = useState('card-view');
    const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);

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

    useEffect(() => {
        const groupedDeals = filteredDeals.reduce((acc: { [key: string]: Deal[] }, deal) => {
            const stage = deal.stage === 'CLOSED WON' || deal.stage === 'CLOSED LOST' ? 'CLOSED' : deal.stage;
            if (!acc[stage]) {
                acc[stage] = [];
            }
            acc[stage].push(deal);
            return acc;
        }, {});

        setDealsByStage(groupedDeals);
    }, [filteredDeals]);

    const getDeals = async () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        };
    
        let allDeals: Deal[] = [];
        let currentPage = 1;
    
        // Define the number of records per page
        const recordsPerPage = 10; 
    
        while (true) {
            try {
                const offset = (currentPage - 1) * recordsPerPage;
                const res = await fetchData(
                    `${DealUrl}/?offset=${offset}&limit=${recordsPerPage}`,
                    'GET',
                    null as any,
                    Header
                );
    
                // Check for errors in the response
                if (!res.error) {
                    const fetchedDeals: Deal[] = res.deals || [];
                    
                    // Add the fetched deals to the allDeals array
                    allDeals = [...allDeals, ...fetchedDeals];
    
                    // If fewer deals than requested were returned, break the loop (no more deals)
                    if (fetchedDeals.length < recordsPerPage) {
                        break; 
                    }
    
                    // Increment the current page
                    currentPage++;
                } else {
                    console.error('Error in response:', res.error);
                    break; // Break the loop on error
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                break; // Break the loop on fetch error
            }
        }
    
        // Update the state with all retrieved deals
        setDeals(allDeals);
        setFilteredDeals(allDeals);
        setData(allDeals); // or use the response data if needed
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

    const handleApplyFilters = (filteredDeals: Deal[]) => {
        setFilteredDeals(filteredDeals);
    };


    return (

      <Box sx={{ mt: '60px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CustomToolbar sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', mb: 3, }}>
                <Stack direction="row" spacing={2} alignItems="center">
                <FilterComponent deals={deals} onApplyFilters={handleApplyFilters} />
                    {showAddButton && (
                        <>
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
                        backgroundColor: tab === 'card-view' ? '#FEF7FF' : '#E2E7EB',
                        color: 'black',
                        border: '1px solid black',
                        borderRadius: 2,
                        mr: '5px',
                        height: '36px', 
                        }}
                    >
                        Card View
                    </Button>
                    <Button
                        variant={tab === 'list-view' ? 'contained' : 'outlined'}
                        onClick={() => handleChangeTab('list-view')}
                        sx={{
                        backgroundColor: tab === 'list-view' ? '#FEF7FF' : '#E2E7EB',
                        color: 'black',
                        border: '1px solid black',
                        borderRadius: 2,
                        height: '36px',
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
                                    id={deal.id}
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
