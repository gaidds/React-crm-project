import React, { useState } from 'react';
import {
    TextField,
    Box,
    MenuItem,
    Select,
    FormControl,
    FormHelperText,
    InputLabel,
    Grid
} from '@mui/material';
import { RequiredTextField } from '../../styles/CssStyled';
import { roleOptions } from '../modal/types';
import { useMyContext } from '../../context/Context';
import { UsersFormProps } from './types';

const UsersForm = ({ 
  mode,
  handleInputChange,
  formData,
  data,
  errors, 
  userErrors
}: UsersFormProps) => {
  const { userRole, setUserRole, userId } = useMyContext();

  const selectLable = (str: string) => (
    <InputLabel sx={{ backgroundColor: 'white', paddingX: '4px' }}>
      {str}
    </InputLabel>
  );

  if (errors?.email?.[0]){
  console.log(errors?.email[0], 'EROOORRRR');}

  return (
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
          <TextField
            label="Profile Picture"
            name="profile_pic"
            value={formData.profile_pic || ''}
            onChange={handleInputChange}
            size="small"
            fullWidth
            helperText={userErrors?.profile_pic?.[0] ? userErrors?.profile_pic[0] : ''}
            error={!!userErrors?.profile_pic?.[0]}
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
  );
};

export default UsersForm;
