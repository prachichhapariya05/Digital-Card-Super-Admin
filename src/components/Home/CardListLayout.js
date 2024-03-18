import React from 'react';
import NavbarSupAdmin from './NavbarSupAdmin';

const CardListLayout = ({ children }) => {
  return (
    <div>
      <NavbarSupAdmin />
      {children}
    </div>
  );
};

export default CardListLayout;
