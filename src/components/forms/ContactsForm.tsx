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
import { useMyContext } from '../../context/Context';
import { ContactFormProps } from './types';


const ContactsForm = ({ 
  mode,
  handleInputChange,
  formData,
  data,
  errors, 
}: ContactFormProps) => {
  const { userRole, setUserRole, userId } = useMyContext();
  console.log('ERRORS', errors);

  const selectLable = (str: string) => (
    <InputLabel sx={{ backgroundColor: 'white', paddingX: '4px' }}>
      {str}
    </InputLabel>
  );

  return (<Box
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
          helperText={errors?.first_name?.[0] ? errors?.first_name[0] : ''}
          error={!!errors?.first_name?.[0]}
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
          helperText={errors?.last_name?.[0] ? errors?.last_name[0] : ''}
          error={!!errors?.last_name?.[0]}
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
          helperText={errors?.profile_pic?.[0] ? errors?.profile_pic[0] : ''}
          error={!!errors?.profile_pic?.[0]}
        />
      </Grid>
    </FormControl>
    <FormControl>
      <Grid item xs={12}>
        <TextField
          label="Department"
          name="department"
          value={formData.department || ''}
          onChange={handleInputChange}
          size="small"
          fullWidth
          helperText={errors?.department?.[0] ? errors?.department[0] : ''}
          error={!!errors?.department?.[0]}
        />
      </Grid>
    </FormControl>
    <FormControl>
      <Grid item xs={12}>
        <TextField
          label="Language"
          name="language"
          value={formData.language || ''}
          onChange={handleInputChange}
          size="small"
          fullWidth
          helperText={errors?.language?.[0] ? errors?.language[0] : ''}
          error={!!errors?.language?.[0]}
        />
      </Grid>
    </FormControl>
    <FormControl>
      <Grid item xs={12}>
        <TextField
          label="Salutation"
          name="salutation"
          value={formData.salutation || ''}
          onChange={handleInputChange}
          size="small"
          fullWidth
          helperText={errors?.salutation?.[0] ? errors?.salutation[0] : ''}
          error={!!errors?.salutation?.[0]}
        />
      </Grid>
    </FormControl>
    <FormControl>
        <Grid item xs={12}>
          <TextField
            label="Website"
            name="website"
            value={formData.website || ''}
            onChange={handleInputChange}
            size="small"
            fullWidth
            helperText={errors?.website?.[0] ? errors?.website[0] : ''}
            error={!!errors?.website?.[0]}
          />
        </Grid>
      </FormControl>
      {/* <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        {selectLable('Account')}
        <Select
          label="Account"
          name="account"
          value={formData.account || ''}
          onChange={handleInputChange}
          error={!!errors?.account?.[0]}
        >
          {data.accounts_list.map((account) => (
            <MenuItem key={account} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={!!errors?.account?.[0]}>
          {errors?.account?.[0] ? errors?.account[0] : ''}
        </FormHelperText>
      </FormControl> */}
    <FormControl>
      <Grid item xs={12}>
        <TextField
          label="Email"
          name="primary_email"
          value={formData.primary_email || ''}
          onChange={handleInputChange}
          size="small"
          fullWidth
          helperText={errors?.primary_email?.[0] ? errors?.primary_email[0] : ''}
          error={!!errors?.primary_email?.[0]}
        />
      </Grid>
    </FormControl>
    <FormControl>
      <Grid item xs={12}>
        <TextField
          label="Phone Number"
          name="mobile_number"
          value={formData.mobile_number || ''}
          onChange={handleInputChange}
          size="small"
          fullWidth
          helperText={errors?.mobile_number?.[0] ? errors?.mobile_number[0] : ''}
          error={!!errors?.mobile_number?.[0]}
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

export default ContactsForm;