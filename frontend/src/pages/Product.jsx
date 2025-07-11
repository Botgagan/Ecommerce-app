import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import CommentSection from '../components/CommentSection';
import axios from 'axios';

const Product = () => {

 const {productId} = useParams();
     //console.log(productId)
 const {products,currency,addToCart,backendUrl} = useContext(ShopContext);
 const [productData,setProductData] = useState(false);
 const [image,setImage] = useState('');
 const [size,setSize] = useState();

 const [commentCount, setCommentCount] = useState(0);

useEffect(() => {
  axios.get(backendUrl + `/api/comments/${productId}`).then((res) => {
    if (res.data.success) {
      setCommentCount(res.data.comments.length);
    }
  });
}, [productId]);

 const fetchProductData = async () => {
    
  products.map((item) => {
    if (item._id === productId) {
      setProductData(item);
      setImage(item.image[0]);
      //console.log(item);
      return null;  
    } 
  })
  
 }

 useEffect(() => {
    fetchProductData();
 },[productId,products])


  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
         
         {/* Product Images*/}
           <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
             <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item,index) => (
                  <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer'/>
                ))
              }

             </div>
             <div className='w-full sm:w-[80%]'>
               <img className='w-full h-auto' src={image} alt=''/>

             </div>
           </div>
            {/*  Product Info */}
            <div className='flex-1'>
              <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
               <div className='flex items-center gap-1 mt-2'>
                 <img className='w-3' src={assets.star_icon} alt="" />
                 <img className='w-3' src={assets.star_icon} alt="" />
                 <img className='w-3' src={assets.star_icon} alt="" />
                 <img className='w-3' src={assets.star_icon} alt="" />
                 <img className='w-3' src={assets.star_dull_icon} alt="" />
                 <p className='pl-2'>({commentCount})</p>
               </div>
               <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
               <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
               <div className='flex flex-col gap-4 my-8'>
                  <p>Select:Size</p>
                  <div className='flex gap-2'>
                    {productData.sizes.map((item,index) => (
                      <button onClick={() => setSize(item)} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-black' : ''}`} key={index}>{item}</button>
                    ))}
                  </div>
               </div>
                <button onClick={() => addToCart(productData._id,size) } className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
                <hr className='mt-8 sm:w-4/5'/>
                <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                   <p>100% Original Product.</p>
                   <p>Cash on delivery is avaliable on this product.</p>
                   <p>Easy return and exchange policy within 7 days.</p>
                </div>
            </div>
      </div>

       {/* Description & Comments Section */}
<div className="mt-20 border-t pt-10">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
    {/* Description */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Product Description</h2>
      <p className="text-gray-600 leading-relaxed mb-3">
        An e-commerce website is an online platform that allows users to browse, purchase, and review products with ease.
      </p>
      <p className="text-gray-600 leading-relaxed">
        These platforms typically showcase products with detailed information, images, and user feedback to enhance the shopping experience.
      </p>
    </div>

    {/* Comments */}
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
      <CommentSection productId={productId} />
    </div>

  </div>

  {/* Related Products */}
  <div className="mt-16">
    <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
  </div>
</div>
    </div>
  ) : <div className='opacity-0'> </div>
}

export default Product
