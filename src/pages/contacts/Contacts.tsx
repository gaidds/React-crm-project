import {
  Box,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
  Paper,
  Select,
  MenuItem,
  TableCell,
  Container,
  IconButton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import { getComparator, stableSort } from '../../components/Sorting';
import { Spinner } from '../../components/Spinner';
import { fetchData } from '../../components/FetchData';
import { ContactUrl } from '../../services/ApiUrls';
import { CustomToolbar, FabLeft, FabRight } from '../../styles/CssStyled';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';
import { DeleteModal } from '../../components/DeleteModal';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';
import { useMyContext } from '../../context/Context';
import DynamicModal from '../../components/modal/modal';
import { FaFilter } from 'react-icons/fa';

interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'first_name',
    numeric: false,
    disablePadding: false,
    label: 'First Name',
  },
  {
    id: 'last_name',
    numeric: false,
    disablePadding: false,
    label: 'Last Name',
  },
  {
    id: 'primary_email',
    numeric: true,
    disablePadding: false,
    label: 'Email Address',
  },
  {
    id: 'mobile_number',
    numeric: true,
    disablePadding: false,
    label: 'Phone Number',
  },
  {
    id: '',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
];

export default function Contacts() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [contactList, setContactList] = useState([]);
  const [countries, setCountries] = useState([]);

  const [deleteRowModal, setDeleteRowModal] = useState(false);

  const [selected, setSelected] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [isSelectedId, setIsSelectedId] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('first_name');

  const [selectOpen, setSelectOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { userRole, setUserRole, userId } = useMyContext();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getContacts();
  }, [currentPage, recordsPerPage]);

  const getContacts = async () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    try {
      const offset = (currentPage - 1) * recordsPerPage;
      await fetchData(
        `${ContactUrl}/?offset=${offset}&limit=${recordsPerPage}`,
        'GET',
        null as any,
        Header
      ).then((data) => {
        if (!data.error) {
          setContactList(data.contact_obj_list);
          setData(data);
          setCountries(data?.countries);
          setTotalPages(Math.ceil(data?.contacts_count / recordsPerPage));
          setLoading(false);
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
    const contactHandle = (id: string) => {
        navigate(`/app/contacts/${id}`);
    };

  const DeleteItem = () => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };
    fetchData(`${ContactUrl}/${selectedId}/`, 'DELETE', null as any, Header)
      .then((res: any) => {
        if (!res.error) {
          deleteRowModalClose();
          getContacts();
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

  const deleteRow = (deleteId: any) => {
    setDeleteRowModal(true);
    setSelectedId(deleteId);
  };
  const deleteRowModalClose = () => {
    setDeleteRowModal(false);
    setSelectedId('');
  };

  const showAddButton = userRole !== 'USER' && userRole !== 'SALES REP';
  const modalDialog = 'Are You Sure you want to delete this contact?';
  const modalTitle = 'Delete Contact';

  const recordsList = [
    [10, '10 Records per page'],
    [20, '20 Records per page'],
    [30, '30 Records per page'],
    [40, '40 Records per page'],
    [50, '50 Records per page'],
  ];
  return (
    <Box>
      <CustomToolbar
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: '16px'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton color="primary">
            <FaFilter style={{ color: '#333F49' }} />
          </IconButton>
          {showAddButton && (
            <DynamicModal
              mode="add"
              page="Contacts"
              data={data}
              onSaveSuccess={async () => {
                await getContacts();
              }}
            />
          )}
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
            sx={{ '& .MuiSelect-select': { overflow: 'visible !important' } }}
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
            </Typography>
            <FabRight
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight style={{ height: '15px' }} />
            </FabRight>
          </Box>
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
                  onRequestSort={handleRequestSort}
                  numSelectedId={selectedId}
                  isSelectedId={isSelectedId}
                  headCells={headCells}
                />
                <TableBody>
                  {contactList?.length
                    ? stableSort(
                        contactList,
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
                              onClick={() => contactHandle(item.id)}
                            >
                              {item.first_name}
                            </TableCell>
                            <TableCell
                              className="tableCell-link"
                              onClick={() => contactHandle(item.id)}
                            >
                              {item.last_name}
                            </TableCell>
                            <TableCell className="tableCell">
                              {item.primary_email}
                            </TableCell>
                            <TableCell className="tableCell">
                              {item.mobile_number ? item.mobile_number : '---'}
                            </TableCell>
                            <TableCell className="tableCell">
                              {userRole === 'ADMIN' ||
                              (userRole === 'SALES MANAGER' &&
                                item.created_by === userId) ? (
                                <>
                                  <DynamicModal
                                    mode="edit"
                                    page="Contacts"
                                    id={item.id}
                                    data={data}
                                    icon={true}
                                    onSaveSuccess={async () => {
                                      await getContacts();
                                    }}
                                  />
                                  <FaTrashAlt
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => deleteRow(item.id)}
                                  />
                                </>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : ''}
                </TableBody>
              </Table>
            </TableContainer>
            {loading && <Spinner />}
          </Paper>
        </Box>
      </Container>
      {
        <DeleteModal
          onClose={deleteRowModalClose}
          open={deleteRowModal}
          id={selectedId}
          modalDialog={modalDialog}
          modalTitle={modalTitle}
          DeleteItem={DeleteItem}
        />
      }
    </Box>
  );
}
