import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
       <div className='text-2xl text-center pt-8 border-t'>
         <Title text1={'ABOUT'} text2={'US'}/>
       </div>

       <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img  className='w-full md:max-w-[450px]' src={assets.about_img} alt=''/>
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray 600'>
              <p>Forever was born out of a passion meets our klhh adj elhl ejhfehjf jfehjfh jeej ejfhje ejfkje ejfe ek egk ejfjke ejfe edke hd whd khb jhevdjq hje</p>
              <p>since our inception,we've worked tirelessly meets our klhh adj elhl ejhfehjf jfehjfh jeej ejfhje ejfkje ejfe ek egk ejfjke ejfe edke hd whd khb jhevdjq hje</p>
              <b className='text-gray-800'>Our Mission</b>
              <p>Our mission at forever is to meets our klhh adj elhl ejhfehjf jfehjfh jeej ejfhje ejfkje ejfe ek egk ejfjke ejfe edke hd whd khb jhevdjq hje</p>
          </div>
       </div>

       <div className='text-4xl py-4 '>
         <Title text1={'WHY'} text2={'CHOOSE US'}/>
       </div>

       <div className='flex flex-col md:flex-row text-sm mb-20'>
         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
           <b>Quality Assurance:</b>
           <p className='text-gray-600'>We maticulously select and met each product to ensure it meets our klhh adj elhl ejhfehjf jfehjfh jeej ejfhje ejfkje ejfe ek egk ejfjke ejfe edke hd whd khb jhevdjq hje </p>
         </div>
         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
           <b>Convinience:</b>
           <p className='text-gray-600'>With our user friendly interface meets our klhh adj elhl ejhfehjf jfehjfh jeej ejfhje ejfkje ejfe ek egk ejfjke ejfe edke hd whd khb jhevdjq hje </p>
         </div>
         <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
           <b>Exceptional Customer Service:</b>
           <p className='text-gray-600'>Our team of dedicated professionals is here meets our klhh adj elhl ejhfehjf jfehjfh jeej ejfhje ejfkje ejfe ek egk ejfjke ejfe edke hd whd khb jhevdjq hje </p>
         </div>
       </div>

       <NewsLetterBox/>
      
    </div>
  )
}

export default About
