import { DealUrl } from '../../services/ApiUrls';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Stack,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  Paper,
  TableBody,
  Container,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Spinner } from '../../components/Spinner';
import { CustomToolbar } from '../../styles/CssStyled';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../components/FetchData';
import { Label } from '../../components/Label';
import { FaTrashAlt } from 'react-icons/fa';
import DynamicModal from '../../components/modal/modal';
import { DeleteModal } from '../../components/DeleteModal';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';
import { useMyContext } from '../../context/Context';
import FilterComponent from '../../components/filters/DealsFIlter';
import Pagination from '../../components/pagination/Pagination';

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
    label: 'Name',
  },
  {
    id: 'probability',
    numeric: false,
    disablePadding: false,
    label: 'Probability',
  },
  {
    id: 'stage',
    numeric: true,
    disablePadding: false,
    label: 'Stage',
  },
  {
    id: 'country',
    numeric: false,
    disablePadding: false,
    label: 'Country',
  },
  {
    id: 'assigned_to',
    numeric: false,
    disablePadding: false,
    label: 'Assigned To',
  },
  {
    id: 'value',
    numeric: false,
    disablePadding: false,
    label: 'Value',
  },
  {
    id: '',
    numeric: true,
    disablePadding: false,
    label: 'Action',
  },
];

export interface AssignedTo {
  user_details: {
    id: string;
    email: string;
    profile_pic: string;
  };
}

export interface Deal {
  id: string;
  deal_source: string;
  name: string;
  probability: number;
  stage: string;
  country: string;
  assigned_to: AssignedTo[];
  value: string;
  created_by: {
    id: string;
  };
}

export default function Deals(props: any) {
  const navigate = useNavigate();
  const { userRole, userId } = useMyContext();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const selected = useState<string[]>([])[0];
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const isSelectedId = useState<boolean[]>([])[0];
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [deleteRowModal, setDeleteRowModal] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [tab, setTab] = useState('list-view');
  const [filteredDeals, setFilteredDeals] = useState<Deal[]>([]);
  useEffect(() => {
    getDeals();
  }, [currentPage, recordsPerPage]);

  const getDeals = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    try {
      const offset = (currentPage - 1) * recordsPerPage;
      await fetchData(
        `${DealUrl}/?offset=${offset}&limit=${recordsPerPage}`,
        'GET',
        null as any,
        Header
      ).then((res) => {
        if (!res.error) {
          const fetchedDeals: Deal[] = res.deals || [];
          setDeals(fetchedDeals);
          setFilteredDeals(fetchedDeals);
          setData(res || []);
          setTotalPages(Math.ceil(res?.deals_count / recordsPerPage));
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const deleteRow = (id: any) => {
    setSelectedId(id);
    setDeleteRowModal(!deleteRowModal);
  };
  const deleteRowModalClose = () => {
    setDeleteRowModal(false);
    setSelectedId([]);
  };

  const deleteItem = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    fetchData(`${DealUrl}/${selectedId}/`, 'DELETE', null as any, Header)
      .then((res: any) => {
        if (!res.error) {
          deleteRowModalClose();
          getDeals();
        }
      })
      .catch(() => {});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleItemClick = (id: string) => {
    navigate(`/app/deals/${id}`);
  };

  const modalDialog = 'Are You Sure You want to delete selected Deal?';
  const modalTitle = 'Delete Deal';
  const showAddButton = userRole !== 'USER' && userRole !== 'SALES REP';

  return (
    <Box>
      <CustomToolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          mt: 2,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <FilterComponent deals={deals} onApplyFilters={handleApplyFilters} />
          {showAddButton && (
            <>
              <DynamicModal
                mode="add"
                page="Deals"
                data={data}
                onSaveSuccess={async () => {
                  await getDeals();
                }}
              />
            </>
          )}
        </Stack>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            mr: 2,
            ml: 2,
          }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            recordsPerPage={recordsPerPage}
            handlePageChange={handlePageChange}
            handleSelectChange={handleSelectChange}
          />
        </Stack>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'right',
          }}
        >
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
          <Paper
            sx={{
              width: 'calc(100% - 15px)',
              mb: 2,
              p: '15px 15px 15px 15px',
              borderRadius: '16px',
            }}
          >
            <TableContainer sx={{ borderRadius: '16px' }}>
              <Table
                sx={{
                  '& .MuiTableCell-head': {
                    color: 'white',
                    backgroundColor: '#6B778C',
                  },
                }}
              >
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
                  {filteredDeals.length > 0 ? (
                    filteredDeals.map((deal) => {
                      return (
                        <TableRow
                          tabIndex={-1}
                          key={deal.id}
                          sx={{
                            border: 0,
                            '&:nth-of-type(even)': {
                              backgroundColor: 'whitesmoke',
                            },
                            color: 'rgb(26, 51, 83)',
                            textTransform: 'capitalize',
                          }}
                        >
                          <TableCell className="tableCell">
                            <div
                              onClick={() => handleItemClick(deal.id)}
                              style={{
                                color: 'blue',
                                cursor: 'pointer',
                              }}
                            >
                              {deal.name || '---'}
                            </div>
                          </TableCell>
                          <TableCell className="tableCell">
                            {deal.probability || '---'}
                          </TableCell>
                          <TableCell className="tableCell">
                            <Label tags={deal.stage} />
                          </TableCell>
                          <TableCell className="tableCell">
                            {deal.country || '---'}
                          </TableCell>
                          <TableCell className="tableCell">
                            <AvatarGroup
                              sx={{ display: 'flex', justifyContent: 'start' }}
                              max={4}
                            >
                              {deal.assigned_to.map((assignee, index) => (
                                <Avatar
                                  key={index}
                                  src={
                                    assignee.user_details.profile_pic ||
                                    undefined
                                  } // profile_pic for the image
                                  alt={assignee.user_details.email}
                                />
                              ))}
                            </AvatarGroup>
                          </TableCell>
                          <TableCell className="tableCell">
                            {deal.value || '---'}
                          </TableCell>
                          <TableCell className="tableCell">
                            {(userRole === 'ADMIN' ||
                              deal.created_by.id === userId ||
                              deal.assigned_to.some(
                                (assignee: any) =>
                                  assignee.user_details.id === userId
                              )) && (
                              <DynamicModal
                                mode="edit"
                                page="Deals"
                                id={deal.id}
                                data={data}
                                icon={true}
                                onSaveSuccess={async () => {
                                  await getDeals();
                                }}
                              />
                            )}
                            {(userRole === 'ADMIN' ||
                              deal.created_by.id === userId) && (
                              <FaTrashAlt
                                onClick={() => deleteRow(deal.id)}
                                style={{
                                  fill: '#1A3353',
                                  cursor: 'pointer',
                                  marginRight: '10px',
                                }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ border: 0 }}>
                        <Spinner />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Container>
      <DeleteModal
        onClose={deleteRowModalClose}
        open={deleteRowModal}
        id={selectedId}
        modalDialog={modalDialog}
        modalTitle={modalTitle}
        DeleteItem={deleteItem}
      />
    </Box>
  );
}
