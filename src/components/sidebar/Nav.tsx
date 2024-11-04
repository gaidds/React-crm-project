import { FC } from 'react';
import { StyledListItemButton } from '../../styles/CssStyled';
import { ListItem } from '@mui/material';
import './styles.css';
import { NavProps } from './types';

const Nav: FC<NavProps> = ({ screen, open, name, icone, handleClick }) => {
  return (
    <ListItem key={name} disablePadding>
      <StyledListItemButton
        onClick={() => handleClick(name)}
        selected={screen === name}
        className={`nav-btn ${screen === name && 'selected-nav-btn'}`}
      >
        <div className="nav-icon-container">{icone}</div>
        {open && <span className="nav-text">{name}</span>}
      </StyledListItemButton>
    </ListItem>
  );
};

export default Nav;
