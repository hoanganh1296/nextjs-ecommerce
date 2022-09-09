import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect } from 'react';
import Cookie from 'js-cookie';

import { DataContext } from '~/store/GlobalState';
import { postData } from '~/utils';

function SignIn() {
  const initialState = { email: '', password: '' };
  const [userData, setUserData] = useState(initialState);
  const { email, password } = userData;

  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const router = useRouter();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    const res = await postData('auth/login', userData);
    if (res.err)
      return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
    dispatch({ type: 'NOTIFY', payload: { success: res.msg } });

    dispatch({
      type: 'AUTH',
      payload: { token: res.accessToken, user: res.user },
    });

    Cookie.set('refreshToken', res.refreshToken, {
      path: 'api/auth/accessToken',
      expires: 7,
    });

    localStorage.setItem('firstLogin', true);
  };

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push('/');
  }, [auth]);

  return (
    <div style={{height:"400px"}}>
      <Head>
        <title>Sign in Page</title>
      </Head>
      <form
        className="mx-auto"
        style={{ maxWidth: '500px', margin: '120px 0 0px' }}
        onSubmit={handleSubmit}
      >
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="email"
            name="email"
            value={email}
            onChange={handleChangeInput}
          />
          <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            placeholder="password"
            value={password}
            onChange={handleChangeInput}
          />
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
        </div>
        <button type="submit" className="btn btn-dark w-100">
          Login
        </button>
        <p className="my-2">
          You don&#39;t have an account?
          <Link href="/register">
            <a className="ms-2" style={{ color: 'crimson' }}>
              Register Now
            </a>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignIn;
