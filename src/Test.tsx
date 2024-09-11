import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DealsCard from './components/DealsCard';
import sashaPhoto from './assets/images/profile_images_test/IMG_9257B4B21EE3-1.jpeg'
import sasha2Photo from './assets/images/profile_images_test/profile_photo.jpg'
import profile3 from './assets/images/profile_images_test/profile3.jpeg'
import profile4 from './assets/images/profile_images_test/profile4.jpeg'
import profile5 from './assets/images/profile_images_test/profile5.jpeg'
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
        { name: 'Martin King', photo: profile5 },
        { name: 'Sasha Doe', photo: sashaPhoto },
      ],
      probability: 76,
      stage: "CLOSED WON",
    };
    const deal2 = {
      name: 'Small Deal',
      country: 'Netherlands',
      assignedUsers: [
        { name: 'Aleksandra Smith', photo: sasha2Photo },
        { name: 'Liza Istomina', photo: profile4 },
        { name: 'Jack Russel', photo: profile3 },
        { name: 'Martin King', photo: profile5 },
        { name: 'Sasha Doe', photo: sashaPhoto },
      ],
      probability: 34,
      stage: "CLOSED LOST",
    };

    const deal3 = {
      name: 'Nice Deal',
      country: 'France',
      assignedUsers: [
        { name: 'Aleksandra Smith', photo: sasha2Photo },
        { name: 'Liza Istomina', photo: profile4 },
        { name: 'Jack Russel', photo: profile3 },
        { name: 'Martin King', photo: profile5 },
        { name: 'Sasha Doe', photo: sashaPhoto },
      ],
      probability: 67,
      stage: "",
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
        stage = {deal.stage}
      />
    </ThemeProvider>
    <ThemeProvider theme={theme}>
      {/* Directly render the DealsCard component */}
      <DealsCard
        name={deal2.name}
        country={deal2.country}
        assignedUsers={deal2.assignedUsers}
        probability={deal2.probability}
        stage = {deal2.stage}
      />
    </ThemeProvider>
    <ThemeProvider theme={theme}>
      {/* Directly render the DealsCard component */}
      <DealsCard
        name={deal3.name}
        country={deal3.country}
        assignedUsers={deal3.assignedUsers}
        probability={deal3.probability}
        stage = {deal3.stage}
      />
    </ThemeProvider>
    </>
      );
    }
  
export default Test;