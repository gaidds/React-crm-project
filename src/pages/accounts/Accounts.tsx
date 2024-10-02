import React, { SyntheticEvent, useEffect, useState, ChangeEvent } from 'react'
import { Box, Button, Card, Stack, Tab, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Tabs, Toolbar, Typography, Paper, TableCell, IconButton, Checkbox, Tooltip, TableSortLabel, alpha, MenuItem, Select, Avatar, Fab, Container, TextField, AvatarGroup, SelectChangeEvent } from '@mui/material'
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { FiChevronLeft } from "@react-icons/all-files/fi/FiChevronLeft";
import { FiChevronRight } from "@react-icons/all-files/fi/FiChevronRight";
import { FiChevronDown } from "@react-icons/all-files/fi/FiChevronDown";
import { FiChevronUp } from "@react-icons/all-files/fi/FiChevronUp";
import { CustomTab, CustomToolbar, FabLeft, FabRight } from '../../styles/CssStyled';
import { getComparator, stableSort } from '../../components/Sorting';
import { FaAd, FaEdit, FaFilter, FaTrashAlt } from 'react-icons/fa';
import { fetchData } from '../../components/FetchData';
import { AccountsUrl } from '../../services/ApiUrls';
import { useNavigate } from 'react-router-dom';
import { DeleteModal } from '../../components/DeleteModal';
import { Tags } from '../../components/Tags';
import { Spinner } from '../../components/Spinner';
import styled from '@emotion/styled';
import '../../styles/style.css';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';
import MyContext, { useMyContext } from '../../context/Context'
import DynamicModal from '../../components/modal/modal';

interface HeadCell {
    disablePadding: boolean;
    id: any;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'user_name',
        numeric: false,
        disablePadding: false,
        label: 'Name'
    },
    {
        id: 'website',
        numeric: false,
        disablePadding: false,
        label: 'Website'
    },
    {
        id: 'created_by',
        numeric: true,
        disablePadding: false,
        label: 'Created By'
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
        label: 'Actions'
    }
]

