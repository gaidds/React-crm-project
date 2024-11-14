import React, { FC, useState } from 'react';
import { PaginationProps } from './types';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import { MenuItem } from '@mui/material';
import { FabLeft, FabRight } from '../../styles/CssStyled';
import {
  PageNum,
  PageNimContainer,
  PerPageSelect,
  selectOpenIconStyles,
  PaginationContainer,
  selectPagesIconStyles,
} from './styled';

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  recordsPerPage,
  handlePageChange,
  handleSelectChange,
}) => {
  const [selectOpen, setSelectOpen] = useState(false);

  const recordsList = [
    { pages: 10, text: '10 Records per page' },
    { pages: 20, text: '20 Records per page' },
    { pages: 30, text: '30 Records per page' },
    { pages: 40, text: '40 Records per page' },
    { pages: 50, text: '50 Records per page' },
  ];

  const handlePreviousPage = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  return (
    <PaginationContainer>
      <PerPageSelect
        value={recordsPerPage}
        onChange={(e: any) => handleSelectChange(e)}
        open={selectOpen}
        onOpen={() => setSelectOpen(true)}
        onClose={() => setSelectOpen(false)}
        className="custom-select"
        onClick={() => setSelectOpen(!selectOpen)}
        IconComponent={() => (
          <div
            onClick={() => setSelectOpen(!selectOpen)}
            className="custom-select-icon"
          >
            {selectOpen ? (
              <FiChevronUp style={selectOpenIconStyles} />
            ) : (
              <FiChevronDown style={selectOpenIconStyles} />
            )}
          </div>
        )}
      >
        {recordsList.map((item, i) => (
          <MenuItem key={i} value={item.pages}>
            {item.text}
          </MenuItem>
        ))}
      </PerPageSelect>

      <PageNimContainer>
        <FabLeft onClick={handlePreviousPage} disabled={currentPage === 1}>
          <FiChevronLeft style={selectPagesIconStyles} />
        </FabLeft>
        <PageNum>
          {currentPage} of {totalPages}
        </PageNum>
        <FabRight
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <FiChevronRight style={selectPagesIconStyles} />
        </FabRight>
      </PageNimContainer>
    </PaginationContainer>
  );
};

export default Pagination;
