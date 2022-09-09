import { useContext, useState } from 'react';

import { DataContext } from '~/store/GlobalState';
import SearchItem from './SearchItem';
import { getData } from '~/utils/fetchData';
import Link from 'next/link';

const Search = () => {
  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState([]);

  const handleChangeInput = async (e) => {
    setKeywords(e.target.value);
    if (keywords) {
      const res = await getData(
        `product?limit=${6}&&category=all&sort=&title=${keywords}`,
      );
      if (res.err)
        return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
      setResult(res.products);
    }
  };

  return (
    <div className="d-flex flex-grow-1 position-relative">
      <form className="d-flex flex-grow-1" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          name="keywords"
          value={keywords}
          onChange={handleChangeInput}
        />
        <Link href={`/products?search=${keywords}`}>
          <button className="btn btn-outline-success" type="submit">
            Search
          </button>
        </Link>
      </form>
      <ul className="list-group top-100 mt-1 position-absolute w-100">
        {result.length > 0 &&
          keywords.length > 0 &&
          result.map((result, index) => (
            <SearchItem key={index} result={result} setKeywords={setKeywords} />
          ))}
      </ul>
    </div>
  );
};

export default Search;
