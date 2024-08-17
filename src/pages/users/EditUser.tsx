import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    TextField,
    AccordionDetails,
    Accordion,
    AccordionSummary,
    Typography,
    Box,
    TextareaAutosize,
    MenuItem,
    Tooltip,
    Button,
    Input,
    Avatar,
    IconButton,
    Stack,
    Divider,
    Select,
    FormControl,
    FormHelperText
} from '@mui/material'
import { UserUrl } from '../../services/ApiUrls'
import { fetchData } from '../../components/FetchData'
import { CustomAppBar } from '../../components/CustomAppBar'
import { FaArrowDown, FaTimes, FaUpload } from 'react-icons/fa'
import { AntSwitch, RequiredTextField } from '../../styles/CssStyled'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
import '../../styles/style.css'

type FormErrors = {
    email?: string[];
    role?: string[];
    phone?: string[];
    alternate_phone?: string[];
    address_line?: string[];
    street?: string[];
    city?: string[];
    state?: string[];
    pincode?: string[];
    country?: string[];
    // profile_pic?: string[];
    // has_sales_access?: string[];
    // has_marketing_access?: string[];
    // is_organization_admin?: string[];
};
interface FormData {
    email: string,
    role: string,
    phone: string,
    alternate_phone: string,
    address_line: string,
    street: string,
    city: string,
    state: string,
    pincode: string,
    country: string,
    // profile_pic: string | null,
    // has_sales_access: boolean,
    // has_marketing_access: boolean,
    // is_organization_admin: boolean
}

const roleOptions = [
    { label: 'ADMIN', value: 'ADMIN' },
    { label: 'SALES MANAGER', value: 'SALES MANAGER' },
    { label: 'SALES REPRESENTATIVE', value: 'SALES REP' },
    { label: 'USER', value: 'USER' }
];

