import React from 'react';

export const Promo = () => {
  return (
    <div className="container promo-area">
      <div className="row">
        <div className="col-12 col-sm-3 col-md-3 col-lg-3">
          <div className="promo-item promo1">
            <i className="fa-solid fa-arrows-rotate promo-icon"></i>
            <span>30 Days Return Policy</span>
          </div>
        </div>
        <div className="col-12 col-sm-3 col-md-3 col-lg-3">
          <div className="promo-item promo2">
            <i className="fa-solid fa-truck promo-icon"></i>
            <span>Free shipping</span>
          </div>
        </div>
        <div className="col-12 col-sm-3 col-md-3 col-lg-3">
          <div className="promo-item promo3">
            <i className="fa-solid fa-lock promo-icon"></i>
            <span>Secured Payment</span>
          </div>
        </div>
        <div className="col-12 col-sm-3 col-md-3 col-lg-3">
          <div className="promo-item promo4">
            <i className="fa-solid fa-gift promo-icon"></i>
            <span>Exclusive Gifts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
