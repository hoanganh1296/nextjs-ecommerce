import React from 'react';

import Navbar from './Navbar';
import Notify from './Notify';
import Modal from './Modal';
import Footer from './Footer';
import Header from './Header';
import Newsletter from './Newsletter';

function Layout({ children }) {
  return (
    <div className="container-fluid">
      <Header />
      <Notify />
      <Modal />
      <div className="container" style={{marginTop:"90px"}}>
      {children}
      </div>
      <Newsletter/>
      <Footer />
    </div>
  );
}

export default Layout;
