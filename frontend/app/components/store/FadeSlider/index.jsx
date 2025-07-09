import React, { useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const FadeSlider = (props) => {
  const {
    dots,
    infinite,
    speed,
    slidesToShow,
    slidesToScroll,
    fade,
    autoplay,
    autoplaySpeed,
    children,
    nextArrow,
    prevArrow,
    arrows,
    swipeToSlide,
    // New prop to handle slide changes
    beforeChange
  } = props;

  // Create a ref for the Slider component
  const sliderRef = useRef(null);

  // Expose the slider's instance methods if needed, though beforeChange should be enough
  // React.useImperativeHandle(ref, () => ({
  //   slickGoTo: index => sliderRef.current.slickGoTo(index)
  // }));

  return (
    <Slider
      ref={sliderRef} // Assign the ref
      dots={dots}
      infinite={infinite}
      speed={speed}
      slidesToShow={slidesToShow}
      slidesToScroll={slidesToScroll}
      fade={fade}
      autoplay={autoplay}
      autoPlaySpeed={autoplaySpeed}
      nextArrow={nextArrow}
      prevArrow={prevArrow}
      arrows={arrows}
      swipeToSlide={swipeToSlide}
      touchThreshold={10}
      beforeChange={beforeChange} // Pass the beforeChange prop to react-slick
    >
      {children}
    </Slider>
  )
}

export default FadeSlider;