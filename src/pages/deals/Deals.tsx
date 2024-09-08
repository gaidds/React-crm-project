import { DealUrl } from '../../services/ApiUrls';
import { Avatar, AvatarGroup, Box, Button, TableContainer, Table, TableCell, TableRow, Paper, TableBody, Container } from '@mui/material'
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
import { OpportunityUrl } from '../../services/ApiUrls';
import { DeleteModal } from '../../components/DeleteModal';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';
import MyContext, { useMyContext } from '../../context/Context'


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
        profile_pic: string; // Assuming there's a name field too
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
}

export default function Deals(props: any) {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selected, setSelected] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const [isSelectedId, setIsSelectedId] = useState<boolean[]>([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');

    useEffect(() => {
        getDeals();
    }, [currentPage, recordsPerPage]);

    const getDeals = async () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        };
        try {
            const offset = (currentPage - 1) * recordsPerPage;
            await fetchData(
                `${DealUrl}/?offset=${offset}&limit=${recordsPerPage}`,
                'GET',
                null as any,
                Header
            ).then((res) => {
                console.log(res, 'deals');
                if (!res.error) {
                    setDeals(res?.deals || []);
                    setTotalPages(Math.ceil(res?.deals_count / recordsPerPage));
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleRequestSort = (event: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleRowSelect = (accountId: string) => {
        const selectedIndex = selected.indexOf(accountId);
        let newSelected: string[] = [...selected];
        let newSelectedIds: string[] = [...selectedId];
        let newIsSelectedId: boolean[] = [...isSelectedId];

        if (selectedIndex === -1) {
            newSelected.push(accountId);
            newSelectedIds.push(accountId);
            newIsSelectedId.push(true);
        } else {
            newSelected.splice(selectedIndex, 1);
            newSelectedIds.splice(selectedIndex, 1);
            newIsSelectedId.splice(selectedIndex, 1);
        }

        setSelected(newSelected);
        setSelectedId(newSelectedIds);
        setIsSelectedId(newIsSelectedId);
    };

    return (
        <Box sx={{ mt: '60px' }}>
            <Container sx={{ width: '100%', maxWidth: '100%', minWidth: '100%' }}>
                <Box sx={{ width: '100%', minWidth: '100%', m: '15px 0px 0px 0px' }}>
                    <Paper sx={{ width: 'calc(100% - 15px)', mb: 2, p: '0px 15px 15px 15px' }}>
                        <TableContainer>
                            <Table>
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={deals.length}
                                    numSelectedId={selectedId}
                                    isSelectedId={isSelectedId}
                                    headCells={headCells}
                                />
                                <TableBody>
                                    {deals.length > 0
                                        ? deals.map((deal, index) => {
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            const rowIndex = selectedId.indexOf(deal.id);
                                            return (
                                                <TableRow
                                                    tabIndex={-1}
                                                    key={deal.id}
                                                    sx={{
                                                        border: 0,
                                                        '&:nth-of-type(even)': { backgroundColor: 'whitesmoke' },
                                                        color: 'rgb(26, 51, 83)',
                                                        textTransform: 'capitalize',
                                                    }}
                                                >
                                                    <TableCell className='tableCell'>
                                                        {deal.name || '---'}
                                                    </TableCell>
                                                    <TableCell className='tableCell'>
                                                        {deal.probability || '---'}
                                                    </TableCell>
                                                    <TableCell className='tableCell'>
                                                        {deal.stage || '---'}
                                                    </TableCell>
                                                    <TableCell className='tableCell'>
                                                        {deal.country || '---'}
                                                    </TableCell>
                                                    <TableCell className='tableCell'>
                                                    <AvatarGroup max={4}>
                                                        {deal.assigned_to.map((assignee, index) => (
                                                            <Avatar
                                                                key={index}
                                                                src={assignee.user_details.profile_pic || undefined} // profile_pic for the image
                                                                alt={assignee.user_details.email}
                                                            />
                                                        ))}
                                                    </AvatarGroup>
                                                    </TableCell>
                                                    <TableCell className='tableCell'>
                                                        {deal.value || '---'}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                        : <TableRow><TableCell colSpan={5} sx={{ border: 0 }}><Spinner /></TableCell></TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}
