import * as React from 'react';
import { TextField } from '@mui/material';

type AccountsFormProps = {
  mode: 'add' | 'edit';
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: any;
  data: any;
};

const AccountsForm = ({ mode, handleInputChange, formData }: AccountsFormProps) => {
  return (
    <div>
      <TextField
        label="Username"
        name="username"
        value={formData.username || ''}
        onChange={handleInputChange}
        fullWidth
      />
      {/* Add more fields*/}
    </div>
  );
};

export default AccountsForm;
