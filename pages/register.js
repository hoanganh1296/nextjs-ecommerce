import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useContext, useEffect } from 'react';

import valid from '~/utils/valid';
import { DataContext } from '~/store/GlobalState';
import { postData } from '~/utils/fetchData';

function Register() {
  const initialState = { name: '', email: '', password: '', cfPassword: '' };
  const [userData, setUserData] = useState(initialState);
  const { name, email, password, cfPassword } = userData;

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
    const errMsg = valid(name, email, password, cfPassword);
    if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });
    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    const res = await postData('auth/register', userData);
    if (res.err)
      return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
    router.push("/signin")
    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
  };

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push('/');
  }, [auth]);

  return (
    <div style={{ height: '500px' }}>
      <Head>
        <title>Register Page</title>
      </Head>
      <form
        className="mx-auto"
        style={{ maxWidth: '500px', margin: '20px 0 0px' }}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="form-control"
            aria-describedby="name"
            name="name"
            value={name}
            onChange={handleChangeInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="InputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="InputEmail1"
            aria-describedby="emailHelp"
            name="email"
            value={email}
            onChange={handleChangeInput}
          />
          <div id="emailHelp" className="form-text">
            We&#39;ll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={password}
            onChange={handleChangeInput}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword2" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword2"
            name="cfPassword"
            value={cfPassword}
            onChange={handleChangeInput}
          />
        </div>
        <button type="submit" className="btn btn-dark w-100">
          Register
        </button>
        <p className="my-2">
          Already have an account?
          <Link href="/signin">
            <a className="ms-2" style={{ color: 'crimson' }}>
              Login Now
            </a>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
