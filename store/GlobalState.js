import { createContext, useReducer, useEffect } from 'react';
import reducers from './Reducers';
import { getData } from '~/utils';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = {
    notify: {},
    auth: {},
    cart: [],
    modal: [],
    orders: [],
    users: [],
    categories: [],
    related_products: [],
  };
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart, auth } = state;

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');
    if (firstLogin) {
      // get accessToken when reload page
      getData('auth/accessToken').then((res) => {
        if (res.err) return localStorage.removeItem('firstLogin');

        dispatch({
          type: 'AUTH',
          payload: {
            token: res.accessToken,
            user: res.user,
          },
        });
      });
    }
    // get categories when reload page
    getData('categories').then((res) => {
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

      dispatch({
        type: 'ADD_CATEGORIES',
        payload: res.categories,
      });
    });
  }, []);

  useEffect(() => {
    const __next__cart01__ = JSON.parse(
      localStorage.getItem('__next__cart01__'),
    );

    if (__next__cart01__)
      dispatch({ type: 'ADD_CART', payload: __next__cart01__ });
  }, []);

  useEffect(() => {
    localStorage.setItem('__next__cart01__', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (auth.token) {
      getData('order', auth.token).then((res) => {
        if (res.err)
          return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
        dispatch({ type: 'ADD_ORDERS', payload: res.orders });
      });

      if (auth.user.role === 'admin') {
        getData('user', auth.token).then((res) => {
          if (res.err)
            return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
          dispatch({ type: 'ADD_USERS', payload: res.users });
        });
      }
    } else {
      dispatch({ type: 'ADD_ORDERS', payload: [] });
      dispatch({ type: 'ADD_USERS', payload: [] });
    }
  }, [auth.token]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};
