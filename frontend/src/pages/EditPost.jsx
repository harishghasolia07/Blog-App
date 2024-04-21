import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ImCross } from 'react-icons/im'
import { useEffect, useState, useContext } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import axios from 'axios'
// import { URL } from '../url'
import { UserContext } from '../context/UserContext'




const EditPost = () => {

    const postId = useParams().id;
    const {user} = useContext(UserContext)
    const navigate = useNavigate()
    const [title,setTitle]=useState("")
    const [desc,setDesc]=useState("")
    const [file,setFile]=useState(null)
    const [cat, setCat] = useState("")
    const [cats, setCats] = useState([])
    

    const fetchPost = async () => {
        try {
            const res = await axios.get("/api/posts/" + postId);
            setTitle(res.data.title)
            setDesc(res.data.desc)
            setFile(res.data.photo)
            setCats(res.data.categories)
            // setLoader(false)
        } catch (err) {
            console.log(err);
            // setLoader(true)
        }
    }

    useEffect(() => {
        fetchPost();
    }
    , [postId]);

    const addCategory = () => {
        let updatedCats = [...cats]
        updatedCats.push(cat)
        setCat("")
        setCats(updatedCats)
        console.log(updatedCats)
    }

    const deleteCategory = (i) => {
        console.log("Deleting category at index:", i);
        let updatedCats = [...cats];
        updatedCats.splice(i, 1); // Fix: Remove one element at index i
        setCats(updatedCats);
        console.log("Updated categories:", updatedCats);
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        const post={
            title,
            desc,
            username:user.username,
            userId:user._id,
            categories:cats
        }
        
        if(file){
            const data = new FormData()
            const filename = Date.now() + file.name;
            data.append("img",filename)
            data.append("file",file)
            post.photo = filename

            // Upload image
            try {
                const imgUpload = await axios.post("/api/upload",data)
                // console.log(imgUpload.data)
            } catch (err) {
                console.log(err)
            }
        }
        // Post Upload
        try{
            const res = await axios.put("/api/posts/"+postId,post,{withCredentials:true})
            navigate("/posts/post/"+res.data._id)
            console.log(res.data)
        }
        catch(err){ 
            console.log(err)
        }
    }
    

  return (
    <div>
        <Navbar />
        <div className='px-6 md:px-[200px] mt-8'>
        <h1 className='font-bold md:text-2xl text-xl'>Update a post</h1>
            <form className='w-full flex flex-col space-y-4 md:space-y-8 mt-4'>
                <input onChange={(e)=>setTitle(e.target.value)} value={title} type='text' placeholder='Enter a post title' className='px-4 py-2 outline-none'/>
                <input onChange={(e)=>setFile(e.target.files[0])} type='file' className='px-4 '/>
                <div className='flex flex-col'>
                    <div className='flex items-center space-x-1 md:space-x-8'>
                        <input value={cat} onChange={(e)=>setCat(e.target.value)} className='px-4 py-2 outline-none' placeholder='Enter post category' type='text'/>
                        <div onClick={addCategory} className='bg-black text-white px-4 py-2 font-semibold cursor-pointer '>Add</div>
                    </div>

                    {/* Categories */}
                    <div className='flex px-4 mt-3'>
                    {cats?.map((c,i)=>(
                        <div key={i} className='flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md'>
                        <p>{c}</p>
                        <p onClick={() => deleteCategory(i)} className='bg-black text-white rounded-full cursor-pointer p-1 text-sm'><ImCross/></p>
                        </div>
                    ))}
                        
                    </div>
                </div>
                <textarea onChange={(e)=>setDesc(e.target.value)} value={desc} rows={15} cols={30} className='px-4 py-2 outline-none' placeholder='Enter post description'/>
                <button onClick={handleUpdate} className='bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-xl text-lg '>Update</button>
            </form>

        </div>
        <Footer />
    </div>
  )
}

export default EditPost