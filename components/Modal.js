import { useContext } from 'react';
import { DataContext } from '~/store/GlobalState';
import { deleteItem } from '~/store/Actions';
import { deleteData } from '~/utils/fetchData';

function Modal() {
  const { state, dispatch } = useContext(DataContext);
  const { modal, auth } = state;

  const deleteUser = (item) => {
    dispatch(deleteItem(item.data, item.id, item.type));
    deleteData(`user/${item.id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };

  const deleteCategory = (item) => {
    deleteData(`categories/${item.id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      dispatch(deleteItem(item.data, item.id, item.type));
      return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };

  const deleteProduct = (item) => {
    dispatch({ type: 'NOTIFY', payload: { loading: true } });
    deleteData(`product/${item.id}`, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
    });
  };

  const handleSubmit = () => {
    if (modal.length !== 0) {
      for (const item of modal) {
        if (item.type === 'ADD_CART') {
          dispatch(deleteItem(item.data, item.id, item.type));
        }
        if (item.type === 'ADD_USERS') deleteUser(item);
        if (item.type === 'ADD_CATEGORIES') deleteCategory(item);
        if (item.type === 'DELETE_PRODUCT') deleteProduct(item);
      }
    }

    dispatch({ type: 'ADD_MODAL', payload: [] });
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-capitalize" id="exampleModalLabel">
              {modal.length !== 0 && modal[0].title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">Do you want to delete this item?</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleSubmit}
            >
              Yes
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;