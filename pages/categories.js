import Head from 'next/head';
import { useContext, useState,useEffect } from 'react';
import { DataContext } from '~/store/GlobalState';
import { updateItem } from '~/store/Actions';
import { postData, putData, deleteData } from '~/utils/fetchData';
import {useRouter} from "next/router"

function Categories() {
  const [name, setName] = useState('');
  const { state, dispatch } = useContext(DataContext);
  const { categories, auth } = state;
  const router = useRouter()

  const [id, setId] = useState('');

  const handleChange = (e) => {
    setName(e.target.value);
    if (!name) {
      setId('');
    }
  };

  const createCategory = async () => {
    if (auth.user.role !== 'admin')
      return dispatch({
        type: 'NOTIFY',
        payload: { error: 'Authentication is not valid' },
      });

    if (!name)
      return dispatch({
        type: 'NOTIFY',
        payload: { error: "Name can't be left blank" },
      });

    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    let res;
    if (id) {
      res = await putData(`categories/${id}`, { name }, auth.token);
      if (res.err)
        return dispatch({
          type: 'NOTIFY',
          payload: { error: res.err },
        });
      //when create a new category success, dispatch action update categories state
      dispatch(updateItem(categories, id, res.newCategory, 'ADD_CATEGORIES'));
    } else {
      res = await postData('categories', { name }, auth.token);
      if (res.err)
        return dispatch({
          type: 'NOTIFY',
          payload: { error: res.err },
        });
      //when create a new category success, dispatch action update categories state
      dispatch({
        type: 'ADD_CATEGORIES',
        payload: [...categories, res.newCategory],
      });
    }
    setName('');
    setId('');
    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
  };

  const handleEditCategory = async (category) => {
    setId(category._id);
    setName(category.name);
  };
  

  useEffect(() => {
    if (auth && auth.user?.role !== 'admin') router.push('/');
  }, [auth]);

  return (
    <div className="col-md-6 mx-auto my-3" style={{height:"60vh"}}>
      <Head>
        <title>Categories</title>
      </Head>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new category"
          name="name"
          value={name}
          onChange={handleChange}
        />
        <button className="btn btn-secondary ml-1" onClick={createCategory}>
          {id && name ? 'Update' : 'Create'}
        </button>
      </div>

      {categories.map((category) => (
        <div key={category._id} className="card my-2 text-capitalize">
          <div className="card-body d-flex justify-content-between">
            {category.name}
            <div style={{ cursor: 'pointer' }}>
              <i
                className="fas fa-edit me-2 text-info fs-5"
                onClick={() => handleEditCategory(category)}
              ></i>

              <i
                className="fas fa-trash-alt text-danger fs-5"
                title="Remove"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() =>
                  dispatch({
                    type: 'ADD_MODAL',
                    payload: [{
                      data: categories,
                      id: category._id,
                      title: category.name,
                      type: 'ADD_CATEGORIES',
                    }],
                  })
                }
              ></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Categories;
