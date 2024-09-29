import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, Stack, Tab, Table, TableBody, TableContainer, TableHead, TablePagination, TableRow, Tabs, Toolbar, Typography, Paper, TableCell, IconButton, Checkbox, Tooltip, TableSortLabel, alpha, Select, MenuItem, Container } from '@mui/material'
import { EnhancedTableHead } from '../../components/EnchancedTableHead';
import { getComparator, stableSort } from '../../components/Sorting';
import { DeleteModal } from '../../components/DeleteModal';
import { Spinner } from '../../components/Spinner';
import { FiPlus } from "@react-icons/all-files/fi/FiPlus";
import { FiChevronLeft } from "@react-icons/all-files/fi/FiChevronLeft";
import { FiChevronRight } from "@react-icons/all-files/fi/FiChevronRight";
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FaAd, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { fetchData } from '../../components/FetchData';
import { UsersUrl, UserUrl } from '../../services/ApiUrls';
import { CustomTab, CustomToolbar, FabLeft, FabRight } from '../../styles/CssStyled';
import MyContext, { useMyContext } from '../../context/Context'
import DynamicModal from '../../components/modal/modal';

interface HeadCell {
    disablePadding: boolean;
    id: any;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    // {
    //     id: 'user_name',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'User Name'
    // },
    // {
    //     id: 'first_name',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'First Name'
    // },
    // {
    //     id: 'last_name',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'Last Name'
    // },
    {
        id: 'first_name',
        numeric: true,
        disablePadding: false,
        label: 'First Name'
    },
    {
        id: 'last_name',
        numeric: true,
        disablePadding: false,
        label: 'Last Name'
    }, {
        id: 'phone',
        numeric: true,
        disablePadding: false,
        label: 'Mobile Number'
    },
    {
        id: 'role',
        numeric: true,
        disablePadding: false,
        label: 'Role'
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Status'
    },
    // {
    //     id: 'user_type',
    //     numeric: true,
    //     disablePadding: false,
    //     label: 'User Type'
    // },
    {
        id: 'actions',
        numeric: true,
        disablePadding: false,
        label: 'Actions'
    }
]

type Item = {
    id: string;
    // Other properties
};

const roleDisplayMap: { [key: string]: string } = {
    'ADMIN': 'ADMIN',
    'SALES MANAGER': 'SALES MANAGER',
    'SALES REP': 'SALES REPRESENTATIVE',
    'USER': 'USER'
};


