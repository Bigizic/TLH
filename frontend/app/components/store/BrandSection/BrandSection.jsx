import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./BrandSection.css";

const blogo1 = "/logo_.png";

export const logoData = [
  {
    name: "logo 1",
    img: blogo1,
  },
  {
    name: "logo 2",
    img: blogo1,
  },
  {
    name: "logo 3",
    img: blogo1,
  },
  {
    name: "logo 4",
    img: blogo1,
  },
  {
    name: "logo 5",
    img: blogo1,
  },
  {
    name: "logo 6",
    img: blogo1,
  },
  {
    name: "logo 7",
    img: blogo1,
  },
  {
    name: "logo 8",
    img: blogo1,
  },
];

const BrandSection = (props) => {
  const { images, slidesToShow=2 } = props;
  let settings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    arrows: false,
    speed: 8000,
    pauseOnHover: false,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: slidesToShow,
        },
      },
    ],
  };
  const logoImages = images ? images : logoData;
  return (
    <>
      <section className="brand-section">
        <div className="container">
          <div className="brand-row-wrapper" data-aos="fade-up">
            <Slider {...settings}>
              {logoImages.map((d, index) => (
                <a className="inner_img" href="#" key={index}>
                  <img src={d.img} alt={d.name}></img>
                </a>
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </>
  );
};

export default BrandSection;
