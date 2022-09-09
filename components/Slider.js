import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { useViewport } from '~/hooks/useViewport';
import { SmoothHorizontalScrolling } from '~/utils';

const Slider = (props) => {
  const { products, title } = props;

  const slidesRef = useRef();
  const slideRef = useRef();
  const [windowWidth] = useViewport();

  const handleScrollRight = () => {
    const maxScrollLeft =
      slidesRef.current.scrollWidth - slidesRef.current.clientWidth;

    if (slidesRef.current.scrollLeft < maxScrollLeft) {
      SmoothHorizontalScrolling(
        slidesRef.current,
        250,
        slideRef.current.clientWidth + 10,
        slidesRef.current.scrollLeft,
      );
    }
  };
  const handleScrollLeft = () => {
    if (slidesRef.current.scrollLeft > 0) {
      SmoothHorizontalScrolling(
        slidesRef.current,
        250,
        -slideRef.current.clientWidth - 10,
        slidesRef.current.scrollLeft,
      );
    }
  };

  return (
    <div className="slider-container">
      <h1 className="heading">{title}</h1>
      <div
        className="slides"
        ref={slidesRef}
        style={
          products && products.length > 0
            ? {
                gridTemplateColumns: ` repeat(${products.length}, ${
                  windowWidth >= 1200
                    ? '305px'
                    : windowWidth >= 992
                    ? '290px'
                    : windowWidth >= 768
                    ? '210px'
                    : '280px'
                })`,
              }
            : {}
        }
      >
        {products &&
          products.length > 0 &&
          products.map((product, index) => {
            return (
              <Link href={`/product/${product._id}`} key={index}>
                <div className="slide" ref={slideRef} to="">
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].url}
                    layout="responsive"
                    height="100%"
                    width="100%"
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="product-info">
                    <h5 className="text-capitalize" title={product.title}>
                      {product.title}
                    </h5>

                    <span className="text-danger fw-bold">{product.price}</span>
                  </div>
                </div>
              </Link>
            );
          })}
      </div>

      <div className="left-arrow" onClick={handleScrollLeft}>
        <i className="fa-solid fa-circle-left"></i>
      </div>

      <div className="right-arrow" onClick={handleScrollRight}>
        <i className="fa-solid fa-circle-right"></i>
      </div>
    </div>
  );
};

export default Slider;
