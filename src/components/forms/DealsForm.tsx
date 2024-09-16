import * as React from 'react';
import { TextField, MenuItem, Select, InputLabel, FormHelperText, FormControl, Box, Grid, Autocomplete, Avatar} from '@mui/material';
import { DealsFormProps } from './types';
import { useMyContext } from '../../context/Context';
import { Deal } from '../../pages/deals/Deals';



const DealsForm = ({ mode, handleInputChange, handleAutocompleteChange, formData, data, errors }: DealsFormProps) => {

  const { userRole, setUserRole , userId} = useMyContext();
  const myDeal: Deal | undefined = data.deals.find((deal: any) => deal.name === formData.name);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
      <FormControl>
      <Grid item xs={12}>
        <TextField
          label="Deal Name"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          size='small'
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
          size='small'
          fullWidth
          helperText={errors?.website?.[0] ? errors?.website[0] : ''}
                          error={!!errors?.website?.[0]}
        />
      </Grid>
      </FormControl>

      <FormControl fullWidth size='small' sx={{ mb: 2 }}>
        <InputLabel>Account</InputLabel>
        <Select
          name="account"
          value={formData.account || ''}
          onChange={handleInputChange}
          error={!!errors?.account?.[0]}
        >
          {data.accounts_list.map(account => (
            <MenuItem key={account} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={!!errors?.account?.[0]}>
  {errors?.account?.[0] ? errors?.account[0] : ''}
</FormHelperText>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }} size='small'>
  {(mode === 'add' || (mode === 'edit' && (userRole === 'ADMIN' || myDeal?.created_by?.id === userId))) && (
    <Autocomplete
      multiple
      value={data.users.filter(user => formData.assigned_to.includes(user.id))}
      onChange={handleAutocompleteChange}
      options={data.users}
      getOptionLabel={(option) => option.user__email}
      renderInput={(params) => <TextField {...params} label="Assign to" variant="outlined" />}
      size='small'
    />
  )}
</FormControl>
      <FormControl fullWidth size='small' sx={{ mb: 2 }}>
        <InputLabel>Deal Source</InputLabel>
        <Select
          name="deal_source"
          value={formData.deal_source || ''}
          onChange={handleInputChange}
          error={!!errors?.deal_source?.[0]}
        >
          {data.deal_source.map(source => (
            <MenuItem key={source} value={source[1]}>
              {source[1]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={!!errors?.deal_source?.[0]}>
  {errors?.deal_source?.[0] ? errors?.deal_source[0] : ''}
</FormHelperText>
      </FormControl>
      <FormControl fullWidth size='small' sx={{ mb: 2 }}>
        <InputLabel>Currency</InputLabel>
        <Select
          name="currency"
          value={formData.currency || ''}
          onChange={handleInputChange}
          error={!!errors?.currency?.[0]}
        >
          {data.currency.map(item => (
            <MenuItem key={item} value={item[0]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={!!errors?.currency?.[0]}>
  {errors?.currency?.[0] ? errors?.currency[0] : ''}
</FormHelperText>
      </FormControl>
      <FormControl fullWidth size='small' sx={{ mb: 2 }}>
        <InputLabel>Contact</InputLabel>
        <Select
          name="contacts"
          value={formData.contacts || ''}
          onChange={handleInputChange}
          error={!!errors?.contacts?.[0]}
        >
          {data.contacts_list.map(contact => (
            <MenuItem key={contact.id} value={contact.id}>
              {contact.first_name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={!!errors?.contacts?.[0]}>
  {errors?.contacts?.[0] ? errors?.contacts[0] : ''}
</FormHelperText>
      </FormControl>
      <FormControl fullWidth size='small' sx={{ mb: 2 }}>
        <InputLabel>Stage</InputLabel>
        <Select
          name="stage"
          value={formData.stage || ''}
          onChange={handleInputChange}
          error={!!errors?.stage?.[0]}
        >
          {data.stage.map(item => (
            <MenuItem key={item} value={item[1]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={!!errors?.stage?.[0]}>
  {errors?.stage?.[0] ? errors?.stage[0] : ''}
</FormHelperText>
      </FormControl>

      <FormControl fullWidth size='small' sx={{ mb: 2 }}>
        <InputLabel>Country</InputLabel>
        <Select
          name="country"
          value={formData.country || ''}
          onChange={handleInputChange}
          error={!!errors?.country?.[0]}
        >
          {data.countries.map(item => (
            <MenuItem key={item} value={item[0]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={!!errors?.country?.[0]}>
  {errors?.country?.[0] ? errors?.country[0] : ''}
</FormHelperText>

      </FormControl>

      <FormControl fullWidth size='small' sx={{ mb: 2 }}>
        <InputLabel>Industry</InputLabel>
        <Select
          name="industry"
          value={formData.industry || ''}
          onChange={handleInputChange}
          error={!!errors?.industry?.[0]}
        >
          {data.industries.map(item => (
            <MenuItem key={item} value={item[1]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
          <FormControl>
          <Grid item xs={12}>
        <TextField
          label="Value"
          name="value"
          type="string"
          value={formData.value || ''}
          onChange={handleInputChange}
          size='small'
          fullWidth
          helperText={errors?.value?.[0] ? errors?.value[0] : ''}
                          error={!!errors?.value?.[0]}
        />
      </Grid>
      </FormControl>

        <FormControl>
            <Grid item xs={12}>
          <TextField
            label="Probability"
            name="probability"
            type="number"
            value={formData.probability || ''}
            onChange={handleInputChange}
            size='small'
            fullWidth
            helperText={errors?.probability?.[0] ? errors?.probability[0] : ''}
                          error={!!errors?.probability?.[0]}
          />
        </Grid>
            </FormControl>
  <FormControl>
  <Grid item xs={12}>
          <TextField
            label="Close Date"
            name="close_date"
            type="date"
            value={formData.close_date || ''}
            onChange={handleInputChange}
            size='small'
            fullWidth
            InputLabelProps={{ shrink: true }}
            helperText={errors?.close_date?.[0] ? errors?.close_date : ''}
                          error={!!errors?.close_date?.[0]}
          />
        </Grid>
  </FormControl>
    </Box>
  );
};

export default DealsForm;
