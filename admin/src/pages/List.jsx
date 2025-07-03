import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify';
import { TrashIcon } from '@heroicons/react/24/outline';


const List = ({token}) => {

  const [list,setList] = useState([])

  const fetchList = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/product/list')
       // console.log(response.data)

         if(response.data.success) {
       setList(response.data.products);
       } else {
        toast.error(response.data.message)
       }
      } catch (error) {
        console.log(error);
        toast.error(error.message)
      }
  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/product/remove',{id},{headers:{token}})

      if(response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  },[list])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* List Table Title */}
           
          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border'>
            <b>Image</b>
            <b>Name</b>
            <b>Category</b>
            <b>Price</b>
            <b className='text-center'>Remove</b>
          </div> 

          { /* Product List*/ }

          {
            list.map((item,index) => (
              <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
                 <img className='w-12' src={item.image[0]} alt=''/>
                 <p>{item.name}</p>
                 <p>{item.category}</p>
                 <p>{currency}{item.price}</p>
                 <div className='flex justify-center'>
                   <button onClick={() => removeProduct(item._id)} aria-label="Delete"
                   className='p-2 rounded text-red-400 '><TrashIcon className="h-5 w-5" /></button>
                 </div>
              </div>
            ))
          }

      </div>
    </>
  )
}

export default List
