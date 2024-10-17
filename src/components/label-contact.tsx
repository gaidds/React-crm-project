import React, { useEffect, useState } from 'react';
import { Chip } from '@mui/material';

export const LabelContact = (props: any) => {
  const { tags } = props;
  const [tagsColor, setTagsColor] = useState('#665d1e');

  useEffect(() => {
    colorTag();
  }, [tags]);

  const colorMap: { [key: string]: string } = {
    'LEAD': '#FF7300',
    'CLIENT': '#2D2298',
  };

  const colorTag = () => {
    setTagsColor(colorMap[tags] || '#665d1e'); // Default color if tag is not found
  };

  // Corrected hex to rgba conversion
  const hexToRgba = (hex: string, opacity: number) => {
    let r = 0,
      g = 0,
      b = 0;
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

  return tags ? (
    <Chip
      label={tags}
      key={tags}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: hexToRgba(tagsColor, 0.1), // 10% opacity fill
        borderRadius: '4px',
        fontSize: '12px',
        height: '20px',
        width: '130px',
        color: tagsColor, // Solid text color
        border: `2px solid ${tagsColor}`, // Solid border color
        marginLeft: '5px',
        fontWeight: '500',
        p: '4px',
        overflow: 'hidden',
      }}
    />
  ) : null;
};