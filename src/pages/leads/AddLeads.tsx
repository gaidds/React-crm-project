import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  TextField,
  FormControl,
  TextareaAutosize,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  Typography,
  Box,
  MenuItem,
  InputAdornment,
  Chip,
  Autocomplete,
  FormHelperText,
  IconButton,
  Tooltip,
  Divider,
  Select,
  Button
} from '@mui/material'
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';
import '../../styles/style.css'
import { LeadUrl } from '../../services/ApiUrls'
import { fetchData } from '../../components/FetchData'
import { CustomAppBar } from '../../components/CustomAppBar'
import { FaArrowDown, FaCheckCircle, FaFileUpload, FaPalette, FaPercent, FaPlus, FaTimes, FaTimesCircle, FaUpload } from 'react-icons/fa'
import { useForm } from '../../components/UseForm'
import { CustomPopupIcon, CustomSelectField, RequiredTextField, StyledSelect } from '../../styles/CssStyled'
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'

// const useStyles = makeStyles({
//   btnIcon: {
//     height: '14px',
//     color: '#5B5C63'
//   },
//   breadcrumbs: {
//     color: 'white'
//   },
//   fields: {
//     height: '5px'
//   },
//   chipStyle: {
//     backgroundColor: 'red'
//   },
//   icon: {
//     '&.MuiChip-deleteIcon': {
//       color: 'darkgray'
//     }
//   }
// })

// const textFieldStyled = makeStyles(() => ({
//   root: {
//     borderLeft: '2px solid red',
//     height: '35px'
//   },
//   fieldHeight: {
//     height: '35px'
//   }
// }))

// function getStyles (name, personName, theme) {
//   return {
//     fontWeight:
//       theme.typography.fontWeightRegular
//   }
// }

type FormErrors = {
  title?: string[],
  first_name?: string[],
  last_name?: string[],
  account_name?: string[],
  phone?: string[],
  email?: string[],
  lead_attachment?: string[],
  opportunity_amount?: string[],
  website?: string[],
  description?: string[],
  teams?: string[],
  assigned_to?: string[],
  contacts?: string[],
  status?: string[],
  source?: string[],
  address_line?: string[],
  street?: string[],
  city?: string[],
  state?: string[],
  postcode?: string[],
  country?: string[],
  tags?: string[],
  company?: string[],
  probability?: number[],
  industry?: string[],
  skype_ID?: string[],
  file?: string[],
};
interface FormData {
  title: string,
  first_name: string,
  last_name: string,
  account_name: string,
  phone: string,
  email: string,
  lead_attachment: string | null,
  opportunity_amount: string,
  website: string,
  description: string,
  teams: string,
  assigned_to: string[],
  contacts: string[],
  status: string,
  source: string,
  address_line: string,
  street: string,
  city: string,
  state: string,
  postcode: string,
  country: string,
  tags: string[],
  company: string,
  probability: number,
  industry: string,
  skype_ID: string,
  file: string | null
}