type Item = {
    id: string;
};
export default function Accounts() {
    const { userRole, setUserRole , userId, profileId} = useMyContext();

    const [tab, setTab] = useState('open');
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('Website')
    const [initial, setInitial] = useState(true)
    const [openOffset, setOpenOffset] = useState(0)
    const [openValue] = useState(1)
    const [closeOffset, setCloseOffset] = useState(0)
    const [setCloseValue] = useState(1)
    const [deleteItems, setDeleteItems] = useState([])
    const [page, setPage] = useState(0)
    const [values, setValues] = useState(10)
    const [dense] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [deleteItemId, setDeleteItemId] = useState('')
    const [loader, setLoader] = useState(true)
    const [isDelete, setIsDelete] = useState(false)
    const [selectOpen, setSelectOpen] = useState(false);

    const [contacts, setContacts] = useState([])
    const [status, setStatus] = useState([])
    const [source, setSource] = useState([])
    const [companies, setCompanies] = useState([])
    const [tags, setTags] = useState([])
    const [users, setUsers] = useState([])
    const [countries, setCountries] = useState([])
    const [industries, setIndustries] = useState([])
    const [leads, setLeads] = useState([])
    const [teams, setTeams] = useState([])

    const [openAccounts, setOpenAccounts] = useState<Item[]>([])
    const [openAccountsCount, setOpenAccountsCount] = useState(0)
    const [openAccountsOffset, setOpenAccountsOffset] = useState(0)
    const [closedAccounts, setClosedAccounts] = useState<Item[]>([])
    const [closedAccountsCount, setClosedAccountsCount] = useState(0)
    const [closedAccountsOffset, setClosedAccountsOffset] = useState(0)
    const [deleteRowModal, setDeleteRowModal] = useState(false)

    const [selected, setSelected] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const [isSelectedId, setIsSelectedId] = useState<boolean[]>([]);

    const [openCurrentPage, setOpenCurrentPage] = useState<number>(1);
    const [openRecordsPerPage, setOpenRecordsPerPage] = useState<number>(10);
    const [openTotalPages, setOpenTotalPages] = useState<number>(0);
    const [openLoading, setOpenLoading] = useState(true);


    const [closedCurrentPage, setClosedCurrentPage] = useState<number>(1);
    const [closedRecordsPerPage, setClosedRecordsPerPage] = useState<number>(10);
    const [closedTotalPages, setClosedTotalPages] = useState<number>(0);
    const [closedLoading, setClosedLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);


    useEffect(() => {
        getAccounts()
    }, [openCurrentPage, openRecordsPerPage, closedCurrentPage, closedRecordsPerPage]);

    const handleChangeTab = (e: SyntheticEvent, val: any) => {
        setTab(val)
    }

    const getAccounts = async () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
          }
        try {
            const openOffset = (openCurrentPage - 1) * openRecordsPerPage;
            const closeOffset = (closedCurrentPage - 1) * closedRecordsPerPage;
            await fetchData(`${AccountsUrl}/?offset=${tab === "open" ? openOffset : closeOffset}&limit=${tab === "open" ? openRecordsPerPage : closedRecordsPerPage}`, 'GET', null as any, Header)
                .then((res: any) => {
                    if (!res.error) {
                        //console.log(res, 'accounts');
                        setOpenAccounts(res?.active_accounts?.open_accounts)
                        // setOpenAccountsCount(res?.active_accounts?.active_users_count)
                        // setOpenAccountsOffset(res?.active_accounts?.offset)
                        setClosedAccounts(res?.closed_accounts?.close_accounts)
                        // setClosedAccountsCount(res?.closed_accounts?.close_accounts_count)
                        // setClosedAccountsOffset(res?.closed_accounts?.offset)
                        setContacts(res?.contacts)
                        setIndustries(res?.industries)
                        setUsers(res?.users)
                        setStatus(res?.status)
                        setCountries(res?.countries)
                        setLeads(res?.leads)
                        setTags(res?.tags)
                        setTeams(res?.teams)
                        setData(res || []);
                        setLoading(false)
                    }
                })
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }

    }
    const navigate = useNavigate();
    const accountDetail = (accountId: string) => {
        navigate(`/app/accounts/${accountId}`, { state: { accountId, detail: true, contacts: contacts || [], status: status || [], tags: tags || [], users: users || [], countries: countries || [], teams: teams || [], leads: leads || [] } })
    }
    const handleRecordsPerPage = (event: SelectChangeEvent<number>) => {
        const selectedValue = Number(event.target.value); // Explicitly convert value to number
    
        if (tab === 'open') {
            setOpenLoading(true);
            setOpenRecordsPerPage(selectedValue); // Use the converted number
            setOpenCurrentPage(1);
        } else {
            setClosedLoading(true);
            setClosedRecordsPerPage(selectedValue); // Use the converted number
            setClosedCurrentPage(1);
        }
    };
    
    const handlePreviousPage = () => {
        if (tab == 'open') {
            setOpenLoading(true)
            setOpenCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        } else {
            setClosedLoading(true)
            setClosedCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        }
    };

    const handleNextPage = () => {
        if (tab == 'open') {
            setOpenLoading(true)
            setOpenCurrentPage((prevPage) => Math.min(prevPage + 1, openTotalPages));
        } else {
            setClosedLoading(true)
            setClosedCurrentPage((prevPage) => Math.min(prevPage + 1, closedTotalPages));
        }
    };
    const handleRequestSort = (event: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    type SelectedItem = string[];

    const isSelected = (name: string, selected: SelectedItem): boolean => {
        return selected.indexOf(name) !== -1;
    };

    const deleteItemBox = (deleteId: any) => {
        setDeleteItemId(deleteId)
        setIsDelete(!isDelete)
    }

    const onclose = () => {
        setIsDelete(!isDelete)
    }

    const onDelete = (id: any) => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
          }
        fetchData(`${AccountsUrl}/${id}/`, 'delete', null as any, Header)
            .then((data) => {
                if (!data.error) {
                    getAccounts()
                    setIsDelete(false)
                }
            })
            .catch(() => {
            })
    }

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - 7) : 0

    const onAddAccount = () => {
        if (!loading) {
            navigate('/app/accounts/add-account', {
                state: {
                    detail: false,
                    contacts: contacts || [], status: status || [], tags: tags || [], users: users || [], countries: countries || [], teams: teams || [], leads: leads || []
                }
            })
        }
    }
    const deleteRow = (id: any) => {
        setSelectedId(id)
        setDeleteRowModal(!deleteRowModal)
    }

    const EditItem = (accountId: any) => {
        getAccountDetail(accountId)
    }

    const deleteRowModalClose = () => {
        setDeleteRowModal(false)
        setSelectedId([])
    }
    const deleteItem = () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
          }
        fetchData(`${AccountsUrl}/${selectedId}/`, 'DELETE', null as any, Header)
            .then((res: any) => {
                //console.log('delete:', res);
                if (!res.error) {
                    deleteRowModalClose()
                    getAccounts()
                }
            })
            .catch(() => {
            })
    }

    const handleSelectAllClick = () => {
        if (tab === 'open') {
            if (selected.length === openAccounts.length) {
                setSelected([]);
                setSelectedId([]);
                setIsSelectedId([]);
            } else {
                const newSelectedIds = openAccounts.map((account) => account.id);
                setSelected(newSelectedIds);
                setSelectedId(newSelectedIds);
                setIsSelectedId(newSelectedIds.map(() => true));
            }
        } else {
            if (selected.length === closedAccounts.length) {
                setSelected([]);
                setSelectedId([]);
                setIsSelectedId([]);
            } else {
                const newSelectedIds = closedAccounts.map((account) => account.id);
                setSelected(newSelectedIds);
                setSelectedId(newSelectedIds);
                setIsSelectedId(newSelectedIds.map(() => true));
            }
        }

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

    const getAccountDetail = (id: any) => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
          }
        fetchData(`${AccountsUrl}/${id}/`, 'GET', null as any, Header)
            .then((res) => {
                //console.log(res, 'resDetail');
                if (!res.error) {
                    const accountDetails = res?.account_obj
                    navigate('/app/accounts/edit-account', {
                        state: {
                            contacts: contacts || [], status: status || [], tags: tags || [], users: users || [], countries: countries || [], teams: teams || [], leads: leads || [],
                            value: {
                                name: accountDetails?.name,
                                phone: accountDetails?.phone,
                                email: accountDetails?.email,
                                billing_address_line: accountDetails?.billing_address_line,
                                billing_street: accountDetails?.billing_street,
                                billing_city: accountDetails?.billing_city,
                                billing_state: accountDetails?.billing_state,
                                billing_postcode: accountDetails?.billing_postcode,
                                billing_country: accountDetails?.billing_country,
                                contact_name: accountDetails?.contact_name,
                                teams: accountDetails?.teams || [],
                                assigned_to: accountDetails?.assigned_to || [],
                                tags: accountDetails?.tags || [],
                                account_attachment: accountDetails?.account_attachment || null,
                                website: accountDetails?.website,
                                status: accountDetails?.status,
                                lead: accountDetails?.lead?.account_name,
                                created_by: accountDetails?.created_by,
                            }, id: id, edit: true
                        }
                    })
                }
            })
    }
    const handleDelete = (id: any) => {
        //console.log(id, 's;ected')
    }
    const showAddButton = userRole !== 'USER' && userRole !== 'SALES REP';
    const modalDialog = 'Are You Sure You want to delete this Account?'
    const modalTitle = 'Delete Account'

    const recordsList = [[10, '10 Records per page'], [20, '20 Records per page'], [30, '30 Records per page'], [40, '40 Records per page'], [50, '50 Records per page']]

    // const selectClasses = selectOpen ? 'select-opened' : '';
    // console.log(!!(selectedId?.length === 0), 'asd');

    return (
        <Box sx={{ mt: '60px' }}>
            <CustomToolbar
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                    }}
            >
            <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
            sx={{
                
                color: '#37474F', // Dark gray filter color
                borderRadius: '50%', // Make the icon circular
                width: '40px',
                height: '40px',
                '&:hover': {
                backgroundColor: '#CFD8DC', // Slight hover color
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
    
    <Stack direction="row" alignItems="center" spacing={2} justifyContent="flex-end">
      {/* Records per Page Dropdown */}
     
      <Select
        value={tab === 'open' ? openRecordsPerPage : closedRecordsPerPage}
        onChange={(event: SelectChangeEvent<number>) =>
          handleRecordsPerPage(event)
        } // Fixing the onChange type
        sx={{
            backgroundColor: 'white',
            minWidth: '80px',
            borderRadius: '8px',
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, // Remove default border
            padding: '6px', // Adjust padding for dropdown text
            fontSize: '14px',
            color: '#000', // Black text
            height: '35px'

          }}
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
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white', // Same white background as the Records per page
            borderRadius: '10px', // Rounded corners to match design
            padding: '0px 8px', // Padding inside the pagination controls
            border: '1px solid #ccc', // Add light border
            height: '36px', // Same height as Records per Page dropdown for uniformity
          }}
        >
        {/* Previous Page Button */}
        <IconButton
          onClick={handlePreviousPage}
          disabled={tab === 'open' ? openCurrentPage === 1 : closedCurrentPage === 1}
          sx={{
            padding: 0,
            '&:disabled': { color: '#D3D3D3' }, // Grey when disabled
            color: '#000000',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <FiChevronLeft style={{ fontSize: '18px' }} />
        </IconButton>

        {/* Current Page / Total Pages */}
        <Typography
          sx={{
            fontSize: '14px',
            color: '#000000',
            textAlign: 'center',
            padding: '0px 8px', // Adjust spacing for page number text
          }}
        >
          {tab === 'open'
            ? `${openCurrentPage} of ${openTotalPages}`
            : `${closedCurrentPage} of ${closedTotalPages}`}
        </Typography>

        {/* Next Page Button */}
        <IconButton
          onClick={handleNextPage}
          disabled={
            tab === 'open'
              ? openCurrentPage === openTotalPages
              : closedCurrentPage === closedTotalPages
          }
          sx={{
            padding: 0,
            '&:disabled': { color: '#D3D3D3' }, // Grey when disabled
            color: '#000000',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <FiChevronRight style={{ fontSize: '18px' }} />
        </IconButton>
      </Box>
    </Stack>
  </CustomToolbar>
            <Container sx={{ width: '100%', maxWidth: '100%', minWidth: '100%' }}>
                <Box sx={{ width: '100%', minWidth: '100%', m: '15px 0px 0px 0px' }}>
                    <Paper sx={{ width: 'calc(100% - 15px)', mb: 2, p: '15px 15px 15px 15px', borderRadius:'16px'}}>
                        <TableContainer sx={{borderRadius: '16px'}}>
                            <Table    sx={{"& .MuiTableCell-head": {
                                      color: "white",
                                      backgroundColor: "#6B778C",
                                  }}}>
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={tab === 'open' ? openAccounts?.length : closedAccounts?.length}
                                    numSelectedId={selectedId}
                                    isSelectedId={isSelectedId}
                                    headCells={headCells}
                                />
                                {tab === 'open' ?
                                    <TableBody>
                                        {
                                            openAccounts?.length > 0
                                                ? stableSort(openAccounts, getComparator(order, orderBy))
                                                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: any) => {
                                                    .map((item: any, index: any) => {
                                                        const labelId = `enhanced-table-checkbox-${index}`
                                                        const rowIndex = selectedId.indexOf(item.id);
                
                                                        return (
                                                            <TableRow
                                                                tabIndex={-1}
                                                                key={index}
                                                                sx={{ border: 0, '&:nth-of-type(even)': { backgroundColor: 'whitesmoke' }, color: 'rgb(26, 51, 83)', textTransform: 'capitalize' }}
                                                            >
                                                                <TableCell
                                                                    className='tableCell-link'
                                                                    onClick={() => accountDetail(item.id)}
                                                                >
                                                                    {item?.name ? item?.name : '---'}
                                                                </TableCell>
                                                                <TableCell className='tableCell'>
                                                                    {item?.website ? item?.website : '---'}
                                                                </TableCell>
                                                                <TableCell className='tableCell'>
                                                                    <Stack style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                                                        <Avatar src={item?.created_by?.profile_pic} alt={item?.created_by?.email} /><Stack sx={{ ml: 1 }}>{item?.created_by?.email ? item?.created_by?.email : '---'}</Stack>
                                                                    </Stack>
                                                                </TableCell>
                                                                <TableCell className='tableCell' sx={{display:"flex", justifyContent: "flex-start"}}>
                                                                    <AvatarGroup max={4}>
                                                                    {item?.assigned_to?.length ? item.assigned_to.map((assignee: any, i: any) => (
                                                                        <Avatar
                                                                        key={i}
                                                                        src={assignee.user_details?.profile_pic || undefined}
                                                                        alt={assignee.user_details?.email || 'Unknown'}
                                                                        />
                                                                    )) : '---'}
                                                                    </AvatarGroup>
                                                                </TableCell>                                                 
                                                                <TableCell className='tableCell'>
                                                                {(userRole === 'ADMIN' || 
                                                                    item.created_by.id === userId || 
                                                                    item.assigned_to.some((assignee: any) => assignee.id === profileId)) && (
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
                                                                    {(userRole === 'ADMIN' || item.created_by.id === userId) && (
                                                                        <FaTrashAlt
                                                                            style={{ cursor: 'pointer' }}
                                                                            onClick={() => deleteRow(item.id)}
                                                                        />
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })
                                                : <TableRow> <TableCell colSpan={6} sx={{ border: 0 }}><Spinner /></TableCell></TableRow>
                                        }
                                    </TableBody> :
                                    <TableBody>
                                        {
                                            openAccounts?.length > 0
                                                ? stableSort(openAccounts, getComparator(order, orderBy)).map((item: any, index: any) => {
                                                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: any) => {
                                                    const labelId = `enhanced-table-checkbox-${index}`
                                                    const rowIndex = selectedId.indexOf(item.id);
                                                    return (
                                                        <TableRow
                                                            tabIndex={-1}
                                                            key={index}
                                                            sx={{ border: 0, '&:nth-of-type(even)': { backgroundColor: 'whitesmoke' }, color: 'rgb(26, 51, 83)', textTransform: 'capitalize' }}
                                                        >
                                                            <TableCell
                                                                className='tableCell-link'
                                                                onClick={() => accountDetail(item.id)}
                                                            >
                                                                {item?.name ? item?.name : '---'}
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                {item?.website ? item?.website : '---'}
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                <Stack style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                                                                    <Avatar src={item?.lead?.created_by?.profile_pic} alt={item?.lead?.created_by?.email} /><Stack sx={{ ml: 1 }}>{item?.lead?.account_name ? item?.lead?.account_name : '---'}</Stack>
                                                                </Stack>
                                                            </TableCell>
                                                              {/* Add the Assigned To Column */}
                                                            <TableCell className='tableCell'>
                                                                <AvatarGroup max={4}>
                                                                    {item?.assigned_to?.length ? item.assigned_to.map((assignee: any, i: any) => (
                                                                        <Avatar
                                                                            key={i}
                                                                            src={assignee.user_details?.profile_pic || undefined}
                                                                            alt={assignee.user_details?.email || 'Unknown'}
                                                                        />
                                                                    )) : '---'}
                                                                </AvatarGroup>
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                {item?.lead?.country ? item?.lead?.country : '---'}
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                {item?.tags?.length ? item?.tags.map((tag: any, i: any) => <Stack sx={{ mr: 0.5 }}> Tags(tag)</Stack>) : '---'}
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                            {(userRole === 'ADMIN' || 
                                                                item.created_by.id === userId || 
                                                                item.assigned_to.some((assignee: any) => assignee.id === profileId)) && (
                                                                        <FaEdit
                                                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                                                            onClick={() => EditItem(item.id)}
                                                                        />
                                                                    )}
                                                                {userRole === 'ADMIN' || (userRole === 'SALES MANAGER' && item.created_by.id === userId) ? (
                                                                        <IconButton>
                                                                            <FaTrashAlt
                                                                            onClick={() => deleteRow(item.id)}
                                                                            style={{ fill: '#1A3353', cursor: 'pointer', width: '15px' }}
                                                                            />
                                                                        </IconButton>
                                                                        ) : null}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                                : <TableRow> <TableCell colSpan={6} sx={{ border: 0 }}><Spinner /></TableCell></TableRow>
                                        }
                                    </TableBody>
                                }

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
