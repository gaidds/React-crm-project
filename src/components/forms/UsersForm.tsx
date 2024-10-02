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
import ToggleActiveStatus from '../ToggleActiveStatus';

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
            defaultValue= {formData.profile_pic || "data:image/png;base64,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"}
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
      {userRole === 'ADMIN' && (
      <Grid item xs={12}>
                    <ToggleActiveStatus userId={formData.profile_id} is_active={formData.is_active} />
        </Grid>
      )}
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
            label="City"
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
      {userRole === 'ADMIN' && (
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
      </FormControl>)}
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
    {mode === 'edit' && userId === formData.id && (
    <FormControl>
      <Grid item xs={12}>
        <Button variant="contained" sx={buttonStyle} onClick={handleOpenPasswordModal}> Change Password </Button>
        <ChangePasswordModal 
            open={openPasswordModal} 
            handleClose={handleClosePasswordModal}
        />
      </Grid>
  </FormControl>)} 
  </>
  );
};

export default UsersForm;