export function AddLeads() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { quill, quillRef } = useQuill();
  const initialContentRef = useRef(null);

  const autocompleteRef = useRef<any>(null);
  const [error, setError] = useState(false)
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [selectedAssignTo, setSelectedAssignTo] = useState<any[]>([]);
  const [selectedTags, setSelectedTags] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any[]>([]);
  const [sourceSelectOpen, setSourceSelectOpen] = useState(false)
  const [statusSelectOpen, setStatusSelectOpen] = useState(false)
  const [countrySelectOpen, setCountrySelectOpen] = useState(false)
  const [industrySelectOpen, setIndustrySelectOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    title: '',
    first_name: '',
    last_name: '',
    account_name: '',
    phone: '',
    email: '',
    lead_attachment: null,
    opportunity_amount: '',
    website: '',
    description: '',
    teams: '',
    assigned_to: [],
    contacts: [],
    status: 'assigned',
    source: 'call',
    address_line: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    tags: [],
    company: '',
    probability: 1,
    industry: 'ADVERTISING',
    skype_ID: '',
    file: null
  })

  useEffect(() => {
    if (quill) {
      // Save the initial state (HTML content) of the Quill editor
      initialContentRef.current = quillRef.current.firstChild.innerHTML;
    }
  }, [quill]);

  const handleChange2 = (title: any, val: any) => {
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // console.log('nd', val)
    if (title === 'contacts') {
      setFormData({ ...formData, contacts: val.length > 0 ? val.map((item: any) => item.id) : [] });
      setSelectedContacts(val);
    } else if (title === 'assigned_to') {
      setFormData({ ...formData, assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [] });
      setSelectedAssignTo(val);
    } else if (title === 'tags') {
      setFormData({ ...formData, assigned_to: val.length > 0 ? val.map((item: any) => item.id) : [] });
      setSelectedTags(val);
    }
    // else if (title === 'country') {
    //   setFormData({ ...formData, country: val || [] })
    //   setSelectedCountry(val);
    // }
    else {
      setFormData({ ...formData, [title]: val })
    }
  }

  const handleChange = (e: any) => {
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // console.log('e.target',e)
    const { name, value, files, type, checked, id } = e.target;
    // console.log('auto', val)
    if (type === 'file') {
      setFormData({ ...formData, [name]: e.target.files?.[0] || null });
    }
    else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // setFormData({ ...formData, lead_attachment: reader.result as string });
        setFormData({ ...formData, file: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetQuillToInitialState = () => {
    // Reset the Quill editor to its initial state
    setFormData({ ...formData, description: '' })
    if (quill && initialContentRef.current !== null) {
      quill.clipboard.dangerouslyPasteHTML(initialContentRef.current);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    submitForm();
  }
  
  const submitForm = () => {
    // console.log('Form data:', formData.lead_attachment,'sfs', formData.file);
    const data = {
      title: formData.title,
      first_name: formData.first_name,
      last_name: formData.last_name,
      account_name: formData.account_name,
      phone: formData.phone,
      email: formData.email,
      // lead_attachment: formData.lead_attachment,
      lead_attachment: formData.file,
      opportunity_amount: formData.opportunity_amount,
      website: formData.website,
      description: formData.description,
      teams: formData.teams,
      assigned_to: formData.assigned_to,
      contacts: formData.contacts,
      status: formData.status,
      source: formData.source,
      address_line: formData.address_line,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      postcode: formData.postcode,
      country: formData.country,
      tags: formData.tags,
      company: formData.company,
      probability: formData.probability,
      industry: formData.industry,
      skype_ID: formData.skype_ID
    }

    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org')
    }

    fetchData(`${LeadUrl}/`, 'POST', JSON.stringify(data), Header)
      .then((res: any) => {
        console.log('Request URL:',  JSON.stringify(data));
        console.log('header', Header);
        // console.log('Form data:', res);
        if (!res.error) {
          resetForm()
          navigate('/app/leads')
        }
        if (res.error) {
          setError(true)
          setErrors(res?.errors)
        }
      })
      .catch(() => {
      })
  };

  const resetForm = () => {
    setFormData({
      title: '',
      first_name: '',
      last_name: '',
      account_name: '',
      phone: '',
      email: '',
      lead_attachment: null,
      opportunity_amount: '',
      website: '',
      description: '',
      teams: '',
      assigned_to: [],
      contacts: [],
      status: 'assigned',
      source: 'call',
      address_line: '',
      street: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      tags: [],
      company: '',
      probability: 1,
      industry: 'ADVERTISING',
      skype_ID: '',
      file: null
    });
    setErrors({})
    setSelectedContacts([]);
    setSelectedAssignTo([])
    setSelectedTags([])
    // setSelectedCountry([])
    // if (autocompleteRef.current) {
    //   console.log(autocompleteRef.current,'ccc')
    //   autocompleteRef.current.defaultValue([]);
    // }
  }
  const onCancel = () => {
    resetForm()
  }

  const backbtnHandle = () => {
    navigate('/app/leads')
  }

  const module = 'Leads'
  const crntPage = 'Add Leads'
  const backBtn = 'Back To Leads'

  console.log(state, 'state')
  console.log(formData, 'form data')
  return (
    <Box sx={{ mt: '60px' }}>
      <CustomAppBar backbtnHandle={backbtnHandle} module={module} backBtn={backBtn} crntPage={crntPage} onCancel={onCancel} onSubmit={handleSubmit} />
      <Box sx={{ mt: "120px" }}>
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '10px' }}>
            <div className='leadContainer'>
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                  <Typography className='accordion-header'>Lead Information</Typography>
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
                        <div className='fieldTitle'>Lead Name</div>
                        <TextField
                          name='account_name'
                          value={formData.account_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.account_name?.[0] ? errors?.account_name[0] : ''}
                          error={!!errors?.account_name?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Amount</div>
                        <TextField
                          type={'number'}
                          name='opportunity_amount'
                          value={formData.opportunity_amount}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.opportunity_amount?.[0] ? errors?.opportunity_amount[0] : ''}
                          error={!!errors?.opportunity_amount?.[0]}
                        />
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Website</div>
                        <TextField
                          name='website'
                          value={formData.website}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.website?.[0] ? errors?.website[0] : ''}
                          error={!!errors?.website?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Contact Name</div>
                        <FormControl error={!!errors?.contacts?.[0]} sx={{ width: '70%' }}>
                          <Autocomplete
                            // ref={autocompleteRef}
                            multiple
                            value={selectedContacts}
                            limitTags={2}
                            options={state?.contacts || []}
                            // options={state.contacts ? state.contacts.map((option: any) => option) : ['']}
                            getOptionLabel={(option: any) => state?.contacts ? option?.first_name : option}
                            // value={formData.contacts}
                            // onChange={handleChange}
                            onChange={(e: any, value: any) => handleChange2('contacts', value)}
                            // style={{ width: '80%' }}
                            size='small'
                            filterSelectedOptions
                            renderTags={(value: any, getTagProps: any) =>
                              value.map((option: any, index: any) => (
                                <Chip
                                  deleteIcon={<FaTimes style={{ width: '9px' }} />}
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px'
                                  }}
                                  variant='outlined'
                                  label={state?.contacts ? option?.first_name : option}
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={<CustomPopupIcon><FaPlus className='input-plus-icon' /></CustomPopupIcon>}
                            renderInput={(params: any) => (
                              <TextField {...params}
                                placeholder='Add Contacts'
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-popupIndicator': { '&:hover': { backgroundColor: 'white' } },
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-8px',
                                      mr: '-8px',
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                          <FormHelperText>{errors?.contacts?.[0] || ''}</FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Assign To</div>
                        <FormControl error={!!errors?.assigned_to?.[0]} sx={{ width: '70%' }}>
                          <Autocomplete
                            multiple
                            value={selectedAssignTo}
                            limitTags={2}
                            options={state?.users || []}
                            getOptionLabel={(option: any) => state?.users ? option?.user__email : option}
                            onChange={(e: any, value: any) => handleChange2('assigned_to', value)}
                            size='small'
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  deleteIcon={<FaTimes style={{ width: '9px' }} />}
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px'

                                  }}
                                  variant='outlined'
                                  label={state?.users ? option?.user__email : option}
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={<CustomPopupIcon><FaPlus className='input-plus-icon' /></CustomPopupIcon>}
                            renderInput={(params) => (
                              <TextField {...params}
                                placeholder='Add Users'
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-popupIndicator': { '&:hover': { backgroundColor: 'white' } },
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-8px',
                                      mr: '-8px',
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                          <FormHelperText>{errors?.assigned_to?.[0] || ''}</FormHelperText>
                        </FormControl>
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Industry</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name='industry'
                            value={formData.industry}
                            open={industrySelectOpen}
                            onClick={() => setIndustrySelectOpen(!industrySelectOpen)}
                            IconComponent={() => (
                              <div onClick={() => setIndustrySelectOpen(!industrySelectOpen)} className="select-icon-background">
                                {industrySelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.industry?.[0]}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  height: '200px'
                                }
                              }
                            }}
                          >
                            {state?.industries?.length ? state?.industries.map((option: any) => (
                              <MenuItem key={option[0]} value={option[1]}>
                                {option[1]}
                              </MenuItem>
                            )) : ''}
                          </Select>
                          <FormHelperText>{errors?.industry?.[0] ? errors?.industry[0] : ''}</FormHelperText>
                        </FormControl>
                        {/* <CustomSelectField
                          name='industry'
                          select
                          value={formData.industry}
                          InputProps={{
                            style: {
                              height: '40px',
                              maxHeight: '40px'
                            }
                          }}
                          onChange={handleChange}
                          sx={{ width: '70%' }}
                          helperText={errors?.industry?.[0] ? errors?.industry[0] : ''}
                          error={!!errors?.industry?.[0]}
                        >
                          {state?.industries?.length && state?.industries.map((option: any) => (
                            <MenuItem key={option[0]} value={option[1]}>
                              {option[1]}
                            </MenuItem>
                          ))}
                        </CustomSelectField> */}
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Status</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name='status'
                            value={formData.status}
                            open={statusSelectOpen}
                            onClick={() => setStatusSelectOpen(!statusSelectOpen)}
                            IconComponent={() => (
                              <div onClick={() => setStatusSelectOpen(!statusSelectOpen)} className="select-icon-background">
                                {statusSelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.status?.[0]}
                          >
                            {state?.status?.length ? state?.status.map((option: any) => (
                              <MenuItem key={option[0]} value={option[1]}>
                                {option[1]}
                              </MenuItem>
                            )) : ''}
                          </Select>
                          <FormHelperText>{errors?.status?.[0] ? errors?.status[0] : ''}</FormHelperText>
                        </FormControl>
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>SkypeID</div>
                        <TextField
                          name='skype_ID'
                          value={formData.skype_ID}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.skype_ID?.[0] ? errors?.skype_ID[0] : ''}
                          error={!!errors?.skype_ID?.[0]}
                        />
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Lead Source</div>
                        <FormControl sx={{ width: '70%' }}>
                          <Select
                            name='source'
                            value={formData.source}
                            open={sourceSelectOpen}
                            onClick={() => setSourceSelectOpen(!sourceSelectOpen)}
                            IconComponent={() => (
                              <div onClick={() => setSourceSelectOpen(!sourceSelectOpen)} className="select-icon-background">
                                {sourceSelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
                              </div>
                            )}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.source?.[0]}
                          >
                            {state?.source?.length ? state?.source.map((option: any) => (
                              <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                              </MenuItem>
                            )) : ''}
                          </Select>
                          <FormHelperText>{errors?.source?.[0] ? errors?.source[0] : ''}</FormHelperText>
                        </FormControl>
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Lead Attachment</div>
                        <TextField
                          name='lead_attachment'
                          value={formData.lead_attachment}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton disableFocusRipple
                                  disableTouchRipple
                                  sx={{ width: '40px', height: '40px', backgroundColor: 'whitesmoke', borderRadius: '0px', mr: '-13px', cursor: 'pointer' }}
                                >
                                  <label htmlFor='icon-button-file'>
                                    <input
                                      hidden
                                      accept='image/*'
                                      id='icon-button-file'
                                      type='file'
                                      name='account_attachment'
                                      onChange={(e: any) => {
                                        //  handleChange(e); 
                                        handleFileChange(e)
                                      }}
                                    />
                                    <FaUpload color='primary' style={{ fontSize: '15px', cursor: 'pointer' }} />
                                  </label>
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                          sx={{ width: '70%' }}
                          size='small'
                          helperText={errors?.lead_attachment?.[0] ? errors?.lead_attachment[0] : ''}
                          error={!!errors?.lead_attachment?.[0]}
                        />
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Tags</div>
                        <FormControl error={!!errors?.tags?.[0]} sx={{ width: '70%' }}>
                          <Autocomplete
                            // ref={autocompleteRef}
                            value={selectedTags}
                            multiple
                            limitTags={5}
                            options={state?.tags || []}
                            // options={state.contacts ? state.contacts.map((option: any) => option) : ['']}
                            getOptionLabel={(option: any) => option}
                            onChange={(e: any, value: any) => handleChange2('tags', value)}
                            size='small'
                            filterSelectedOptions
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  deleteIcon={<FaTimes style={{ width: '9px' }} />}
                                  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.08)', height: '18px' }}
                                  variant='outlined'
                                  label={option}
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={<CustomPopupIcon><FaPlus className='input-plus-icon' /></CustomPopupIcon>}
                            renderInput={(params) => (
                              <TextField {...params}
                                placeholder='Add Tags'
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-popupIndicator': { '&:hover': { backgroundColor: 'white' } },
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-8px',
                                      mr: '-8px',
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                          <FormHelperText>{errors?.tags?.[0] || ''}</FormHelperText>
                        </FormControl>
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Probability</div>
                        <TextField
                          name='probability'
                          value={formData.probability}
                          onChange={handleChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton disableFocusRipple disableTouchRipple
                                  sx={{ backgroundColor: '#d3d3d34a', width: '45px', borderRadius: '0px', mr: '-12px' }}>
                                  <FaPercent style={{ width: "12px" }} />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.probability?.[0] ? errors?.probability[0] : ''}
                          error={!!errors?.probability?.[0]}
                        />

                      </div>
                    </div>
                    {/* <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'> Close Date</div>
                        <TextField
                          name='account_name'
                          type='date'
                          value={formData.account_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.account_name?.[0] ? errors?.account_name[0] : ''}
                          error={!!errors?.account_name?.[0]}
                        />
                      </div>
                    </div> */}
                    {/* <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Pipeline</div>
                        <TextField
                          error={!!(msg === 'pipeline' || msg === 'required')}
                          name='pipeline'
                          id='outlined-error-helper-text'
                          // InputProps={{
                          //   classes: {
                          //     root: textFieldClasses.fieldHeight
                          //   }
                          // }}
                          onChange={onChange} style={{ width: '80%' }}
                          size='small'
                          helperText={
                            (error && msg === 'pipeline') || msg === 'required'
                              ? error
                              : ''
                          }
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Lost Reason </div>
                        <TextareaAutosize
                          aria-label='minimum height'
                          name='lost_reason'
                          minRows={2}
                          // onChange={onChange} 
                          style={{ width: '80%' }}
                        />
                      </div>
                    </div> */}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* contact details */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px' }}>
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                  <Typography className='accordion-header'>Contact</Typography>
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
                        <div className='fieldTitle'>First Name</div>
                        <RequiredTextField
                          name='first_name'
                          required
                          value={formData.first_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.first_name?.[0] ? errors?.first_name[0] : ''}
                          error={!!errors?.first_name?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Last Name</div>
                        <RequiredTextField
                          name='last_name'
                          required
                          value={formData.last_name}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.last_name?.[0] ? errors?.last_name[0] : ''}
                          error={!!errors?.last_name?.[0]}
                        />
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Job Title</div>
                        <RequiredTextField
                          name='title'
                          value={formData.title}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.title?.[0] ? errors?.title[0] : ''}
                          error={!!errors?.title?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Phone Number</div>
                        <Tooltip title="Number must starts with +91">
                          <TextField
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            style={{ width: '70%' }}
                            size='small'
                            helperText={errors?.phone?.[0] ? errors?.phone[0] : ''}
                            error={!!errors?.phone?.[0]}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className='fieldSubContainer' style={{ marginLeft: '5%', marginTop: '19px' }}>
                      <div className='fieldTitle'>Email Address</div>
                      {/* <div style={{ width: '40%', display: 'flex', flexDirection: 'row', marginTop: '19px', marginLeft: '6.6%' }}>
                      <div style={{ marginRight: '10px', fontSize: '13px', width: '22%', textAlign: 'right', fontWeight: 'bold' }}>Email Address</div> */}
                      <TextField
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '70%' }}
                        size='small'
                        helperText={errors?.email?.[0] ? errors?.email[0] : ''}
                        error={!!errors?.email?.[0]}
                      />
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* address details */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '20px' }}>
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
                        <div className='fieldTitle'
                        // style={{ marginRight: '10px', fontSize: '13px', width: '22%', textAlign: 'right', fontWeight: 'bold' }}
                        >Address Lane</div>
                        <TextField
                          name='address_line'
                          value={formData.address_line}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.address_line?.[0] ? errors?.address_line[0] : ''}
                          error={!!errors?.address_line?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>City</div>
                        <TextField
                          name='city'
                          value={formData.city}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.city?.[0] ? errors?.city[0] : ''}
                          error={!!errors?.city?.[0]}
                        />
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Street</div>
                        <TextField
                          name='street'
                          value={formData.street}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.street?.[0] ? errors?.street[0] : ''}
                          error={!!errors?.street?.[0]}
                        />
                      </div>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>State</div>
                        <TextField
                          name='state'
                          value={formData.state}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.state?.[0] ? errors?.state[0] : ''}
                          error={!!errors?.state?.[0]}
                        />
                      </div>
                    </div>
                    <div className='fieldContainer2'>
                      <div className='fieldSubContainer'>
                        <div className='fieldTitle'>Pincode</div>
                        <TextField
                          name='postcode'
                          value={formData.postcode}
                          onChange={handleChange}
                          style={{ width: '70%' }}
                          size='small'
                          helperText={errors?.postcode?.[0] ? errors?.postcode[0] : ''}
                          error={!!errors?.postcode?.[0]}
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
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  height: '200px'
                                }
                              }
                            }}
                            className={'select'}
                            onChange={handleChange}
                            error={!!errors?.country?.[0]}
                          >
                            {state?.countries?.length ? state?.countries.map((option: any) => (
                              <MenuItem key={option[0]} value={option[0]}>
                                {option[1]}
                              </MenuItem>
                            )) : ''}

                          </Select>
                          <FormHelperText>{errors?.country?.[0] ? errors?.country[0] : ''}</FormHelperText>
                        </FormControl>
                        {/* <FormControl error={!!errors?.country?.[0]} sx={{ width: '70%' }}>
                          <Autocomplete
                            // ref={autocompleteRef}
                            // freeSolo
                            value={selectedCountry}
                            options={state.countries || []}
                            getOptionLabel={(option: any) => option[1]}
                            onChange={(e: any, value: any) => handleChange2('country', value)}
                            size='small'
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  deleteIcon={<FaTimes style={{ width: '9px' }} />}
                                  sx={{
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                    height: '18px'

                                  }}
                                  variant='outlined'
                                  label={option[1]}
                                  {...getTagProps({ index })}
                                />
                              ))
                            }
                            popupIcon={<IconButton
                              disableFocusRipple
                              disableRipple
                              sx={{
                                width: '45px', height: '40px',
                                borderRadius: '0px',
                                backgroundColor: '#d3d3d34a'
                              }}><FaArrowDown style={{ width: '15px' }} /></IconButton>}
                            renderInput={(params) => (
                              <TextField {...params}
                                // placeholder='Add co'
                                InputProps={{
                                  ...params.InputProps,
                                  sx: {
                                    '& .MuiAutocomplete-endAdornment': {
                                      mt: '-9px',
                                      mr: '-8px'
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                          <FormHelperText>{errors?.country?.[0] || ''}</FormHelperText>
                        </FormControl> */}
                      </div>
                    </div>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
            {/* Description details  */}
            <div className='leadContainer'>
              <Accordion defaultExpanded style={{ width: '98%' }}>
                <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                  <Typography className='accordion-header'>Description</Typography>
                </AccordionSummary>
                <Divider className='divider' />
                <AccordionDetails>
                  <Box
                    sx={{ width: '100%', mb: 1 }}
                    component='form'
                    noValidate
                    autoComplete='off'
                  >
                    <div className='DescriptionDetail'>
                      <div className='descriptionTitle'>Description</div>
                      <div style={{ width: '100%', marginBottom: '3%' }}>
                        <div ref={quillRef} />
                      </div>
                    </div>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mt: 1.5 }}>
                      <Button
                        className='header-button'
                        onClick={resetQuillToInitialState}
                        size='small'
                        variant='contained'
                        startIcon={<FaTimesCircle style={{ fill: 'white', width: '16px', marginLeft: '2px' }} />}
                        sx={{ backgroundColor: '#2b5075', ':hover': { backgroundColor: '#1e3750' } }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className='header-button'
                        onClick={() => setFormData({ ...formData, description: quillRef.current.firstChild.innerHTML })}
                        variant='contained'
                        size='small'
                        startIcon={<FaCheckCircle style={{ fill: 'white', width: '16px', marginLeft: '2px' }} />}
                        sx={{ ml: 1 }}
                      >
                        Save
                      </Button>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </form>
      </Box>
    </Box >
  )
}
