import styled from '@emotion/styled';
import { Box, Select, Stack, Typography } from '@mui/material';

export const PaginationContainer = styled(Stack)`
  flex-direction: row;
  gap: 8px;
  align-items=center;
`;

export const PerPageSelect = styled(Select)`
  & .MuiSelect-select {
    overflow: visible !important;
  }
`;

export const PageNimContainer = styled(Box)`
  border-radius: 7px;
  background-color: white;
  height: 40px;
  min-height: 40px;
  max-height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 4px;
  padding: 0px;
`;

export const PageNum = styled(Typography)`
  margin-right: 0;
  text-transform: lowercase;
  font-size: 15px;
  color: #1a3353;
  text-align: center;
`;

export const selectOpenIconStyles = { marginTop: '12px' };

export const selectPagesIconStyles = { height: '15px' };