export function EditUser() {
    const { state } = useLocation()
    const navigate = useNavigate()

    const [reset, setReset] = useState(false)
    const [error, setError] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({});
    const [profileErrors, setProfileErrors] = useState<FormErrors>({});
    const [userErrors, setUserErrors] = useState<FormErrors>({});
    const [roleSelectOpen, setRoleSelectOpen] = useState(false)
    const [countrySelectOpen, setCountrySelectOpen] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        email: '',
        role: 'ADMIN',
        phone: '',
        alternate_phone: '',
        address_line: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        // profile_pic: null,
        // has_sales_access: false,
        // has_marketing_access: false,
        // is_organization_admin: false

    })
    useEffect(() => {
        setFormData(state?.value)
    }, [state?.id])


    useEffect(() => {
        if (reset) {
            setFormData(state?.value)
        }
        return () => {
            setReset(false)
        }
    }, [reset])

    const handleChange = (e: any) => {
        const { name, value, files, type, checked } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: e.target.files?.[0] || null });
        }
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const backbtnHandle = () => {
        if (state?.edit) {
            navigate('/app/users')
        } else {
            navigate('/app/users/user-details', { state: { userId: state?.id, detail: true } })
        }
    }
    const handleSubmit = (e: any) => {
        e.preventDefault();
        submitForm();
    }

    // const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0] || null;
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             setFormData({ ...formData, profile_pic: reader.result as string });
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };


    // const getEditDetail = (id: any) => {
    //     fetchData(`${UserUrl}/${id}/`, 'GET', null as any, headers)
    //         .then((res: any) => {
    //             console.log('edit detail Form data:', res);
    //             if (!res.error) {
    //                 const data = res?.data?.profile_obj
    //                 setFormData({
    //                     email: data?.user_details?.email || '',
    //                     role: data.role || 'ADMIN',
    //                     phone: data.phone || '',
    //                     alternate_phone: data.alternate_phone || '',
    //                     address_line: data?.address?.address_line || '',
    //                     street: data?.address?.street || '',
    //                     city: data?.address?.city || '',
    //                     state: data?.address?.state || '',
    //                     pincode: data?.address?.pincode || '',
    //                     country: data?.address?.country || '',
    //                     profile_pic: data?.user_details?.profile_pic || null,
    //                     has_sales_access: data.has_sales_access || false,
    //                     has_marketing_access: data.has_marketing_access || false,
    //                     is_organization_admin: data.is_organization_admin || false
    //                 })
    //             }
    //             if (res.error) {
    //                 setError(true)
    //             }
    //         })
    //         .catch(() => {
    //         })
    // }
    const submitForm = () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org')
          }
        // console.log('Form data:', data);
        const data = {
            email: formData.email,
            role: formData.role,
            phone: formData.phone,
            alternate_phone: formData.alternate_phone,
            address_line: formData.address_line,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country,
            // profile_pic: formData.profile_pic,
            // has_sales_access: formData.has_sales_access,
            // has_marketing_access: formData.has_marketing_access,
            // is_organization_admin: formData.is_organization_admin
        }

        fetchData(`${UserUrl}/${state?.id}/`, 'PUT', JSON.stringify(data), Header)
            .then((res: any) => {
                // console.log('editsubmit:', res);
                if (!res.error) {
                    resetForm()
                    navigate('/app/users')
                }
                if (res.error) {
                    setError(true)
                    setProfileErrors(res?.errors?.profile_errors || res?.profile_errors[0])
                    setUserErrors(res?.errors?.user_errors || res?.user_errors[0])
                }
            })
            .catch(() => {
            })
    };
    const resetForm = () => {
        setFormData({
            email: '',
            role: 'ADMIN',
            phone: '',
            alternate_phone: '',
            address_line: '',
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: ''
            // profile_pic: null,
            // has_sales_access: false,
            // has_marketing_access: false,
            // is_organization_admin: false
        });
        setProfileErrors({})
        setUserErrors({})
    }
    const onCancel = () => {
        setReset(true)
        // resetForm()
    }
    const module = 'Users'
    const crntPage = 'Edit User'
    const backBtn = state?.edit ? 'Back To Users' : 'Back To UserDetails'

    const inputStyles = {
        display: 'none',
    };
    // console.log(state, 'edit',profileErrors)
    // console.log(formData, 'as', state?.value);
    return (
        <Box sx={{ mt: '60px' }}>
            <CustomAppBar backbtnHandle={backbtnHandle} module={module} backBtn={backBtn} crntPage={crntPage} onCancel={onCancel} onSubmit={handleSubmit} />
            <Box sx={{ mt: "120px" }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ padding: '10px' }}>
                        <div className='leadContainer'>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                    <Typography className='accordion-header'>User Information</Typography>
                                </AccordionSummary>
                                <Divider className='divider' />
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div className='fieldContainer'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Email</div>
                                                <RequiredTextField
                                                    required
                                                    name='email'
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    error={!!profileErrors?.email?.[0] || !!userErrors?.email?.[0]}
                                                    helperText={profileErrors?.email?.[0] || userErrors?.email?.[0] || ''}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Role</div>
                                                <FormControl sx={{ width: '70%' }}>
                                                <Select
                name='role'
                value={formData.role}
                open={roleSelectOpen}
                onClick={() => setRoleSelectOpen(!roleSelectOpen)}
                IconComponent={() => (
                    <div onClick={() => setRoleSelectOpen(!roleSelectOpen)} className="select-icon-background">
                        {roleSelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                    </div>
                )}
                className={'select'}
                onChange={handleChange}
                error={!!errors?.role?.[0]}
            >
                {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Phone Number</div>
                                                <Tooltip title="Number must starts with +91">
                                                    <RequiredTextField
                                                        name='phone'
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        required
                                                        style={{ width: '70%' }}
                                                        size='small'
                                                        error={!!profileErrors?.phone?.[0] || !!userErrors?.phone?.[0]}
                                                        helperText={profileErrors?.phone?.[0] || userErrors?.phone?.[0] || ''}
                                                    />
                                                </Tooltip>
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Alternate Phone</div>
                                                <Tooltip title="Number must starts with +91">
                                                    <RequiredTextField
                                                        required
                                                        name='alternate_phone'
                                                        value={formData.alternate_phone}
                                                        onChange={handleChange}
                                                        style={{ width: '70%' }}
                                                        size='small'
                                                        error={!!profileErrors?.alternate_phone?.[0] || !!userErrors?.alternate_phone?.[0]}
                                                        helperText={profileErrors?.alternate_phone?.[0] || userErrors?.alternate_phone?.[0] || ''}
                                                    />
                                                </Tooltip>
                                            </div>
                                        </div>
                                        {/* <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Profile picture</div>
                                                <Stack sx={{ display: 'flex', flexDirection: 'column' }}>
                                                    <Stack sx={{ display: 'flex', flexDirection: 'row' }}>
                                                        <label htmlFor="avatar-input">
                                                            <input
                                                                id="avatar-input"
                                                                name="profile_pic"
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={(e: any) => {
                                                                    handleFileChange(e);
                                                                    handleChange(e);
                                                                }}
                                                                style={inputStyles}
                                                            />
                                                            <IconButton
                                                                component="span"
                                                                color="primary"
                                                                aria-label="upload avatar"
                                                            >
                                                                <FaUpload fill='lightgrey' />
                                                            </IconButton>
                                                        </label>
                                                        <Box>  {formData.profile_pic !== null ?
                                                            <Box sx={{ position: 'relative' }}>
                                                                <Avatar src={formData.profile_pic || ''} />
                                                                <FaTimes style={{ position: 'absolute', marginTop: '-45px', marginLeft: '25px', fill: 'lightgray', cursor: 'pointer' }}
                                                                    onClick={() => setFormData({ ...formData, profile_pic: null })} />
                                                            </Box> : ''}
                                                        </Box>
                                                        {formData.profile_pic && <Typography sx={{ color: '#d32f2f', fontSize: '12px', ml: '-70px', mt: '40px' }}>{profileErrors?.profile_pic?.[0] || userErrors?.profile_pic?.[0] || ''}</Typography>}
                                                    </Stack>
                                                </Stack>


                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Sales Access</div>
                                                <AntSwitch
                                                    name='has_sales_access'
                                                    checked={formData.has_sales_access}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Marketing Access</div>
                                                <AntSwitch
                                                    name='has_marketing_access'
                                                    checked={formData.has_marketing_access}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Organization Admin</div>
                                                <AntSwitch
                                                    name='is_organization_admin'
                                                    checked={formData.is_organization_admin}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div> */}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        {/* Address Details */}
                        <div className='leadContainer'>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                    <Typography className='accordion-header'>Address</Typography>
                                </AccordionSummary>
                                <Divider className='divider' />
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353', mb: 1 }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div className='fieldContainer'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Address Lane</div>
                                                <TextField
                                                    required
                                                    name='address_line'
                                                    value={formData.address_line}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    error={!!profileErrors?.address_line?.[0] || !!userErrors?.address_line?.[0]}
                                                    helperText={profileErrors?.address_line?.[0] || userErrors?.address_line?.[0] || ''}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Street</div>
                                                <TextField
                                                    required
                                                    name='street'
                                                    value={formData.street}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    error={!!profileErrors?.street?.[0] || !!userErrors?.street?.[0]}
                                                    helperText={profileErrors?.street?.[0] || userErrors?.street?.[0] || ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>City</div>
                                                <TextField
                                                    required
                                                    name='city'
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    error={!!profileErrors?.city?.[0] || !!userErrors?.city?.[0]}
                                                    helperText={profileErrors?.city?.[0] || userErrors?.city?.[0] || ''}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>State</div>
                                                <TextField
                                                    required
                                                    name='state'
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    error={!!profileErrors?.state?.[0] || !!userErrors?.state?.[0]}
                                                    helperText={profileErrors?.state?.[0] || userErrors?.state?.[0] || ''}
                                                />
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Pincode</div>
                                                <TextField
                                                    required
                                                    name='pincode'
                                                    value={formData.pincode}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    error={!!profileErrors?.pincode?.[0] || !!userErrors?.pincode?.[0]}
                                                    helperText={profileErrors?.pincode?.[0] || userErrors?.pincode?.[0] || ''}
                                                />
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Country</div>
                                                <FormControl sx={{ width: '70%' }}>
                                                    <Select
                                                        name='country'
                                                        value={formData.country}
                                                        open={countrySelectOpen}
                                                        onClick={() => setCountrySelectOpen(!countrySelectOpen)}
                                                        IconComponent={() => (
                                                            <div onClick={() => setCountrySelectOpen(!countrySelectOpen)} className="select-icon-background">
                                                                {countrySelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                                                            </div>
                                                        )}
                                                        className={'select'}
                                                        onChange={handleChange}
                                                        error={!!profileErrors?.country?.[0]}
                                                    >
                                                        {state?.countries?.length && state?.countries.map((option: any) => (
                                                            <MenuItem key={option[0]} value={option[0]}>
                                                                {option[1]}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>{profileErrors?.country?.[0] ? profileErrors?.country?.[0] : ''}</FormHelperText>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        {/* Business Hours */}
                        {/* <div className='leadContainer'>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary
                                    expandIcon={<FaArrowDown />}
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
                                >
                                    <div className='typography'>
                                        <Typography
                                            style={{ marginBottom: '15px', fontWeight: 'bold' }}
                                        >
                                            Business Hours
                                        </Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353' }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div>
                                            <div className='fieldSubContainer' style={{ marginLeft: '4.8%' }}>
                                                <div className='fieldTitle'>Business Hours</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                    {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))} 
                                                </TextField>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div> */}
                        {/* Preferences */}
                        {/* <div className='leadContainer'>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary
                                    expandIcon={<FaArrowDown />}
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
                                >
                                    <div className='typography'>
                                        <Typography
                                            style={{ marginBottom: '15px', fontWeight: 'bold' }}
                                        >
                                            Preferences
                                        </Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '98%', color: '#1A3353' }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div className='fieldContainer'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Default Page After Login</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                    {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))} 
                                                </TextField>
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Persone Name Format</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                    {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))} 
                                                </TextField>
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Prefferred Currency</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                     {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))} 
                                                </TextField>
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Digit Grouping Pattern</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                    {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))} 
                                                </TextField>
                                            </div>
                                        </div>
                                        <div className='fieldContainer2'>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Digit Grouping Seperator</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                     {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))} 
                                                </TextField>
                                            </div>
                                            <div className='fieldSubContainer'>
                                                <div className='fieldTitle'>Number of Currency Decimals</div>
                                                <TextField
                                                    name='lead_source'
                                                    select
                                                    // onChange={onChange}
                                                    // InputProps={{
                                                    //     classes: {
                                                    //         root: textFieldClasses.root
                                                    //     }
                                                    // }}
                                                    className="custom-textfield"
                                                    style={{ width: '70%' }}
                                                >
                                                 {state.roles && state.roles.map((option) => (
                          <MenuItem key={option[1]} value={option[0]}>
                            {option[0]}
                          </MenuItem>
                        ))} 
                                                </TextField>
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div> */}
                        {/* Signature Block */}
                        {/* <div className='leadContainer'>
                            <Accordion defaultExpanded style={{ width: '98%' }}>
                                <AccordionSummary
                                    expandIcon={<FaArrowDown />}
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
                                >
                                    <div className='typography'>
                                        <Typography style={{ marginBottom: '15px', fontWeight: 'bold' }}>Signature Block</Typography>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box
                                        sx={{ width: '100%', color: '#1A3353' }}
                                        component='form'
                                        noValidate
                                        autoComplete='off'
                                    >
                                        <div className='DescriptionDetail'>
                                            <div className='descriptionSubContainer'>
                                                <div className='descriptionTitle'>Signature</div>
                                                <TextareaAutosize
                                                    aria-label='minimum height'
                                                    name='description'
                                                    minRows={8}
                                                    // defaultValue={state.editData && state.editData.description ? state.editData.description : ''}
                                                    // onChange={onChange} 
                                                    style={{ width: '70%', padding: '5px' }}
                                                    placeholder='Add Description'
                                                />
                                            </div>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </div> */}
                    </div>
                </form>
            </Box>
        </Box>
    )
}
