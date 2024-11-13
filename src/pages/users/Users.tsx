import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Container,
} from '@mui/material';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';
import { getComparator, stableSort } from '../../components/Sorting';
import { DeleteModal } from '../../components/DeleteModal';
import { Spinner } from '../../components/Spinner';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { fetchData } from '../../components/FetchData';
import { UsersUrl, UserUrl } from '../../services/ApiUrls';
import { CustomToolbar } from '../../styles/CssStyled';
import { useMyContext } from '../../context/Context';
import DynamicModal from '../../components/modal/modal';
import { FaFilter } from 'react-icons/fa';
import { Label } from '../../components/label-user';
import { HeadCell, Item } from './types';
import Pagination from '../../components/pagination/Pagination';

const headCells: readonly HeadCell[] = [
  {
    id: 'first_name',
    numeric: true,
    disablePadding: false,
    label: 'First Name',
  },
  {
    id: 'last_name',
    numeric: true,
    disablePadding: false,
    label: 'Last Name',
  },
  {
    id: 'phone',
    numeric: true,
    disablePadding: false,
    label: 'Mobile Number',
  },
  {
    id: 'role',
    numeric: true,
    disablePadding: false,
    label: 'Role',
  },
  {
    id: 'status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'actions',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
];

const roleDisplayMap: { [key: string]: string } = {
  ADMIN: 'ADMIN',
  'SALES MANAGER': 'SALES MANAGER',
  'SALES REP': 'SALES REPRESENTATIVE',
  USER: 'USER',
};

export default function Users() {
  const navigate = useNavigate();
  const { userRole, userId } = useMyContext();
  const tab = useState('active')[0];
  const setLoading = useState(true)[1];
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Website');
  const [data, setData] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<Item[]>([]);
  const setActiveUsersOffset = useState(0)[1];
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const setInactiveUsersOffset = useState(0)[1];
  const [deleteRowModal, setDeleteRowModal] = useState(false);

  const [selected, setSelected] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [isSelectedId, setIsSelectedId] = useState<boolean[]>([]);

  const [activeCurrentPage, setActiveCurrentPage] = useState<number>(1);
  const [activeRecordsPerPage, setActiveRecordsPerPage] = useState<number>(10);
  const [activeTotalPages, setActiveTotalPages] = useState<number>(0);
  const setActiveLoading = useState(true)[1];

  const [inactiveCurrentPage, setInactiveCurrentPage] = useState<number>(1);
  const [inactiveRecordsPerPage, setInactiveRecordsPerPage] =
    useState<number>(10);
  const [inactiveTotalPages, setInactiveTotalPages] = useState<number>(0);
  const setInactiveLoading = useState(true)[1];

  const getUsers = useCallback(async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };

    try {
      const activeOffset = (activeCurrentPage - 1) * activeRecordsPerPage;
      const inactiveOffset = (inactiveCurrentPage - 1) * inactiveRecordsPerPage;

      await fetchData(
        `${UsersUrl}/?offset=${
          tab === 'active' ? activeOffset : inactiveOffset
        }&limit=${
          tab === 'active' ? activeRecordsPerPage : inactiveRecordsPerPage
        }`,
        'GET',
        null as any,
        Header
      ).then((res) => {
        if (!res.error) {
          setData(res || []);
          setActiveUsers(res?.active_users?.active_users);
          setActiveTotalPages(
            Math.ceil(
              res?.active_users?.active_users_count / activeRecordsPerPage
            )
          );
          setActiveUsersOffset(res?.active_users?.offset);
          setInactiveUsers(res?.inactive_users?.inactive_users);
          setInactiveTotalPages(
            Math.ceil(
              res?.inactive_users?.inactive_users_count / inactiveRecordsPerPage
            )
          );
          setInactiveUsersOffset(res?.inactive_users?.offset);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [
    activeCurrentPage,
    activeRecordsPerPage,
    inactiveCurrentPage,
    inactiveRecordsPerPage,
    tab,
    setActiveUsersOffset,
    setInactiveUsersOffset,
    setLoading,
  ]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const userDetail = (userId: any) => {
    navigate(`/app/users/${userId}`);
  };

  const handlePageChange = (page: number) => {
    if (tab === 'active') {
      setActiveLoading(true);
      setActiveCurrentPage(page);
    } else {
      setInactiveLoading(true);
      setInactiveCurrentPage(page);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = Number(e.target.value);

    if (tab === 'active') {
      setActiveLoading(true);
      setActiveRecordsPerPage(value);
      setActiveCurrentPage(1);
    } else {
      setInactiveLoading(true);
      setInactiveRecordsPerPage(value);
      setActiveCurrentPage(1);
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

  const getUserDetail = (id: any) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    fetchData(`${UserUrl}/${id}/`, 'GET', null as any, Header).then((res) => {
      if (!res.error) {
        const data = res?.data?.profile_obj;
        navigate('/app/users/edit-user', {
          state: {
            value: {
              email: data?.user_details?.email,
              role: data?.role,
              phone: data?.phone,
              alternate_phone: data?.alternate_phone,
              address_line: data?.address?.address_line,
              street: data?.address?.street,
              city: data?.address?.city,
              state: data?.address?.state,
              postcode: data?.address?.postcode,
              country: data?.address?.country,
              profile_pic: data?.user_details?.profile_pic,
              has_sales_access: data?.has_sales_access,
              has_marketing_access: data?.has_marketing_access,
              is_organization_admin: data?.is_organization_admin,
            },
            id: id,
            edit: true,
          },
        });
      }
    });
  };

  const EditItem = (userId: any) => {
    getUserDetail(userId);
  };

  const deleteRowModalClose = () => {
    setDeleteRowModal(false);
    setSelectedId([]);
  };

  const DeleteItem = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    fetchData(`${UserUrl}/${selectedId}/`, 'DELETE', null as any, Header)
      .then((res: any) => {
        if (!res.error) {
          deleteRowModalClose();
          getUsers();
        }
      })
      .catch(() => {});
  };

  const handleSelectAllClick = () => {
    if (selected.length === activeUsers.length) {
      setSelected([]);
      setSelectedId([]);
      setIsSelectedId([]);
    } else {
      const newSelectedIds = activeUsers.map((user) => user.id);
      setSelected(newSelectedIds);
      setSelectedId(newSelectedIds);
      setIsSelectedId(newSelectedIds.map(() => true));
    }
  };

  const showAddButton = userRole === 'ADMIN';
  const modalDialog = 'Are You Sure You want to delete this User?';
  const modalTitle = 'Delete User';

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
          <IconButton color="primary">
            <FaFilter style={{ color: '#333F49' }} />
          </IconButton>
          {showAddButton && (
            <>
              <DynamicModal
                mode="add"
                page="Users"
                data={data}
                onSaveSuccess={async () => {
                  await getUsers();
                }}
              />
            </>
          )}
          <Pagination
            currentPage={
              tab === 'active' ? activeCurrentPage : inactiveCurrentPage
            }
            totalPages={
              tab === 'active' ? activeTotalPages : inactiveTotalPages
            }
            recordsPerPage={
              tab === 'active' ? activeRecordsPerPage : inactiveRecordsPerPage
            }
            handlePageChange={handlePageChange}
            handleSelectChange={handleSelectChange}
          />
        </Stack>
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
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={activeUsers?.length}
                  numSelectedId={selectedId}
                  isSelectedId={isSelectedId}
                  headCells={headCells}
                />
                {tab === 'active' ? (
                  <TableBody>
                    {activeUsers?.length > 0 ? (
                      stableSort(
                        activeUsers,
                        getComparator(order, orderBy)
                      ).map((item: any, index: any) => {
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
                              onClick={() => userDetail(item.id)}
                            >
                              {item?.user_details?.first_name
                                ? item.user_details.first_name
                                : '---'}
                            </TableCell>
                            <TableCell
                              className="tableCell-link"
                              onClick={() => userDetail(item.id)}
                            >
                              {item?.user_details?.last_name
                                ? item.user_details.last_name
                                : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              <div style={{ display: 'flex' }}>
                                {item?.phone ? item.phone : '---'}
                              </div>
                            </TableCell>

                            <TableCell className="tableCell">
                              {item?.role ? roleDisplayMap[item.role] : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              <Label
                                tags={
                                  item?.user_details?.is_active === true
                                    ? 'ACTIVE'
                                    : item?.user_details?.is_active === false
                                    ? 'INACTIVE'
                                    : '---'
                                }
                              />
                            </TableCell>
                            <TableCell className="tableCell">
                              {(userRole === 'ADMIN' ||
                                item?.user_details?.id === userId) && (
                                <DynamicModal
                                  mode="edit"
                                  page="Users"
                                  id={item.id}
                                  data={data}
                                  icon={true}
                                  onSaveSuccess={async () => {
                                    await getUsers();
                                  }}
                                />
                              )}
                              {userRole === 'ADMIN' && (
                                <IconButton onClick={() => deleteRow(item.id)}>
                                  <FaTrashAlt
                                    style={{
                                      fill: '#1A3353',
                                      cursor: 'pointer',
                                      width: '15px',
                                    }}
                                  />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ border: 0 }}>
                          <Spinner />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                ) : (
                  <TableBody>
                    {inactiveUsers?.length > 0 ? (
                      stableSort(
                        inactiveUsers,
                        getComparator(order, orderBy)
                      ).map((item: any, index: any) => {
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
                              onClick={() => userDetail(item.id)}
                            >
                              {item?.user_details?.email
                                ? item.user_details.email
                                : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              <div style={{ display: 'flex' }}>
                                {item?.phone ? item.phone : '---'}
                              </div>
                            </TableCell>
                            <TableCell className="tableCell">
                              {item?.role ? item.role : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              <IconButton onClick={() => EditItem(item.id)}>
                                <FaEdit
                                  style={{
                                    fill: '#1A3353',
                                    cursor: 'pointer',
                                    width: '18px',
                                  }}
                                />
                              </IconButton>
                              <IconButton onClick={() => deleteRow(item?.id)}>
                                <FaTrashAlt
                                  style={{
                                    fill: '#1A3353',
                                    cursor: 'pointer',
                                    width: '15px',
                                  }}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} sx={{ border: 0 }}>
                          <Spinner />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                )}
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
        DeleteItem={DeleteItem}
      />
    </Box>
  );
}
