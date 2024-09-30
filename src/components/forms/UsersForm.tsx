import React, { useState } from 'react';
import {
    TextField,
    Box,
    MenuItem,
    Select,
    FormControl,
    FormHelperText,
    InputLabel,
    Grid,
    Button
} from '@mui/material';
import { RequiredTextField } from '../../styles/CssStyled';
import { roleOptions} from '../modal/types';
import { useMyContext } from '../../context/Context';
import { UsersFormProps } from './types';
import ImgUploader from '../img-uploader/ImgUploader';
import ChangePasswordModal from '../modal/ChangePassword';

const buttonStyle = {
  backgroundColor: '#65558F',
  color: 'white',
  borderRadius: '30px',
  padding: '10px 20px',
  width: '100%', // Fixed width
  height: '36px', // Fixed height
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#89829e',
  },
};

const UsersForm = ({ 
  mode,
  handleInputChange,
  formData,
  data,
  errors, 
  userErrors
}: UsersFormProps) => {
  const { userRole, setUserRole, userId } = useMyContext();
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const handleOpenPasswordModal = () => setOpenPasswordModal(true);
  const handleClosePasswordModal = () => setOpenPasswordModal(false);


  const selectLable = (str: string) => (
    <InputLabel sx={{ backgroundColor: 'white', paddingX: '4px' }}>
      {str}
    </InputLabel>
  );

  return (
  <>
    <Box
      sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}
    >
      <FormControl>
        <Grid item xs={12}>
          <TextField
            label="First Name"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleInputChange}
            size="small"
            fullWidth
            helperText={userErrors?.first_name?.[0] ? userErrors?.first_name[0] : ''}
            error={!!userErrors?.first_name?.[0]}
          />
        </Grid>
      </FormControl>
      <FormControl>
        <Grid item xs={12}>
          <TextField
            label="Last Name"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleInputChange}
            size="small"
            fullWidth
            helperText={userErrors?.last_name?.[0] ? userErrors?.last_name[0] : ''}
            error={!!userErrors?.last_name?.[0]}
          />
        </Grid>
      </FormControl>
      <FormControl>
        <Grid item xs={12}>
        <ImgUploader
            name="profile_pic"
            onChange={handleInputChange
            }
            defaultValue= {formData.profile_pic || "https://res.cloudinary.com/dpci3gfrc/image/upload/v1727470032/bottle-crm/rjpnub4fzkfkggdudowh.png"}
          />
        </Grid>
      </FormControl>
      <FormControl>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            size="small"
            fullWidth
            helperText={userErrors?.email?.[0] ? userErrors?.email[0] : ''}
            error={!!userErrors?.email?.[0]}
          />
        </Grid>
      </FormControl>
      <FormControl>
        <Grid item xs={12}>
          <TextField
            label="Street"
            name="street"
            value={formData.street || ''}
            onChange={handleInputChange}
            size="small"
            fullWidth
            helperText={errors?.street?.[0] ? errors?.street[0] : ''}
            error={!!errors?.street?.[0]}
          />
        </Grid>
      </FormControl>
      <FormControl>
        <Grid item xs={12}>
          <TextField
            label="Ctiry"
            name="city"
            value={formData.city || ''}
            onChange={handleInputChange}
            size="small"
            fullWidth
            helperText={errors?.city?.[0] ? errors?.city[0] : ''}
            error={!!errors?.city?.[0]}
          />
        </Grid>
      </FormControl>
      <FormControl>
        <Grid item xs={12}>
          <TextField
            label="State"
            name="state"
            value={formData.state || ''}
            onChange={handleInputChange}
            size="small"
            fullWidth
            helperText={errors?.state?.[0] ? errors?.state[0] : ''}
            error={!!errors?.state?.[0]}
          />
        </Grid>
      </FormControl>
      <FormControl>
        <Grid item xs={12}>
          <TextField
            label="Postcode"
            name="postcode"
            value={formData.postcode || ''}
            onChange={handleInputChange}
            size="small"
            fullWidth
            helperText={errors?.postcode?.[0] ? errors?.postcode[0] : ''}
            error={!!errors?.postcode?.[0]}
          />
        </Grid>
      </FormControl>
      <FormControl>
        <Grid item xs={12}>
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            size="small"
            fullWidth
            helperText={errors?.phone?.[0] ? errors?.phone[0] : ''}
            error={!!errors?.phone?.[0]}
          />
        </Grid>
      </FormControl>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        {selectLable('Role')}
        <Select
          name="role"
          value={formData.role || ''}
          onChange={handleInputChange}
          error={!!errors?.role?.[0]}
        >
          {data.roles.map((item) => (
            <MenuItem key={item} value={item[0]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={!!errors?.role?.[0]}>
          {errors?.role?.[0] ? errors?.role[0] : ''}
        </FormHelperText>
      </FormControl>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        {selectLable('Country')}
        <Select
          name="country"
          value={formData.country || ''}
          onChange={handleInputChange}
          error={!!errors?.country?.[0]}
        >
          {data.countries.map((item) => (
            <MenuItem key={item} value={item[0]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={!!errors?.country?.[0]}>
          {errors?.country?.[0] ? errors?.country[0] : ''}
        </FormHelperText>
      </FormControl>
    </Box>
    <FormControl>
    <Grid item xs={12}>
  <Button variant="contained" sx={buttonStyle} onClick={handleOpenPasswordModal}> Change Password </Button>
    <ChangePasswordModal 
    open={openPasswordModal} 
    handleClose={handleClosePasswordModal}
  />
    </Grid>
  </FormControl>  
  </>
  );
};

export default UsersForm;
