import { DealUrl } from '../../services/ApiUrls';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableCell,
  TableRow,
  Paper,
  TableBody,
  Container,
  Tabs,
} from '@mui/material';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Spinner } from '../../components/Spinner';
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import {
  CustomTab,
  CustomToolbar,
  FabLeft,
  FabRight,
  StyledTableCell,
  StyledTableRow,
} from '../../styles/CssStyled';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../components/FetchData';
import { getComparator, stableSort } from '../../components/Sorting';
import { Label } from '../../components/Label';
import { FaFilter, FaTrashAlt } from 'react-icons/fa';
import DynamicModal from '../../components/modal/modal';
import { DeleteModal } from '../../components/DeleteModal';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';
import MyContext, { useMyContext } from '../../context/Context';
import FilterComponent from '../../components/filters/DealsFIlter';

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
  const { userRole, setUserRole, userId } = useMyContext();
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
  const [deleteRowModal, setDeleteRowModal] = useState(false);

  const [selectOpen, setSelectOpen] = useState(false);
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
        //console.log(res, 'deals');
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
        //console.log('delete:', res);
        if (!res.error) {
          deleteRowModalClose();
          getDeals();
        }
      })
      .catch(() => {});
  };
  const handlePreviousPage = () => {
    setLoading(true);
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setLoading(true);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleRecordsPerPage = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLoading(true);
    setRecordsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };
  const navigate = useNavigate();
  const handleItemClick = (id: string) => {
    navigate(`/app/deals/${id}`);
  };

  const modalDialog = 'Are You Sure You want to delete selected Deal?';
  const modalTitle = 'Delete Deal';
  const showAddButton = userRole !== 'USER' && userRole !== 'SALES REP';

  const recordsList = [
    [10, '10 Records per page'],
    [20, '20 Records per page'],
    [30, '30 Records per page'],
    [40, '40 Records per page'],
    [50, '50 Records per page'],
  ];

  const styleStage = (stage: string) => {
    let result = '';
    switch (stage) {
      case 'ASSIGNED LEAD':
        result = 'bg-red';
        break;
      case 'QUALIFCATION':
        result = '#004E85';
        break;
      case 'IN PROCESS':
        result = 'bg-black';
        break;
      default:
        result = '';
    }
    return result;
  };
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
            ml: 1,
          }}
        >
          <Select
            value={recordsPerPage}
            onChange={(e: any) => handleRecordsPerPage(e)}
            open={selectOpen}
            onOpen={() => setSelectOpen(true)}
            onClose={() => setSelectOpen(false)}
            className={`custom-select`}
            onClick={() => setSelectOpen(!selectOpen)}
            IconComponent={() => (
              <div
                onClick={() => setSelectOpen(!selectOpen)}
                className="custom-select-icon"
              >
                {selectOpen ? (
                  <FiChevronUp style={{ marginTop: '12px' }} />
                ) : (
                  <FiChevronDown style={{ marginTop: '12px' }} />
                )}
              </div>
            )}
            sx={{
              '& .MuiSelect-select': { overflow: 'visible !important' },
            }}
          >
            {recordsList?.length &&
              recordsList.map((item: any, i: any) => (
                <MenuItem key={i} value={item[0]}>
                  {item[1]}
                </MenuItem>
              ))}
          </Select>
          <Box
            sx={{
              borderRadius: '7px',
              backgroundColor: 'white',
              height: '40px',
              minHeight: '40px',
              maxHeight: '40px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              mr: 1,
              p: '0px',
            }}
          >
            <FabLeft onClick={handlePreviousPage} disabled={currentPage === 1}>
              <FiChevronLeft style={{ height: '15px' }} />
            </FabLeft>
            <Typography
              sx={{
                mt: 0,
                textTransform: 'lowercase',
                fontSize: '15px',
                color: '#1A3353',
                textAlign: 'center',
              }}
            >
              {currentPage} to {totalPages}
              {/* {renderPageNumbers()} */}
            </Typography>
            <FabRight
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight style={{ height: '15px' }} />
            </FabRight>
          </Box>
        </Stack>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'right',
            mt: '26px',
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
                    filteredDeals.map((deal, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;
                      const rowIndex = selectedId.indexOf(deal.id);
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
