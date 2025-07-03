import React, { useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'

const Login = ({setToken}) => {

    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')

  const onSubmitHandler = async (e) => {
     try {
        e.preventDefault();
        const response = await axios.post(backendUrl+'/api/user/admin',{email,password})
        //console.log(response)
        if(response.data.success) {
           setToken(response.data.token)
        } else {
          toast.error(response.data.message)
        }
        
     } catch (error) {
         console.log(error)
         toast.error(error.message)
     }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white shadow-lg rounded-xl px-10 py-8 w-full max-w-sm">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6 tracking-tight">
          Admin Panel
        </h1>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input onChange={(e) => setEmail(e.target.value)} value={email}
              type="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition duration-200"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input onChange={(e) => setPassword(e.target.value)} value={password}
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-black hover:bg-gray-900 text-white font-semibold rounded-md transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
