import React, { FC, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from 'react-simple-maps';
import { Tooltip } from '@mui/material'; // Importing Tooltip from Material-UI
import { countryCoordinates } from './country-coordinates'; // Assuming this contains the coordinates
import { DealsByCountry, DealsByCountryProps } from './types';
import './styles.css';
const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';

interface MapDashboardProps {
  dealsByCountry: DealsByCountry;
}

const MapDashboard: FC<MapDashboardProps> = ({ dealsByCountry }) => {
  return (
    <div className="map-dashboard">
      <ComposableMap className="map-container">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} className="geo" />
            ))
          }
        </Geographies>
        {Object.keys(dealsByCountry).map((country, index) => {
          const countryDeals =
            dealsByCountry[country as keyof DealsByCountryProps];
          const totalDeals = countryDeals.length;
          const coordinates =
            countryCoordinates[country as keyof typeof countryCoordinates];

          if (!coordinates || totalDeals === 0) return null;

          return (
            <Tooltip
              key={index}
              title={`${country}: ${totalDeals} deals`}
              arrow
            >
              <Marker coordinates={coordinates}>
                <circle className="marker-circle"></circle>
                <text className="marker-text">{totalDeals}</text>
              </Marker>
            </Tooltip>
          );
        })}
      </ComposableMap>
    </div>
  );
};

export default MapDashboard;
