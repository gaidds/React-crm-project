import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  TableCell,
  IconButton,
  MenuItem,
  Select,
  Avatar,
  Container,
  AvatarGroup,
  SelectChangeEvent,
} from '@mui/material';
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import { CustomToolbar, FabLeft, FabRight } from '../../styles/CssStyled';
import { getComparator, stableSort } from '../../components/Sorting';
import { FaFilter, FaTrashAlt } from 'react-icons/fa';
import { fetchData } from '../../components/FetchData';
import { AccountsUrl } from '../../services/ApiUrls';
import { useNavigate } from 'react-router-dom';
import { DeleteModal } from '../../components/DeleteModal';
import { Spinner } from '../../components/Spinner';
import '../../styles/style.css';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';
import { useMyContext } from '../../context/Context';
import DynamicModal from '../../components/modal/modal';
import { Item, HeadCell } from './types';

const headCells: readonly HeadCell[] = [
  {
    id: 'user_name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'website',
    numeric: false,
    disablePadding: false,
    label: 'Website',
  },
  {
    id: 'created_by',
    numeric: true,
    disablePadding: false,
    label: 'Created By',
  },
  {
    id: 'assigned_to',
    numeric: false,
    disablePadding: false,
    label: 'Assigned To',
  },

  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
];

export default function Accounts() {
  const { userRole, userId, profileId } = useMyContext();

  const tab = useState('open')[0];
  const setLoading = useState(true)[1];
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Name');

  const [openAccounts, setOpenAccounts] = useState<Item[]>([]);
  const [closedAccounts, setClosedAccounts] = useState<Item[]>([]);
  const [deleteRowModal, setDeleteRowModal] = useState(false);

  const [selectedId, setSelectedId] = useState<string[]>([]);

  const [openCurrentPage, setOpenCurrentPage] = useState<number>(1);
  const [openRecordsPerPage, setOpenRecordsPerPage] = useState<number>(10);
  const openTotalPages = useState<number>(1)[0];
  const setOpenLoading = useState(true)[1];

  const [closedCurrentPage, setClosedCurrentPage] = useState<number>(1);
  const [closedRecordsPerPage, setClosedRecordsPerPage] = useState<number>(10);
  const closedTotalPages = useState<number>(0)[0];
  const setClosedLoading = useState(true)[1];
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getAccounts();
  }, [
    openCurrentPage,
    openRecordsPerPage,
    closedCurrentPage,
    closedRecordsPerPage,
  ]);

  const getAccounts = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    try {
      const openOffset = (openCurrentPage - 1) * openRecordsPerPage;
      const closeOffset = (closedCurrentPage - 1) * closedRecordsPerPage;
      await fetchData(
        `${AccountsUrl}/?offset=${
          tab === 'open' ? openOffset : closeOffset
        }&limit=${tab === 'open' ? openRecordsPerPage : closedRecordsPerPage}`,
        'GET',
        null as any,
        Header
      ).then((res: any) => {
        if (!res.error) {
          setOpenAccounts(res?.active_accounts?.open_accounts);
          setClosedAccounts(res?.closed_accounts?.close_accounts);
          setData(res || []);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const navigate = useNavigate();
  const accountDetail = (accountId: string) => {
    navigate(`/app/accounts/${accountId}`);
  };

  const handleRecordsPerPage = (event: SelectChangeEvent<number>) => {
    const selectedValue = Number(event.target.value);

    if (tab === 'open') {
      setOpenLoading(true);
      setOpenRecordsPerPage(selectedValue);
      setOpenCurrentPage(1);
    } else {
      setClosedLoading(true);
      setClosedRecordsPerPage(selectedValue);
      setClosedCurrentPage(1);
    }
  };

  const handlePreviousPage = () => {
    if (tab == 'open') {
      setOpenLoading(true);
      setOpenCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    } else {
      setClosedLoading(true);
      setClosedCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    }
  };

  const handleNextPage = () => {
    if (tab == 'open') {
      setOpenLoading(true);
      setOpenCurrentPage((prevPage) => Math.min(prevPage + 1, openTotalPages));
    } else {
      setClosedLoading(true);
      setClosedCurrentPage((prevPage) =>
        Math.min(prevPage + 1, closedTotalPages)
      );
    }
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
    fetchData(`${AccountsUrl}/${selectedId}/`, 'DELETE', null as any, Header)
      .then((res: any) => {
        if (!res.error) {
          deleteRowModalClose();
          getAccounts();
        }
      })
      .catch(() => {});
  };

  const showAddButton = userRole !== 'USER' && userRole !== 'SALES REP';
  const modalDialog = 'Are You Sure You want to delete this Account?';
  const modalTitle = 'Delete Account';

  const recordsList = [
    [10, '10 Records per page'],
    [20, '20 Records per page'],
    [30, '30 Records per page'],
    [40, '40 Records per page'],
    [50, '50 Records per page'],
  ];

  return (
    <Box sx={{ mt: '16px' }}>
      <CustomToolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              sx={{
                color: '#37474F',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                '&:hover': {
                  backgroundColor: '#CFD8DC',
                },
              }}
            >
              <FaFilter style={{ fontSize: '20px' }} />
            </IconButton>

            {showAddButton && (
              <>
                <DynamicModal
                  mode="add"
                  page="Accounts"
                  data={data}
                  onSaveSuccess={async () => {
                    await getAccounts();
                  }}
                />
              </>
            )}
          </Stack>

          {/* Right Section: Records per Page and Page Navigation */}

          <Stack direction="row" alignItems="center" ml="16px">
            {/* Records per Page Dropdown */}

            <Select
              value={tab === 'open' ? openRecordsPerPage : closedRecordsPerPage}
              onChange={(event: SelectChangeEvent<number>) =>
                handleRecordsPerPage(event)
              }
              className="custom-select"
            >
              {recordsList?.length &&
                recordsList.map((item, i) => (
                  <MenuItem key={i} value={item[0]}>
                    {item[1]}
                  </MenuItem>
                ))}
            </Select>

            {/* Page Navigation */}
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
              {/* Previous Page Button */}
              <FabLeft
                onClick={handlePreviousPage}
                disabled={
                  tab === 'open'
                    ? openCurrentPage === 1
                    : closedCurrentPage === 1
                }
              >
                <FiChevronLeft style={{ height: '15px' }} />
              </FabLeft>

              {/* Current Page / Total Pages */}
              <Typography
                sx={{
                  mt: 0,
                  textTransform: 'lowercase',
                  fontSize: '15px',
                  color: '#1A3353',
                  textAlign: 'center',
                }}
              >
                {tab === 'open'
                  ? `${openCurrentPage} to ${openTotalPages}`
                  : `${closedCurrentPage} to ${closedTotalPages}`}
              </Typography>

              {/* Next Page Button */}
              <FabRight
                onClick={handleNextPage}
                disabled={
                  tab === 'open'
                    ? openCurrentPage === openTotalPages
                    : closedCurrentPage === closedTotalPages
                }
              >
                <FiChevronRight style={{ height: '15px' }} />
              </FabRight>
            </Box>
          </Stack>
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
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={
                    tab === 'open'
                      ? openAccounts?.length
                      : closedAccounts?.length
                  }
                  numSelectedId={selectedId}
                  headCells={headCells}
                />
                <TableBody>
                  {openAccounts?.length > 0 ? (
                    stableSort(openAccounts, getComparator(order, orderBy)).map(
                      (item: any, index: any) => {
                        return (
                          <TableRow
                            tabIndex={-1}
                            key={index}
                            sx={{
                              border: 0,
                              '&:nth-of-type(even)': {
                                backgroundColor: 'whitesmoke',
                              },
                              color: 'rgb(26, 51, 83)',
                              textTransform: 'capitalize',
                            }}
                          >
                            <TableCell
                              className="tableCell-link"
                              onClick={() => accountDetail(item.id)}
                            >
                              {item?.name ? item?.name : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              {item?.website ? item?.website : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              <Stack
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <Avatar
                                  src={item?.created_by?.profile_pic}
                                  alt={item?.created_by?.email}
                                />
                                <Stack sx={{ ml: 1 }}>
                                  {item?.created_by?.email
                                    ? item?.created_by?.email
                                    : '---'}
                                </Stack>
                              </Stack>
                            </TableCell>
                            <TableCell
                              className="tableCell"
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                              }}
                            >
                              <AvatarGroup max={4}>
                                {item?.assigned_to?.length
                                  ? item.assigned_to.map(
                                      (assignee: any, i: any) => (
                                        <Avatar
                                          key={i}
                                          src={
                                            assignee.user_details
                                              ?.profile_pic || undefined
                                          }
                                          alt={
                                            assignee.user_details?.email ||
                                            'Unknown'
                                          }
                                        />
                                      )
                                    )
                                  : '---'}
                              </AvatarGroup>
                            </TableCell>
                            <TableCell className="tableCell">
                              {(userRole === 'ADMIN' ||
                                item.created_by.id === userId ||
                                item.assigned_to.some(
                                  (assignee: any) => assignee.id === profileId
                                )) && (
                                <DynamicModal
                                  mode="edit"
                                  page="Accounts"
                                  id={item.id}
                                  data={data}
                                  icon={true}
                                  onSaveSuccess={async () => {
                                    await getAccounts();
                                  }}
                                />
                              )}
                              {(userRole === 'ADMIN' ||
                                item.created_by.id === userId) && (
                                <FaTrashAlt
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => deleteRow(item.id)}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      }
                    )
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ border: 0 }}>
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
