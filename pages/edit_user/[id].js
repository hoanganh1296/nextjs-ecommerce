import Head from 'next/head';
import { useContext, useState, useEffect } from 'react';
import { DataContext } from '~/store/GlobalState';
import { useRouter } from 'next/router';
import { patchData } from '~/utils';
import { updateItem } from '~/store/Actions';

function EditUser() {
  const { state, dispatch } = useContext(DataContext);
  const { auth, users } = state;

  const router = useRouter();
  const { id } = router.query;

  const [editUser, setEditUser] = useState([]);
  const [checkAdmin, setCheckAdmin] = useState(false);
  const [num, setNum] = useState(0);

  useEffect(() => {
    users.map((user) => {
      if (user._id === id) {
        setEditUser(user);
        setCheckAdmin(user.role === 'admin' ? true : false);
      }
    });
  }, [users, id]);

  const handleCheck = () => {
    setCheckAdmin(!checkAdmin);
    setNum(num + 1);
  };

  const handleSubmit = () => {
    let role = checkAdmin ? 'admin' : 'user';
    if (num % 2 !== 0) {
      dispatch({ type: 'NOTIFY', payload: { loading: true } });
      patchData(`user/${editUser._id}`, { role }, auth.token).then((res) => {
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
        dispatch(
          updateItem(
            users,
            editUser._id,
            {
              ...editUser,
              role,
            },
            'ADD_USERS',
          ),
        );
        return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
      });
    }
  };

  return (
    <div className="edit_user my-3">
      <Head>
        <title>Edit User</title>
      </Head>

      <div>
        <button className="btn btn-dark" onClick={() => router.back()}>
          <i className="fas fa-long-arrow-alt-left" aria-hidden="true"></i> Go back
        </button>
      </div>

      <div className="col-md-4 mx-auto my-4">
        <h2 className="text-uppercase text-secondary">Edit User</h2>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            className="form-control"
            type="text"
            id="name"
            defaultValue={editUser.name}
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            className="form-control"
            type="text"
            id="email"
            defaultValue={editUser.email}
            disabled
          />
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="isAdmin"
            style={{ cursor: 'pointer' }}
            checked={checkAdmin}
            onChange={handleCheck}
          />
          <label htmlFor="isAdmin" className="form-check-label">
            isAdmin
          </label>
        </div>

        <button className="btn btn-dark" onClick={handleSubmit}>
          Update
        </button>
      </div>
    </div>
  );
}

export default EditUser;
