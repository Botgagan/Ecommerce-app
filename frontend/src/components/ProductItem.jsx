import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ShopContext } from "../context/ShopContext";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white rounded-md shadow-md p-4 hover:shadow-lg transition-shadow"
    >
      <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer block">
        <div className=" rounded-md">
          <img
            src={image[0]}
            alt=""
            className="hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">
          {currency}
          {price}
        </p>
      </Link>
    </motion.div>
  );
};

export default ProductItem;