export default function Users() {
    const navigate = useNavigate()
    const { userRole, userId } = useMyContext();
    const [tab, setTab] = useState('active');
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('asc')
    const [orderBy, setOrderBy] = useState('Website')
    const [deleteItems, setDeleteItems] = useState([])
    const [page, setPage] = useState(0)
    const [values, setValues] = useState(10)
    const [dense] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [data, setData] = useState<any[]>([]);
    const [deleteItemId, setDeleteItemId] = useState('')
    const [loader, setLoader] = useState(true)
    const [isDelete, setIsDelete] = useState(false)
    const [activeUsers, setActiveUsers] = useState<Item[]>([])
    const [activeUsersCount, setActiveUsersCount] = useState(0)
    const [activeUsersOffset, setActiveUsersOffset] = useState(0)
    const [inactiveUsers, setInactiveUsers] = useState([])
    const [InactiveUsersCount, setInactiveUsersCount] = useState(0)
    const [inactiveUsersOffset, setInactiveUsersOffset] = useState(0)
    const [deleteRowModal, setDeleteRowModal] = useState(false)
    // const [selectedId, setSelectedId] = useState('')

    const [selectOpen, setSelectOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const [isSelectedId, setIsSelectedId] = useState<boolean[]>([]);

    const [activeCurrentPage, setActiveCurrentPage] = useState<number>(1);
    const [activeRecordsPerPage, setActiveRecordsPerPage] = useState<number>(10);
    const [activeTotalPages, setActiveTotalPages] = useState<number>(0);
    const [activeLoading, setActiveLoading] = useState(true);


    const [inactiveCurrentPage, setInactiveCurrentPage] = useState<number>(1);
    const [inactiveRecordsPerPage, setInactiveRecordsPerPage] = useState<number>(10);
    const [inactiveTotalPages, setInactiveTotalPages] = useState<number>(0);
    const [inactiveLoading, setInactiveLoading] = useState(true);

    useEffect(() => {
        getUsers()
    }, [activeCurrentPage, activeRecordsPerPage, inactiveCurrentPage, inactiveRecordsPerPage]);

    const handleChangeTab = (e: SyntheticEvent, val: any) => {
        setTab(val)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };


    const getUsers = async () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        }
        try {
            const activeOffset = (activeCurrentPage - 1) * activeRecordsPerPage;
            const inactiveOffset = (inactiveCurrentPage - 1) * inactiveRecordsPerPage;
            await fetchData(`${UsersUrl}/?offset=${tab === "active" ? activeOffset : inactiveOffset}&limit=${tab === "active" ? activeRecordsPerPage : inactiveRecordsPerPage}`, 'GET', null as any, Header)
                // fetchData(`${UsersUrl}/`, 'GET', null as any, Header)
                .then((res: any) => {
                    if (!res.error) {
                        console.log(res, 'users')
                        setData(res || []);
                        setActiveUsers(res?.active_users?.active_users)
                        setActiveTotalPages(Math.ceil(res?.active_users?.active_users_count / activeRecordsPerPage));
                        setActiveUsersOffset(res?.active_users?.offset)
                        setInactiveUsers(res?.inactive_users?.inactive_users)
                        setInactiveTotalPages(Math.ceil(res?.inactive_users?.inactive_users_count / inactiveRecordsPerPage));
                        setInactiveUsersOffset(res?.inactive_users?.offset)
                        setLoading(false)
                        // setUsersData(
                        //   ...usersData, {
                        //     active_users: data.active_users.active_users,
                        //     active_users_count: data.active_users.active_users_count,
                        //     inactive_users_count: data.inactive_users.inactive_users_count,
                        //     inactive_users: data.inactive_users.inactive_users,
                        //     roles: data.roles,
                        //     status: data.status
                        //   }
                        // )
                        // setLoader(false)
                        // setactiveOffset(initial ? 0 : activeOffset)
                        // setinactiveOffset(initial ? 0 : inactiveOffset)
                        // setInitial(false)
                    }
                })
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const userDetail = (userId: any) => {
        navigate(`/app/users/user-details`, { state: { userId, detail: true } })
    }
    const handleRecordsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (tab == 'active') {
            setActiveLoading(true)
            setActiveRecordsPerPage(parseInt(event.target.value));
            setActiveCurrentPage(1);
        } else {
            setInactiveLoading(true)
            setInactiveRecordsPerPage(parseInt(event.target.value));
            setInactiveCurrentPage(1);
        }

    };
    const handlePreviousPage = () => {
        if (tab == 'active') {
            setActiveLoading(true)
            setActiveCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        } else {
            setInactiveLoading(true)
            setInactiveCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        }
    };

    const handleNextPage = () => {
        if (tab == 'active') {
            setActiveLoading(true)
            setActiveCurrentPage((prevPage) => Math.min(prevPage + 1, activeTotalPages));
        } else {
            setInactiveLoading(true)
            setInactiveCurrentPage((prevPage) => Math.min(prevPage + 1, inactiveTotalPages));
        }
    };
    const handleRequestSort = (event: any, property: any) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    // const handleSelectAllClick = (event: any) => {
    // if (event.target.checked) {
    //     const newSelected = rows.map((n) => n.name);
    //     setSelected(newSelected);
    //     return;
    //   }
    //   setSelected([]);
    // }
    // const selected: string[] = [...];1
    const handleClick = (event: React.MouseEvent<unknown>, name: any) => {
        // const selectedIndex = selected.indexOf(name as string);
        // let newSelected: string[] = [];

        // if (selectedIndex === -1) {
        //     newSelected = newSelected.concat(selected, name);
        // } else if (selectedIndex === 0) {
        //     newSelected = newSelected.concat(selected.slice(1));
        // } else if (selectedIndex === selected.length - 1) {
        //     newSelected = newSelected.concat(selected.slice(0, -1));
        // } else if (selectedIndex > 0) {
        //     newSelected = newSelected.concat(
        //         selected.slice(0, selectedIndex),
        //         selected.slice(selectedIndex + 1),
        //     );
        // }

        // setSelected(newSelected);
    };



    // const isSelected = (name: string) => selected.indexOf(name) !== -1;

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
        fetchData(`${UsersUrl}/${id}/`, 'delete', null as any, Header)
            .then((data) => {
                if (!data.error) {
                    getUsers()
                    setIsDelete(false)
                }
            })
            .catch(() => {
            })
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - 7) : 0
    // (tab === 0 ? accountData.accountLength : accountData.closed_accounts_length)

    const onAddUser = () => {
        if (!loading) {
            navigate('/app/users/add-users')
        }
        // navigate('/users/add-users', {
        //   state: {
        //     roles: usersData.roles,
        //     status: usersData.status
        //   }
        // })
    }
    const deleteRow = (id: any) => {
        setSelectedId(id)
        setDeleteRowModal(!deleteRowModal)
    }

    const getUserDetail = (id: any) => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        }
        fetchData(`${UserUrl}/${id}/`, 'GET', null as any, Header)
            .then((res) => {
                console.log(res, 'res');
                if (!res.error) {
                    const data = res?.data?.profile_obj
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
                            }, id: id, edit: true
                        }
                    })
                }
            })
    }

    const EditItem = (userId: any) => {
        getUserDetail(userId)
    }
    // const [selectedRows, setSelectedRows] = useState([]);
    // const [selectedRowId, setSelectedRowId] = useState(null);

    // const handleCheckboxClick = (rowId) => {
    //     const isSelected = selectedRows.includes(rowId);
    //     let updatedSelectedRows;

    //     if (isSelected) {
    //       updatedSelectedRows = selectedRows.filter((id) => id !== rowId);
    //     } else {
    //       updatedSelectedRows = [...selectedRows, rowId];
    //     }

    //     setSelectedRows(updatedSelectedRows);
    //   };
    const deleteRowModalClose = () => {
        setDeleteRowModal(false)
        setSelectedId([])
    }
    const DeleteItem = () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
        }
        fetchData(`${UserUrl}/${selectedId}/`, 'DELETE', null as any, Header)
            .then((res: any) => {
                console.log('delete:', res);
                if (!res.error) {
                    deleteRowModalClose()
                    getUsers()
                }
            })
            .catch(() => {
            })
    }


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

    const handleRowSelect = (userId: string) => {
        const selectedIndex = selected.indexOf(userId);
        let newSelected: string[] = [...selected];
        let newSelectedIds: string[] = [...selectedId];
        let newIsSelectedId: boolean[] = [...isSelectedId];

        if (selectedIndex === -1) {
            newSelected.push(userId);
            newSelectedIds.push(userId);
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
    const handleDelete = (id: any) => {
        console.log(id, 's;ected')
    }
    const showAddButton = userRole == 'ADMIN';
    const modalDialog = 'Are You Sure You want to delete this User?'
    const modalTitle = 'Delete User'

    const recordsList = [[10, '10 Records per page'], [20, '20 Records per page'], [30, '30 Records per page'], [40, '40 Records per page'], [50, '50 Records per page']]
    // console.log(!!(selectedId?.length === 0), 'asd');

    const activeStyle = {
        backgroundColor: '#ECFFEE',
        color: '#00B112',
        border: '2px solid green',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block',
    };

    const inactiveStyle = {
        backgroundColor: '#FFECEC',
        color: '#B10000',
        border: '2px solid red',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block',
    };

    const defaultStyle = {
        backgroundColor: 'white',
        color: 'gray',
        border: '2px solid gray',
        padding: '5px 10px',
        borderRadius: '5px',
        fontWeight: 'bold',
        display: 'inline-block',
    };

    return (
        <Box sx={{ mt: '60px' }}>
            <CustomToolbar>
                <Tabs defaultValue={tab} onChange={handleChangeTab} sx={{ mt: '26px' }}>
                    <CustomTab value="active" label="Active"
                        sx={{
                            backgroundColor: tab === 'active' ? '#F0F7FF' : '#284871',
                            color: tab === 'active' ? '#3f51b5' : 'white',
                        }}></CustomTab>
                    <CustomTab value="inactive" label="In Active"
                        sx={{
                            backgroundColor: tab === 'inactive' ? '#F0F7FF' : '#284871',
                            color: tab === 'inactive' ? '#3f51b5' : 'white',
                            ml: '5px',
                        }}
                    ></CustomTab>
                </Tabs>

                <Stack sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Select
                        value={tab === 'active' ? activeRecordsPerPage : inactiveRecordsPerPage}
                        onChange={(e: any) => handleRecordsPerPage(e)}
                        open={selectOpen}
                        onOpen={() => setSelectOpen(true)}
                        onClose={() => setSelectOpen(false)}
                        className={`custom-select`}
                        onClick={() => setSelectOpen(!selectOpen)}
                        IconComponent={() => (
                            <div onClick={() => setSelectOpen(!selectOpen)} className="custom-select-icon">
                                {selectOpen ? <FiChevronUp style={{ marginTop: '12px' }} /> : <FiChevronDown style={{ marginTop: '12px' }} />}
                            </div>
                        )}
                        sx={{
                            '& .MuiSelect-select': { overflow: 'visible !important' }
                        }}
                    >
                        {recordsList?.length && recordsList.map((item: any, i: any) => (
                            <MenuItem key={i} value={item[0]} >
                                {item[1]}
                            </MenuItem>
                        ))}
                    </Select>
                    <Box sx={{ borderRadius: '7px', backgroundColor: 'white', height: '40px', minHeight: '40px', maxHeight: '40px', display: 'flex', flexDirection: 'row', alignItems: 'center', mr: 1, p: '0px' }}>
                        <FabLeft onClick={handlePreviousPage} disabled={tab === 'active' ? activeCurrentPage === 1 : inactiveCurrentPage === 1}>
                            <FiChevronLeft style={{ height: '15px' }} />
                        </FabLeft>
                        <Typography sx={{ mt: 0, textTransform: 'lowercase', fontSize: '15px', color: '#1A3353', textAlign: 'center' }}>
                            {tab === 'active' ? `${activeCurrentPage} to ${activeTotalPages}` : `${inactiveCurrentPage} to ${inactiveTotalPages}`}

                        </Typography>
                        <FabRight onClick={handleNextPage} disabled={tab === 'active' ? (activeCurrentPage === activeTotalPages) : (inactiveCurrentPage === inactiveTotalPages)}>
                            <FiChevronRight style={{ height: '15px' }} />
                        </FabRight>
                    </Box>
                    {showAddButton && (
                        <DynamicModal
                            mode="add"
                            page="Users"
                            data={data}
                            onSaveSuccess={async () => {
                                await getUsers();
                            }}
                        />
                    )}
                </Stack>
            </CustomToolbar>
            <Container sx={{ width: '100%', maxWidth: '100%', minWidth: '100%' }}>
                <Box sx={{ width: '100%', minWidth: '100%', m: '15px 0px 0px 0px' }}>
                    <Paper sx={{ width: 'calc(100% - 15px)', mb: 2, p: '15px 15px 15px 15px', borderRadius: '16px' }}>
                        <TableContainer sx={{ borderRadius: '16px' }}>
                            <Table sx={{
                                "& .MuiTableCell-head": {
                                    color: "white",
                                    backgroundColor: "#6B778C",
                                }
                            }}>
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={activeUsers?.length}
                                    // rowCount={tab === 0 ? usersData.active_users_count : usersData.inactive_users_count}
                                    numSelectedId={selectedId}
                                    isSelectedId={isSelectedId}
                                    headCells={headCells}
                                />
                                {tab === 'active' ?
                                    <TableBody>
                                        {
                                            activeUsers?.length > 0
                                                ? stableSort(activeUsers, getComparator(order, orderBy)).map((item: any, index: any) => {
                                                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: any) => {
                                                    // const isItemSelected = isSelected(item?.user_details?.email,item)
                                                    const labelId = `enhanced-table-checkbox-${index}`
                                                    const rowIndex = selectedId.indexOf(item.id);
                                                    return (
                                                        <TableRow
                                                            tabIndex={-1}
                                                            key={index}
                                                            sx={{
                                                                border: 0,
                                                                '&:nth-of-type(even)': {
                                                                    backgroundColor: 'whitesmoke'
                                                                },
                                                                color: 'rgb(26, 51, 83)',
                                                                textTransform: 'capitalize'
                                                            }}
                                                        >
                                                            {/* <TableCell
                                                                    padding='checkbox'
                                                                    sx={{ border: 0, color: 'inherit' }}
                                                                    align='left'
                                                                >
                                                                    <Checkbox
                                                                        checked={isSelectedId[rowIndex] || false}
                                                                        onChange={() => handleRowSelect(item.id)}
                                                                        inputProps={{
                                                                            'aria-labelledby': labelId,
                                                                        }}
                                                                        sx={{border: 0,color: 'inherit'}}
                                                                    />
                                                                </TableCell> */}
                                                            {/* <TableCell
                                                            align='left'
                                                            sx={{ border: 0, color: 'rgb(26, 51, 83)' }}
                                                        >
                                                            {item.user_details.first_name ? item.user_details.first_name : '--'}
                                                        </TableCell>
                                                        <TableCell align='left' sx={{ border: 0, color: 'rgb(26, 51, 83)' }}>
                                                            {item.user_details.last_name ? item.user_details.last_name : '---'}
                                                        </TableCell> */}
                                                            <TableCell
                                                                className='tableCell-link'
                                                                onClick={() => userDetail(item.id)}
                                                            >
                                                                {item?.user_details?.first_name ? item.user_details.first_name : '---'}
                                                            </TableCell>
                                                            <TableCell
                                                                className='tableCell-link'
                                                                onClick={() => userDetail(item.id)}
                                                            >
                                                                {item?.user_details?.last_name ? item.user_details.last_name : '---'}
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                <div style={{ display: 'flex' }}>
                                                                    {item?.phone ? item.phone : '---'}
                                                                </div>
                                                            </TableCell>

                                                            <TableCell className='tableCell'>
                                                                {item?.role ? roleDisplayMap[item.role] : '---'}
                                                            </TableCell>
                                                            {/* <TableCell
                                                            align='left'
                                                            sx={{ border: 0, color: 'rgb(26, 51, 83)' }}
                                                        >
                                                            {item.user_type ? item.user_type : '---'}
                                                        </TableCell> */}
                                                            <TableCell className='tableCell'>
                                                                <div style={
                                                                    item?.user_details?.is_active === true
                                                                        ? activeStyle
                                                                        : item?.user_details?.is_active === false
                                                                            ? inactiveStyle
                                                                            : defaultStyle
                                                                }>
                                                                    {item?.user_details?.is_active === true ? 'ACTIVE' : item?.user_details?.is_active === false ? 'INACTIVE' : '---'}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                {(userRole === 'ADMIN' || item?.user_details?.id === userId) && (
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
                                                                    <IconButton>
                                                                        <FaTrashAlt onClick={() => deleteRow(item.id)} style={{ fill: '#1A3353', cursor: 'pointer', width: '15px' }} />
                                                                    </IconButton>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                                : <TableRow> <TableCell colSpan={8} sx={{ border: 0 }}><Spinner /></TableCell> </TableRow>
                                        }
                                    </TableBody> :
                                    <TableBody>
                                        {
                                            inactiveUsers?.length > 0
                                                ? stableSort(inactiveUsers, getComparator(order, orderBy)).map((item: any, index: any) => {
                                                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item: any, index: any) => {
                                                    // const isItemSelected = isSelected(item?.user_details?.email,item)
                                                    const labelId = `enhanced-table-checkbox-${index}`
                                                    const rowIndex = selectedId.indexOf(item.id);
                                                    return (
                                                        <TableRow
                                                            tabIndex={-1}
                                                            key={index}
                                                            sx={{
                                                                border: 0,
                                                                '&:nth-of-type(even)': {
                                                                    backgroundColor: 'whitesmoke'
                                                                },
                                                                color: 'rgb(26, 51, 83)',
                                                                textTransform: 'capitalize'
                                                            }}
                                                        >
                                                            {/* <TableCell
                                                                    padding='checkbox'
                                                                    sx={{ border: 0, color: 'inherit' }}
                                                                    align='left'
                                                                >
                                                                    <Checkbox
                                                                        checked={isSelectedId[rowIndex] || false}
                                                                        onChange={() => handleRowSelect(item.id)}
                                                                        inputProps={{
                                                                            'aria-labelledby': labelId,
                                                                        }}
                                                                        sx={{border: 0,color: 'inherit'}}
                                                                    />
                                                                </TableCell> */}
                                                            {/* <TableCell
                                                            align='left'
                                                            sx={{ border: 0, color: 'rgb(26, 51, 83)' }}
                                                        >
                                                            {item.user_details.first_name ? item.user_details.first_name : '--'}
                                                        </TableCell>
                                                        <TableCell align='left' sx={{ border: 0, color: 'rgb(26, 51, 83)' }}>
                                                            {item.user_details.last_name ? item.user_details.last_name : '---'}
                                                        </TableCell> */}
                                                            <TableCell
                                                                className='tableCell-link'
                                                                onClick={() => userDetail(item.id)}
                                                            >
                                                                {item?.user_details?.email ? item.user_details.email : '---'}
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                <div style={{ display: 'flex' }}>
                                                                    {item?.phone ? item.phone : '---'}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className='tableCell'>
                                                                {item?.role ? item.role : '---'}
                                                            </TableCell>
                                                            {/* <TableCell
                                                            align='left'
                                                            sx={{ border: 0, color: 'rgb(26, 51, 83)' }}
                                                        >
                                                            {item.user_type ? item.user_type : '---'}
                                                        </TableCell> */}
                                                            <TableCell className='tableCell'>
                                                                <IconButton>
                                                                    <FaEdit
                                                                        onClick={() => EditItem(item.id)}
                                                                        style={{ fill: '#1A3353', cursor: 'pointer', width: '18px' }}
                                                                    />
                                                                    {/* <FaAd
                                                                    onClick={() => EditItemBox(item)}
                                                                    style={{ fill: '#1A3353', cursor: 'pointer' }}
                                                                /> */}
                                                                </IconButton>
                                                                <IconButton>
                                                                    <FaTrashAlt onClick={() => deleteRow(item?.id)} style={{ fill: '#1A3353', cursor: 'pointer', width: '15px' }} />
                                                                    {/* <FaAd onClick={() => deleteItemBox(item)} style={{ fill: '#1A3353', cursor: 'pointer' }} /> */}
                                                                </IconButton>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                                : <TableRow> <TableCell colSpan={8} sx={{ border: 0 }}><Spinner /></TableCell> </TableRow>
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
                DeleteItem={DeleteItem}
            />
        </Box>
    )
}

