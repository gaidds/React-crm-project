import * as React from 'react';
import { TextField } from '@mui/material';

type UsersFormProps = {
  mode: 'add' | 'edit';
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: any;
  data: any;
};

const UsersForm = ({ mode, handleInputChange, formData }: UsersFormProps) => {
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

export default UsersForm;
