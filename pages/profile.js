import Head from 'next/head';
import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';

import { DataContext } from '~/store/GlobalState';
import valid from '~/utils/valid';
import { patchData } from '~/utils';
import { imageUpload } from '~/utils/handelImageUpload';

function Profile() {
  const initialState = {
    avatar: '',
    name: '',
    password: '',
    cfPassword: '',
  };
  const [data, setData] = useState(initialState);
  const { avatar, name, password, cfPassword } = data;

  const { state, dispatch } = useContext(DataContext);
  const { auth, notify, orders } = state;

  useEffect(() => {
    if (auth.user) setData({ ...data, name: auth.user.name });
  }, [auth.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dispatch({ type: 'NOTIFY', payload: {} });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (password) {
      const errMsg = valid(name, auth.user.email, password, cfPassword);
      if (errMsg)
        return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });
      updatePassword();
    }

    if (name !== auth.user.name || avatar) updateInfo();
  };

  const updatePassword = () => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    patchData('user/resetPassword', { password }, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };

  const updateInfo = async () => {
    let media;

    dispatch({ type: 'NOTIFY', payload: { loading: true } });

    if (avatar) media = await imageUpload([avatar]);

    patchData(
      'user',
      { name, avatar: avatar ? media[0].url : auth.user.avatar },
      auth.token,
    ).then((res) => {
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });

      dispatch({
        type: 'AUTH',
        payload: { token: auth.token, user: res.user },
      });
      dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file)
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'File does not exist' },
      });
    if (file.size > 1024 * 1024)
      // 1024kb * 1024kb =
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'The largest image size is 1mb' },
      });
    if (file.type !== 'image/jpeg' && file.type !== 'image/png')
      // 1024kb * 1024kb =
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Image format is incorrect' },
      });

    setData({ ...data, avatar: file });
  };

  if (!auth.user) return null;

  return (
    <div className="profile_page">
      <Head>
        <title>Profile</title>
      </Head>

      <section className="row text-secondary my-3">
        <div className="col-md-4">
          <h3 className="text-center text-uppercase">
            {auth.user.role === 'user' ? 'User Profile' : 'Admin Profile'}
          </h3>
          <div className="avatar">
            <img
              src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
              alt="avatar"
            />
            <span>
              <i className="fas fa-camera" />
              <p>Change</p>
              <input
                type="file"
                name="file"
                id="file_up"
                accept="image/*"
                onChange={changeAvatar}
              />
            </span>
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              className="form-control"
              type="text"
              name="name"
              value={name}
              id="name"
              placeholder="Your name"
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-control"
              type="email"
              name="email"
              defaultValue={auth.user.email}
              placeholder="Your email"
              disabled
              readOnly
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={password}
              placeholder="Your new password"
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="cfPassword">
              Confirm Password
            </label>
            <input
              className="form-control"
              type="password"
              name="cfPassword"
              value={cfPassword}
              placeholder="Confirm new password"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-info"
            disabled={notify.loading}
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </div>
        <div className="col-md-8 ">
          <h3 className="text-uppercase">Orders</h3>
          <div className="my-3 table-responsive">
            <table
              className="table table-bordered table-hover w-100 text-uppercase"
              style={{ minWidth: '600px', cursor: 'pointer' }}
            >
              <thead className="table-light font-weight-bold">
                <tr>
                  <td className="p-2">id</td>
                  <td className="p-2">date</td>
                  <td className="p-2">total</td>
                  <td className="p-2">delivered</td>
                  <td className="p-2">PAID</td>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2">
                      <Link href={`/order/${order._id}`}>{order._id}</Link>
                    </td>
                    <td className="p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">${order.total}</td>
                    <td className="p-2 text-center">
                      {order.delivered ? (
                        <i className="fa fa-check text-success"></i>
                      ) : (
                        <i className="fa fa-times text-danger"></i>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {order.paid ? (
                        <i className="fa fa-check text-success"></i>
                      ) : (
                        <i className="fa fa-times text-danger"></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
