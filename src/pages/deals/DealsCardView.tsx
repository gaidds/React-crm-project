import { DealUrl } from '../../services/ApiUrls';
import { Avatar, AvatarGroup, Box, Grid2, Button, IconButton, Stack, Typography, Select, MenuItem, TableContainer, Table, TableCell, TableRow, Paper, TableBody, Container, Divider } from '@mui/material'
import React, { SyntheticEvent, useEffect, useState } from 'react'
import { Spinner } from '../../components/Spinner';
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { FiChevronLeft } from "@react-icons/all-files/fi/FiChevronLeft";
import { FiChevronRight } from "@react-icons/all-files/fi/FiChevronRight";
import { CustomTab, CustomToolbar, FabLeft, FabRight, StyledTableCell, StyledTableRow } from '../../styles/CssStyled';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../components/FetchData';
import { getComparator, stableSort } from '../../components/Sorting';
import { Label } from '../../components/Label';
import { FaTrashAlt } from 'react-icons/fa';
import DynamicModal from '../../components/modal/modal';
import { DeleteModal } from '../../components/DeleteModal';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';
import MyContext, { useMyContext } from '../../context/Context'
import DealsCard from '../../components/DealsCard';


// Define TypeScript interfaces for your data

interface HeadCell {
    disablePadding: boolean;
    id: any;
    label: string;
    numeric: boolean;
  }
  const headCells: readonly HeadCell[] = [
    {
      id: 'name',
      numeric: false,
      disablePadding: false,
      label: 'Name'
    },
    {
      id: 'probability',
      numeric: true,
      disablePadding: false,
      label: 'Probability'
    },
    {
      id: 'stage',
      numeric: false,
      disablePadding: false,
      label: 'Stage'
    },
    {
      id: 'country',
      numeric: false,
      disablePadding: false,
      label: 'Country'
    },
    {
        id: 'assigned_to',
        numeric: false,
        disablePadding: false,
        label: 'Assigned To'
      },
    {
      id: 'value',
      numeric: false,
      disablePadding: false,
      label: 'Value'
    },
    {
      id: '',
      numeric: true,
      disablePadding: false,
      label: 'Action'
    }
  ]

// Define the interfaces
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
    const [selected, setSelected] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const [isSelectedId, setIsSelectedId] = useState<boolean[]>([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [stages, setStages] = useState<string[]>([]);

    const [selectOpen, setSelectOpen] = useState(false);
    const [data,setData] = useState<any[]>([]);
    useEffect(() => {
        getDeals();
    }, []);

    const custom_stages = ['ASSIGNED LEAD','IN PROCESS','OPPORTUNITY','QUALIFICATION','NEGOTIATION','CLOSED' ]

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
                    setStages(custom_stages);
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

console.log(deals,'deals')
console.log(stages,'stages')

    return (

        <Box sx={{ mt: '60px' }}>
        <CustomToolbar sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              {showAddButton && ( <DynamicModal mode='add' page='Deals' data={data}></DynamicModal>
              )}
            </Stack>
        </CustomToolbar>
        <Box sx={{ mt: 4 }}>
            {/* Progress Bar (Stage Headers) */}
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                {custom_stages.map(stage => (
                    <Box key={stage} sx={{ minWidth: 200, textAlign: 'center', p: 1, borderBottom: '2px solid', borderColor: 'primary.main' }}>
                        <Typography variant="h6">{stage}</Typography>
                    </Box>
                ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Cards by Stage */}
            <Box sx={{ display: 'flex', flexDirection: 'row', overflowX: 'hidden', }}>
                {custom_stages.map(stage => (
                    <Box key={stage} sx={{ minWidth: 200, p: 1, overflowY: 'auto', height: '80vh' , ...(stage === 'CLOSED' && { pr: 20 })  }}>
                        {/* <Typography variant="h6" gutterBottom>{stage}</Typography> */}
                        {dealsByStage[stage]?.map(deal => (
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
        </Box>
        </Box>
    );
}
