import React, { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookie from 'js-cookie';

import { DataContext } from '~/store/GlobalState';
import Image from 'next/image';
import Search from './Search/Search';

function Navbar() {
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { auth, cart, categories } = state;

  const isActive = (r) => {
    if (r === router.pathname) {
      return 'active';
    }
    return '';
  };

  const handleLogout = () => {
    Cookie.remove('refreshToken', {
      path: 'api/auth/accessToken',
    });
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'AUTH', payload: {} });
    dispatch({ type: 'NOTIFY', payload: { sucess: 'Logged out!' } });
    return router.push('/');
  };

  const adminRouter = () => (
    <>
      <li data-bs-dismiss="offcanvas" aria-label="Close">
        <Link href="/users">
          <a className="dropdown-item">Users</a>
        </Link>
      </li>

      <li data-bs-dismiss="offcanvas" aria-label="Close">
        <Link href="/create">
          <a className="dropdown-item">Products</a>
        </Link>
      </li>
      <li data-bs-dismiss="offcanvas" aria-label="Close">
        <Link href="/categories">
          <a className="dropdown-item">Categories</a>
        </Link>
      </li>
    </>
  );

  const loggedRouter = () => (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          src={auth.user.avatar}
          alt={auth.user.avatar}
          style={{
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            transform: 'translateY(-3px)',
            marginRight: '3px',
          }}
        />
        {auth.user.name}
      </a>

      <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
        <li data-bs-dismiss="offcanvas" aria-label="Close">
          <Link href="/profile">
            <a className="dropdown-item">Profile</a>
          </Link>
        </li>
        {auth.user.role === 'admin' && adminRouter()}
        <div className="dropdown-divider" />
        <button
          className="dropdown-item"
          onClick={handleLogout}
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        >
          Logout
        </button>
      </ul>
    </li>
  );

  const ProductCategories = () => (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Product Categories
      </a>

      <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
        <li data-bs-dismiss="offcanvas" aria-label="Close">
          <Link href="/products">
            <a className="dropdown-item">All Products</a>
          </Link>
        </li>
        {categories.map((category, index) => (
          <li key={index} data-bs-dismiss="offcanvas" aria-label="Close">
            <Link href={`/products?search=all&category=${category._id}`}>
              <a className="dropdown-item">{category.name}</a>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );

  return (
    <nav className="navbar navbar-expand-lg bg-light fixed-top">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">
            <div
              style={{ width: '150px', height: '50px', position: 'relative' }}
            >
              <Image src="/assets/images/logo.svg" layout="fill" alt="logo" />
            </div>
          </a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Menu
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <Search/>
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              {ProductCategories()}
              <li
                className="nav-item"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              >
                <Link href="/cart">
                  <a
                    className={`nav-link ${isActive('/cart')}`}
                    aria-current="page"
                  >
                    <i className="position-relative fa-solid fa-cart-shopping p-1 ">
                      <span
                        className="position-absolute top-0 translate-middle badge rounded-pill"
                        style={{ background: '#ed143dc2' }}
                      >
                        {cart.length}
                      </span>
                    </i>
                    Cart
                  </a>
                </Link>
              </li>
              {Object.keys(auth).length === 0 ? (
                <li
                  className="nav-item"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  <Link href="/signin">
                    <a
                      className={`nav-link ${isActive('/signin')}`}
                      aria-current="page"
                    >
                      <i className="fa-solid fa-user" />
                      Sign in
                    </a>
                  </Link>
                </li>
              ) : (
                loggedRouter()
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
