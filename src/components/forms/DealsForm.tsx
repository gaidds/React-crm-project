import * as React from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Box, Grid, Autocomplete, containerClasses, SelectChangeEvent, FormHelperText } from '@mui/material';
import { DealFormErrors} from '../modal/types';


type Deal = {
  name: string;
  account: string; 
  assigned_to: string[]; 
  contacts: string[]; 
  website: string;
  stage: string;
  deal_source: string;
  industry: string;
  currency: string;
  country: string;
  value: string | number; 
  close_date: string;
  probability: number; 
  tags: string[]; 
};


type DealsFormProps = {
  mode: 'add' | 'edit';
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>
  ) => void;
  formData: Deal ;
  errors?: DealFormErrors;
  data: {
    accounts_list: any[];
    contacts_list: any[];
    currency: any[];
    countries: any[];
    deal_source: any[];
    industries: any[];
    stage: any[];
    users: any[];
  };
}; 

const DealsForm = ({ mode, handleInputChange, formData, data, errors }: DealsFormProps) => {

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

      <FormControl fullWidth size='small' sx={{ mb: 2 }}>
        <InputLabel>Assign to</InputLabel>
        <Select
          name="assigned_to"
          multiple
          value={formData.assigned_to || []}
          onChange={handleInputChange}
          renderValue={(selected) =>
            selected.map(id => data.users.find(user => user.id === id)?.user__email).join(', ')
          }
          error={!!errors?.assigned_to?.[0]}
        >
          {data.users.map(user => (
            <MenuItem key={user} value={user.id}>
              {user.user__email}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={!!errors?.assigned_to?.[0]}>
  {errors?.assigned_to?.[0] ? errors?.assigned_to[0] : ''}
</FormHelperText>
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
