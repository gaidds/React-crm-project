import React, { useState } from 'react';
import {
  IconButton,
  Drawer,
  Box,
  Checkbox,
  FormControlLabel,
  Button,
} from '@mui/material';
import { FaFilter } from 'react-icons/fa';

const buttonStyle = {
  backgroundColor: '#65558F',
  color: 'white',
  borderRadius: '30px',
  padding: '10px 20px',
  width: '100px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  '&:hover': {
    backgroundColor: '#89829e',
  },
};

interface FilterComponentProps {
  onApplyFilters: (filteres: any) => void;
}

const UsersFilter: React.FC<FilterComponentProps> = ({ onApplyFilters }) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'ALL' | 'Active' | 'In Active'>('ALL');
  const [role, setRole] = useState<
    'ALL' | 'ADMIN' | 'USER' | 'SALES REP' | 'SALES MANAGER'
  >('ALL');

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleFilter = () =>
    onApplyFilters(
      `${role !== 'ALL' ? '&role=' + role : ''}${
        status !== 'ALL'
          ? '&status=' + (status === 'Active' ? 'True' : 'False')
          : ''
      }`
    );

  return (
    <>
      <IconButton color="primary" onClick={toggleDrawer}>
        <FaFilter style={{ color: '#333F49' }} />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box p={2} sx={{ width: 300 }}>
          <Box sx={{ mb: 5 }}>
            <h3>Filter Options</h3>
          </Box>

          <h4>Status</h4>

          <FormControlLabel
            control={
              <Checkbox
                value={status}
                onChange={() => setStatus('ALL')}
                checked={status === 'ALL'}
                style={{ color: '#65558F', borderRadius: '20px' }}
              />
            }
            label="ALL"
          />
          <FormControlLabel
            control={
              <Checkbox
                value={status}
                onChange={() => setStatus('Active')}
                checked={status === 'Active'}
                style={{ color: '#65558F', borderRadius: '20px' }}
              />
            }
            label="Active"
          />
          <FormControlLabel
            control={
              <Checkbox
                value={status}
                onChange={() => setStatus('In Active')}
                checked={status === 'In Active'}
                style={{ color: '#65558F', borderRadius: '20px' }}
              />
            }
            label="In Active"
          />

          <h4>Role</h4>
          <FormControlLabel
            control={
              <Checkbox
                value={role}
                onChange={() => setRole('ALL')}
                checked={role === 'ALL'}
                style={{ color: '#65558F', borderRadius: '20px' }}
              />
            }
            label="ALL"
          />
          <FormControlLabel
            control={
              <Checkbox
                value={role}
                onChange={() => setRole('ADMIN')}
                checked={role === 'ADMIN'}
                style={{ color: '#65558F', borderRadius: '20px' }}
              />
            }
            label="ADMIN"
          />
          <FormControlLabel
            control={
              <Checkbox
                value={role}
                onChange={() => setRole('USER')}
                checked={role === 'USER'}
                style={{ color: '#65558F', borderRadius: '20px' }}
              />
            }
            label="USER"
          />
          <FormControlLabel
            control={
              <Checkbox
                value={role}
                onChange={() => setRole('SALES REP')}
                checked={role === 'SALES REP'}
                style={{ color: '#65558F', borderRadius: '20px' }}
              />
            }
            label="SALES REPRESENTATIVE"
          />
          <FormControlLabel
            control={
              <Checkbox
                value={role}
                onChange={() => setRole('SALES MANAGER')}
                checked={role === 'SALES MANAGER'}
                style={{ color: '#65558F', borderRadius: '20px' }}
              />
            }
            label="SALES MANAGER"
          />

          <Box sx={{ mt: 5 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFilter}
              sx={buttonStyle}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default UsersFilter;
