import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const SearchItem = (props) => {
  const { result, setKeywords } = props;

  return (
    <Link href={`/product/${result._id}`}>
      <a
        className="d-flex list-group-item list-group-item-action p-0"
        onClick={() => setKeywords('')}
      >
        <Image src={result.images[0].url} alt="" width="80px" height="80px" />
        <div className="d-flex p-3 align-items-center justify-content-between flex-fill">
          <h6 className="text-capitalize">{result.title}</h6>
          <span className="text-danger">${result.price}</span>
        </div>
      </a>
    </Link>
  );
};

export default SearchItem;
