import React, { useState, useEffect } from 'react';
import { IconButton, Drawer, Box, Checkbox, FormControlLabel, Button, SxProps } from '@mui/material';
import { FaFilter } from 'react-icons/fa';
import { Deal, AssignedTo } from '../../pages/deals/Deals'; // Adjust path as necessary

// interface AssignedTo {
//     user_details: {
//         email: string;
//         profile_pic: string;
//     };
// }

// interface Deal {
//     id: string;
//     name: string;
//     probability: number;
//     stage: string;
//     country: string;
//     assigned_to: AssignedTo[];
//     value: string;
//     created_by: {
//        id: string;
//     };
//     deal_source: string;
// }

const buttonStyle = {
    backgroundColor: '#65558F',
    color: 'white',
    borderRadius: '30px',
    padding: '10px 20px',
    width: '100px', // Fixed width
    height: '36px', // Fixed height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    '&:hover': {
      backgroundColor: '#89829e',
    },
  };


interface FilterComponentProps {
  deals: Deal[];
  onApplyFilters: (filteredDeals: Deal[]) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ deals, onApplyFilters }) => {
  const [open, setOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['won', 'lost', 'opened']);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [allSources, setAllSources] = useState<string[]>([]);

  useEffect(() => {
    const uniqueCountries = Array.from(new Set(deals.map(deal => deal.country)));
    setAllCountries(uniqueCountries);
    setSelectedCountries(uniqueCountries);
  }, [deals]);
  useEffect(() => {
    const uniqueSources = Array.from(new Set(deals.map(deal => deal.deal_source)));
    setAllSources(uniqueSources);
    setSelectedSources(uniqueSources);
  }, [deals]);

  useEffect(() => {
    const filteredDeals = deals.filter(deal =>
      (selectedCountries.length === 0 || selectedCountries.includes(deal.country)) &&
      (selectedStatus.length === 0 || (selectedStatus.includes('won') && deal.stage === 'CLOSED WON') || (selectedStatus.includes('lost') && deal.stage === 'CLOSED LOST'))
    );
  }, [ onApplyFilters]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedStatus((prev) =>
      prev.includes(value) ? prev.filter((status) => status !== value) : [...prev, value]
    );
  };

  const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedSources((prev) =>
      prev.includes(value) ? prev.filter((source) => source !== value) : [...prev, value]
    );
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedCountries((prev) =>
      prev.includes(value) ? prev.filter((country) => country !== value) : [...prev, value]
    );
  };

  const handleApplyFilters = () => {
    const filteredDeals = deals.filter(deal =>
      (selectedCountries.length === 0 || selectedCountries.includes(deal.country)) &&
      (selectedStatus.length === 0 || (selectedStatus.includes('won') && deal.stage === 'CLOSED WON') || (selectedStatus.includes('lost') && deal.stage === 'CLOSED LOST') || (selectedStatus.includes('opened') && deal.stage !== 'CLOSED WON' && deal.stage !== 'CLOSED LOST')) &&
      (selectedSources.length === 0 || selectedSources.includes(deal.deal_source))
    );
    onApplyFilters(filteredDeals);
    setOpen(false);
  };

  return (
    <>
      <IconButton color="primary" onClick={toggleDrawer}>
        <FaFilter style={{ color: '#333F49' }} />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box p={2} sx={{ width: 300}}>
            <Box sx={{mb: 5}}>
                <h3>Filter Options</h3>
            </Box>

          {/* Country Filter */}
          <h4>Country</h4>
          {allCountries.map((country, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  value={country}
                  onChange={handleCountryChange}
                  checked={selectedCountries.includes(country)}
                  style={{color: '#65558F', borderRadius:'20px'}}
                />
              }
              label={country}
            />
          ))}

            <h4>Deal Source</h4>
            {allSources.map((source, index) => (
            <FormControlLabel
                key={index}
                control={
                <Checkbox
                    value={source}
                    onChange={handleSourceChange}
                    checked={selectedSources.includes(source)}
                    style={{color: '#65558F'}}
                />
                }
                label={source}
            />
            ))}

          <h4>Status</h4>
          <FormControlLabel
            control={
              <Checkbox
                value="opened"
                onChange={handleStatusChange}
                checked={selectedStatus.includes('opened')}
                style={{color: '#65558F'}}
              />
            }
            label="Opened"
          />
          <FormControlLabel
            control={
              <Checkbox
                value="won"
                onChange={handleStatusChange}
                checked={selectedStatus.includes('won')}
                style={{color: '#65558F'}}
              />
            }
            label="Won"
          />
          <FormControlLabel
            control={
              <Checkbox
                value="lost"
                onChange={handleStatusChange}
                checked={selectedStatus.includes('lost')}
                style={{color: '#65558F'}}
              />
            }
            label="Lost"
          />
        <Box sx={{mt: 5}}>
          <Button variant="contained" color="primary" onClick={handleApplyFilters}  sx={buttonStyle}>
            Apply
          </Button>
        </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default FilterComponent;
