import React from 'react';

const Newsletter = () => {
  return (
    <div className="container newsletter-wrapper">
      <div className="row">
        <div className="col-sm-7 newsletter-content">
          Get timely updates from your favorite products.
        </div>
        <div className="col-sm-5">
          <div className="input-group input-group-sm px-4">
            <input className="form-control" placeholder="Your email" />
            <button className="btn btn-danger">
              <i className="fa-solid fa-paper-plane fs-5"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
