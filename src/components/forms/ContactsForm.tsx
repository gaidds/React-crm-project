import * as React from 'react';
import { TextField } from '@mui/material';

type ContactsFormProps = {
  mode: 'add' | 'edit';
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: any;
  data: any;
};

const ContactsForm = ({ mode, handleInputChange, formData }: ContactsFormProps) => {
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

export default ContactsForm;
