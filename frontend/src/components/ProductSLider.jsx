import React, { useContext, useEffect, useRef, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const ProductSlider = () => {
  const { products } = useContext(ShopContext);
  const sliderContainerRef = useRef(null);
  const isHovered = useRef(false);

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    drag: true,
    slides: {
      perView: 5,
      spacing: 16,
    },
    breakpoints: {
      '(max-width: 1024px)': {
        slides: { perView: 4, spacing: 12 },
      },
      '(max-width: 768px)': {
        slides: { perView: 2, spacing: 10 },
      },
      '(max-width: 480px)': {
        slides: { perView: 2, spacing: 8 },
      },
    },
  });

  useEffect(() => {
    const container = sliderContainerRef.current;
    const handleMouseEnter = () => (isHovered.current = true);
    const handleMouseLeave = () => (isHovered.current = false);

    container?.addEventListener('mouseenter', handleMouseEnter);
    container?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container?.removeEventListener('mouseenter', handleMouseEnter);
      container?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (slider.current && !isHovered.current) {
        slider.current.next();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [slider]);

  return (
    <div className="mt-20 mb-10 text-center text-3xl">
      <Title text1={'FEATURED'} text2={'PRODUCTS'} />
      <p className="mb-5"></p>
      <div
        ref={(node) => {
          sliderRef(node);
          sliderContainerRef.current = node;
        }}
        className="keen-slider  cursor-grab active:cursor-grabbing"
      >
        {products.map((item, index) => (
          <div
            key={index}
            className="keen-slider__slide text-left text-white rounded overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <ProductItem
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;