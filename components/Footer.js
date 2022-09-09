import React from 'react';

function Footer() {
  return (
    <div className="container-fluid bg-light py-3">
      <div className="container">
        <div className="row ">
          <div className="col-12 col-sm-12 col-md-4 p-3">
            <h1>
              <img className="img-thumbnail" src="/assets/images/logo.png" alt="logo" />
            </h1>
            <p className="my-3">
              There are many variations of passages of Lorem Ipsum available, but
              the majority have suffered alteration in some form, by injected
              humour, or randomised words which don’t look even slightly
              believable.
            </p>
            <div className="d-flex">
              <div className="social-icon" style={{ backgroundColor: '#3B5999' }}>
                <i className="fa-brands fa-facebook"></i>
              </div>
              <div className="social-icon" style={{ backgroundColor: '#E4405F' }}>
                <i className="fa-brands fa-instagram"></i>
              </div>
              <div className="social-icon" style={{ backgroundColor: '#55ACEE' }}>
                <i className="fa-brands fa-twitter"></i>
              </div>
              <div className="social-icon" style={{ backgroundColor: '#E60023' }}>
                <i className="fa-brands fa-pinterest"></i>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4 p-3">
            <h3>Useful Links</h3>
            <ul className="footer-useful-list">
              <li>Home</li>
              <li>Cart</li>
              <li>Accessories</li>
              <li>My Account</li>
              <li>Order Tracking</li>
              <li>Wishlist</li>
              <li>Wishlist</li>
              <li>Terms</li>
            </ul>
          </div>
          <div className="col-12 col-sm-6 col-md-4 p-3">
            <h3>Contact</h3>
            <div className="footer-contact-item">
              <i className="fa-solid fa-location-dot"></i> 622 Dixie Path , South
              Tobinchester 98336
            </div>
            <div className="footer-contact-item">
              <i className="fa-solid fa-phone"></i> +1 234 56 78
            </div>
            <div className="footer-contact-item">
              <i className="fa-solid fa-envelope"></i>contact@.dev
            </div>
            <img style={{width:"50%"}} src="https://i.ibb.co/Qfvn4z6/payment.png" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
