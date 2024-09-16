import React, { useEffect, useState } from 'react';
import { Chip } from '@mui/material';

export const Label = (props: any) => {
  const { tags } = props;
  const [tagsColor, setTagsColor] = useState('#665d1e');

  useEffect(() => {
    colorTag();
  }, [tags]);

  const colorMap: { [key: string]: string } = {
    "ASSIGNED LEAD": '#004E85',
    "IN PROCESS": '#1C7EC3',
    "OPPORTUNITY": '#1CBEC3',
    "QUALIFICATION": '#EBDA25',
    "NEGOTIATION": '#94C31C',
    "CLOSED WON": '#075F18 ',
    "CLOSED LOST": '#CA1D1F',
    new: '#FF2400',
    tagtest: '#ffff00',
    assigning: '#E0115F',
    leading: '#4e1609',
    processing: '#ffa500',
    vddafv: '#ff004f',
    vfvfavtq: '#ff5a36',
    active: '#7f1734',
    details: '#66ff00',
    created: '#880808',
    staging: '#191970',
    exist: '#191970',
    tagest: '#954535',
  };

  const colorTag = () => {
    setTagsColor(colorMap[tags] || '#665d1e'); // Default color if tag is not found
  };

  // Corrected hex to rgba conversion
  const hexToRgba = (hex: string, opacity: number) => {
    let r = 0, g = 0, b = 0;
    // Handle shorthand hex (e.g. #abc)
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } 
    // Handle full hex (e.g. #aabbcc)
    else if (hex.length === 7) {
      r = parseInt(hex[1] + hex[2], 16);
      g = parseInt(hex[3] + hex[4], 16);
      b = parseInt(hex[5] + hex[6], 16);
    } else if (hex === 'red') {
      // Manually handle known color names like 'red'
      r = 255;
      g = 0;
      b = 0;
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    tags ? (
      <Chip
        label={tags}
        key={tags}
        sx={{
          backgroundColor: hexToRgba(tagsColor, 0.1), // 10% opacity fill
          borderRadius: '4px',
          fontSize: '12px',
          height: '20px',
          width: '130px',
          color: tagsColor, // Solid text color
          border: `2px solid ${tagsColor}`, // Solid border color
          marginLeft: '5px',
          fontWeight: '500',
          pb: '2px'
        }}
      />
    ) : null
  );
};
