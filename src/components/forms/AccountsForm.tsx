import * as React from 'react';
  import {   
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormHelperText,
    FormControl,
    Box,
    Grid,
    Autocomplete,
  } from '@mui/material';
  import { AccountsFormProps } from './types';
  import { useMyContext } from '../../context/Context';
  
  const AccountsForm = ({
    mode,
    handleInputChange,
    handleAutocompleteChange,
    formData,
    data,
    errors,
  }: AccountsFormProps) => {
  
    const { userRole, setUserRole, userId } = useMyContext();
  
    const selectLable = (str: string) => (
      <InputLabel sx={{ backgroundColor: 'white', paddingX: '4px' }}>
        {str}
      </InputLabel>
    );
  
    return (
      <Box
        sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}
      >
        <FormControl>
          <Grid item xs={12}>
            <TextField
              label="Account Name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              size="small"
              fullWidth
              helperText={errors?.name?.[0] ? errors?.name[0] : ''}
              error={!!errors?.name?.[0]}
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
  
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          {selectLable('Deal')}
          <Select
            label="Deal"
            name="deal"
            value={formData.deal || ''}
            onChange={handleInputChange}
            error={!!errors?.deal?.[0]}
          >
            {data.deals.map((deal) => (
              <MenuItem key={deal.id} value={deal.id}>
                {deal.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={!!errors?.deal?.[0]}>
            {errors?.deal?.[0] ? errors?.deal[0] : ''}
          </FormHelperText>
        </FormControl>
  
        <FormControl fullWidth sx={{ mb: 2 }} size="small">
          <Autocomplete
            multiple
            value={data.users.filter((user) =>
              formData.assigned_to.includes(user.id)
            )}
            onChange={handleAutocompleteChange}
            options={data.users}
            getOptionLabel={(option) => option.user__email}
            renderInput={(params) => (
              <TextField {...params} label="Assign to" variant="outlined" />
            )}
            size="small"
          />
        </FormControl>
  
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          {selectLable('Contact')}
          <Select
            name="contact_name"
            value={formData.contact_name || ''}
            onChange={handleInputChange}
            error={!!errors?.contacts?.[0]}
          >
            {data.contacts.map((contact) => (
              <MenuItem key={contact.id} value={contact.id}>
                {contact.first_name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={!!errors?.contacts?.[0]}>
            {errors?.contacts?.[0] ? errors?.contacts[0] : ''}
          </FormHelperText>
        </FormControl>
  
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          {selectLable('Status')}
          <Select
            name="status"
            value={formData.status || ''}
            onChange={handleInputChange}
          >
            {data.status.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        {/* New Fields: Phone, Email, and Address */}
        <FormControl fullWidth>
          <Grid item xs={12}>
            <TextField
              label="Phone"
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
  
        <FormControl fullWidth>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              size="small"
              fullWidth
              helperText={errors?.email?.[0] ? errors?.email[0] : ''}
              error={!!errors?.email?.[0]}
            />
          </Grid>
        </FormControl>
  
        <FormControl fullWidth>
          <Grid item xs={12}>
            <TextField
              label="Billing Address Line"
              name="billing_address_line"
              value={formData.billing_address_line || ''}
              onChange={handleInputChange}
              size="small"
              fullWidth
            />
          </Grid>
        </FormControl>
  
        <FormControl fullWidth>
          <Grid item xs={12}>
            <TextField
              label="Billing Street"
              name="billing_street"
              value={formData.billing_street || ''}
              onChange={handleInputChange}
              size="small"
              fullWidth
            />
          </Grid>
        </FormControl>
  
        <FormControl fullWidth>
          <Grid item xs={12}>
            <TextField
              label="Billing City"
              name="billing_city"
              value={formData.billing_city || ''}
              onChange={handleInputChange}
              size="small"
              fullWidth
            />
          </Grid>
        </FormControl>
  
        <FormControl fullWidth>
          <Grid item xs={12}>
            <TextField
              label="Billing State"
              name="billing_state"
              value={formData.billing_state || ''}
              onChange={handleInputChange}
              size="small"
              fullWidth
            />
          </Grid>
        </FormControl>
  
        <FormControl fullWidth>
          <Grid item xs={12}>
            <TextField
              label="Billing Postcode"
              name="billing_postcode"
              value={formData.billing_postcode || ''}
              onChange={handleInputChange}
              size="small"
              fullWidth
            />
          </Grid>
        </FormControl>
  
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        {selectLable('Country')}
        <Select
          name="billing_country"
          value={formData.billing_country || ''}
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
  
  export default AccountsForm;