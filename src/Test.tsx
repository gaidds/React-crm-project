import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DealsCard from './components/DealsCard';
import sashaPhoto from './assets/images/IMG_9257B4B21EE3-1.jpeg'
import sasha2Photo from './assets/images/profile_photo.jpg'
import profile3 from './assets/images/profile3.jpeg'
import profile4 from './assets/images/profile4.jpeg'
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme();

function Test() {
    // Mock data for the DealsCard
    const deal = {
      name: 'Big Tech Deal',
      country: 'USA',
      assignedUsers: [
        { name: 'Aleksandra Smith', photo: sasha2Photo },
        { name: 'Liza Istomina', photo: profile4 },
        { name: 'Jack Russel', photo: profile3 },
        { name: 'Sasha Doe', photo: sashaPhoto },
      ],
      probability: 78,
    };
  
    return (
    <>
    <h1>Test page</h1>
    <ThemeProvider theme={theme}>
      {/* Directly render the DealsCard component */}
      <DealsCard
        name={deal.name}
        country={deal.country}
        assignedUsers={deal.assignedUsers}
        probability={deal.probability}
      />
    </ThemeProvider>
    </>
      );
    }
  
export default Test;