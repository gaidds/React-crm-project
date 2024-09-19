import React from "react";
import { Box, Button } from "@mui/material";

const ButtonsComponent = () => {
  return (
    <Box
      sx={{
        width: 300,
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        padding: 3,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height:'250px'
      }}
    >
      {/* Notes and Attachments buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#e0d8e8",
            color: "#000",
            borderRadius: "8px",
            padding: "10px 20px", // Butonların içindeki padding ayarlandı
            "&:hover": {
              backgroundColor: "#d5cadf",
            },
            boxShadow: "none",
          }}
        >
          Notes
        </Button>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "#fff",
            color: "#000",
            borderRadius: "8px",
            padding: "10px 20px", // Butonların içindeki padding ayarlandı
            border: "1px solid #ccc",
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
            boxShadow: "none",
          }}
        >
          Attachments
        </Button>
      </Box>
    </Box>
  );
};

export default ButtonsComponent;