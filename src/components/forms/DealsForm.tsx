import * as React from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Box, Grid, Autocomplete, containerClasses, SelectChangeEvent } from '@mui/material';


type DealsFormProps = {
  mode: 'add' | 'edit';
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>
  ) => void;
  formData: any;
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

const DealsForm = ({ mode, handleInputChange, formData, data }: DealsFormProps) => {

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
      <Grid item xs={12}>
        <TextField
          label="Deal Name"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Website"
          name="website"
          value={formData.website || ''}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Account</InputLabel>
        <Select
          name="account"
          value={formData.account || ''}
          onChange={handleInputChange}
        >
          {data.accounts_list.map(account => (
            <MenuItem key={account} value={account.id}>
              {account.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Assign to</InputLabel>
        <Autocomplete
      multiple
      limitTags={3}
      id="multiple-limit-tags"
      options={data.users}
      getOptionLabel={(option) => option.user__email}
      defaultValue={formData.assigned_to || []}
      renderInput={(params) => (
        <TextField {...params} label="Assigned to" placeholder="" />
      )}
    />
      </FormControl>


      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Deal Source</InputLabel>
        <Select
          name="deal_source"
          value={formData.deal_source || ''}
          onChange={handleInputChange}
        >
          {data.deal_source.map(source => (
            <MenuItem key={source} value={source[1]}>
              {source[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Currency</InputLabel>
        <Select
          name="currency"
          value={formData.currency || ''}
          onChange={handleInputChange}
        >
          {data.currency.map(item => (
            <MenuItem key={item} value={item[0]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Contacts</InputLabel>
          <Select
            name="contacts"
            multiple
            value={formData.contacts || []}
            onChange={handleInputChange}
            renderValue={(selected) => (
              <div>
                {selected.map((id) => {
                  const contact = data.contacts_list.find((c) => c.id === id);
                  return contact ? contact.first_name : null;
                }).join(', ')}
              </div>
            )}
          >
            {data.contacts_list.map((contact) => (
              <MenuItem key={contact.id} value={contact.id}>
                {contact.first_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Stage</InputLabel>
        <Select
          name="stage"
          value={formData.stage || ''}
          onChange={handleInputChange}
        >
          {data.stage.map(item => (
            <MenuItem key={item} value={item[1]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Country</InputLabel>
        <Select
          name="country"
          value={formData.country || ''}
          onChange={handleInputChange}
        >
          {data.countries.map(item => (
            <MenuItem key={item} value={item[0]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Industry</InputLabel>
        <Select
          name="industry"
          value={formData.industry || ''}
          onChange={handleInputChange}
        >
          {data.industries.map(item => (
            <MenuItem key={item} value={item[1]}>
              {item[1]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      <Grid item xs={12}>
        <TextField
          label="Value"
          name="value"
          type="string"
          value={formData.value || ''}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Probability"
          name="probability"
          type="number"
          value={formData.probability || ''}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Close Date"
          name="close_date"
          type="date"
          value={formData.close_date || ''}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
    </Box>
  );
};

export default DealsForm;
