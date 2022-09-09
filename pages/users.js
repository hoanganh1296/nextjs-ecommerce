import Head from 'next/head';
import Image from 'next/image';
import { useContext } from 'react';
import { DataContext } from '~/store/GlobalState';
import Link from 'next/link';

function Users() {
  const { state, dispatch } = useContext(DataContext);
  const { users, auth, modal } = state;

  if (!auth.user) return null;
  return (
    <div className="table-responsive position-relative">
    <Head>
      <title>Users</title>
    </Head>
      <table className="table table-striped table-hover" >
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col">Avatar</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Admin</th>
            <th scope="col">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user._id} style={{ cursor: 'pointer' }}>
              <th scope="row">{index + 1}</th>
              <td>{user._id}</td>
              <td>
                <Image
                  src={user.avatar}
                  alt={user.avatar}
                  width={30}
                  height={30}
                  style={{
                    overflow: 'hidden',
                  }}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td className="mx-auto">
                {user.role === 'admin' ? (
                  user.root ? (
                    <i className="fa-solid fa-check text-success"> Root</i>
                  ) : (
                    <i className="fa-solid fa-check text-success"> Admin</i>
                  )
                ) : (
                  <i className="fas fa-times text-danger"></i>
                )}
              </td>
              <td>
                <Link
                  href={
                    (auth.user.root && auth.user.email) || user.email
                      ? `/edit_user/${user._id}`
                      : '#!'
                  }
                >
                  <a>
                    <i className="fas fa-edit text-info me-2" title="Edit"></i>
                  </a>
                </Link>
                {auth.user.root && auth.user.email !== user.email ? (
                  <i
                    className="fas fa-trash-alt text-danger ms-2"
                    title="Remove"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() =>
                      dispatch({
                        type: 'ADD_MODAL',
                        payload: [
                          {
                            data: users,
                            id: user._id,
                            title: user.name,
                            type: 'ADD_USERS',
                          },
                        ],
                      })
                    }
                  ></i>
                ) : (
                  <i
                    className="fas fa-trash-alt text-danger ms-2"
                    title="Remove"
                  ></i>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
