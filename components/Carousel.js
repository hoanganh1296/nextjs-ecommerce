import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

const slides = [
  { imgUrl: '/assets/images/img-carousel/banner-1.jpg' },
  { imgUrl: '/assets/images/img-carousel/banner-2.jpg' },
  { imgUrl: '/assets/images/img-carousel/banner-3.jpg' },
  { imgUrl: '/assets/images/img-carousel/banner-4.jpg' },
];

const Carousel = ({ autoPlay }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const length = slides.length;

  const autoPlayRef = useRef();

  useEffect(() => {
    autoPlayRef.current = nextSlide;
  });

  useEffect(() => {
    const play = () => {
      autoPlayRef.current();
    };

    if (autoPlay) {
      const interval = setInterval(play, autoPlay * 1000);
      return () => clearInterval(interval);
    }
  }, [autoPlay]);

  const nextSlide = () => {
    setCurrentImg(currentImg === length - 1 ? 0 : currentImg + 1);
  };

  const prevSlide = () => {
    setCurrentImg(currentImg === 0 ? length - 1 : currentImg - 1);
  };

  if(!Array.isArray(slides) || slides.length <= 0){
    return null
  }

  return (
    <div className="container">
      <div className="slider">
        {slides.map((slider, index) => (
          <div
            key={index}
            className={
              index === currentImg ? 'slider-item active' : 'slider-item'
            }
          >
            {index === currentImg && (
              <Image
                className="slider-img"
                src={slider.imgUrl}
                alt=""
                layout="responsive"
                width={1100}
                height={500}
                priority
              />
            )}
          </div>
        ))}
        <div className="left-arrow" onClick={prevSlide}>
          <i className="fa-solid fa-circle-left"></i>
        </div>
        <div className="right-arrow" onClick={nextSlide}>
          <i className="fa-solid fa-circle-right"></i>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
