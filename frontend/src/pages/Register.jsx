import { Link,useNavigate } from "react-router-dom"
import Footer from "../components/Footer"
import { useState } from 'react'
import axios from 'axios'


const Register = () => { 

  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [error,setError]=useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    try{
      const res = await axios.post("/api/auth/register",{username,email,password})
      setUsername(res.data.username)
      setEmail(res.data.email)
      setPassword(res.data.password)
      setError(false)
      navigate('/login')
      
      
    }
    catch(err){
      setError(true)
      console.log(err)
    }
  }
 

  // console.log(username)
  // console.log(email)
  // console.log(password)

  return (
    <>
    <div className='flex items-center justify-between px-6 md:px-[200px] py-4'>
      <h1 className='text-xl font-extrabold'><Link to="/">Blog Market</Link></h1>
      <h3><Link to="/login">Login</Link></h3>
    </div> 
      <div className="w-full flex justify-center items-center h-[80vh] ">
        <div className="flex flex-col justify-center items-center space-y-4 w-[80%] md:w-[25%] ">
          <h1 className="text-xl font-bold text-left">Create an account</h1>
            <input onChange={(e)=>setUsername(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 outline-0 rounded-md hover:border-black" type="text" placeholder="Enter Your Username"/>
            <input onChange={(e)=>setEmail(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 outline-0 rounded-md hover:border-black" type="text" placeholder="Enter Your Email"/>
            <input onChange={(e)=>setPassword(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 outline-0 rounded-md hover:border-black" type="password" placeholder="Enter Your Password"/>
            <button onClick={handleRegister} className="w-full px-4 py-4 text-lg font-bold hover:bg-black text-white rounded-sm bg-gray-800">Register</button>
            {error && <p className="text-red-500">Something went wrong</p>}
            <div className="flex justify-center items-center space-x-3">
            <p>Already have and account?</p>
            <p className="text-gray-500 hover:text-black"><Link to="/login">Login</Link></p>
            </div>
        </div>
      </div>
      <Footer/> 
    </>
  )
}

export default Register