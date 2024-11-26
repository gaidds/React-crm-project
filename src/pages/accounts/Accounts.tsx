import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  TableCell,
  IconButton,
  Avatar,
  Container,
  AvatarGroup,
} from '@mui/material';
import { CustomToolbar } from '../../styles/CssStyled';
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
import Pagination from '../../components/pagination/Pagination';

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
  const [openTotalPages, setOpenTotalPages] = useState<number>(1);
  const setOpenLoading = useState(true)[1];

  const [closedCurrentPage, setClosedCurrentPage] = useState<number>(1);
  const [closedRecordsPerPage, setClosedRecordsPerPage] = useState<number>(10);
  const [closedTotalPages, setClosedTotalPages] = useState<number>(0);
  const setClosedLoading = useState(true)[1];
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getAccounts();
  }, [openCurrentPage, openRecordsPerPage]);

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
          setOpenTotalPages(
            Math.ceil(
              res?.active_accounts?.open_accounts_count / openRecordsPerPage
            )
          );
          setClosedTotalPages(
            Math.ceil(
              res?.closed_accounts?.closed_accounts_count / openRecordsPerPage
            )
          );
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

  const handlePageChange = (page: number) => {
    if (tab === 'open') {
      setOpenLoading(true);
      setOpenCurrentPage(page);
    } else {
      setClosedLoading(true);
      setClosedCurrentPage(page);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = Number(e.target.value);
    if (tab === 'open') {
      setOpenLoading(true);
      setOpenRecordsPerPage(value);
      setOpenCurrentPage(1);
    } else {
      setClosedLoading(true);
      setClosedRecordsPerPage(value);
      setClosedCurrentPage(1);
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
            <Pagination
              currentPage={tab === 'open' ? openCurrentPage : closedCurrentPage}
              totalPages={tab === 'open' ? openTotalPages : closedTotalPages}
              recordsPerPage={
                tab === 'open' ? openRecordsPerPage : closedRecordsPerPage
              }
              handlePageChange={handlePageChange}
              handleSelectChange={handleSelectChange}
            />
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
