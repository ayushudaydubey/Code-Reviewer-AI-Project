import React, { useState } from 'react'
import axios  from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateProject = () => {
  const [projectName, setprojectName] = useState(null)
  const navigate = useNavigate()
  function handelSubmit(e) {
    e.preventDefault()
    axios.post("http://localhost:3000/projects/create",{
      projectName
    })
    navigate("/")
    console.log(projectName);

    
  }

  return (
    <div className='h-screen w-full flex flex-col gap-10 items-center justify-center  '>
      <h1 className='text-3xl font-bold '>Create New Project</h1>
      <form onSubmit={handelSubmit} className='flex flex-col gap-5'>
        <input onChange={(e)=>setprojectName(e.target.value)} value={projectName} className='px-2 py-1 text-lg border-[1px] border-blue-300' type="text" placeholder='Project Name ' />
        <button className=' font-semibold p-2  text-blue-400 bg-zinc-950 rounded-2xl text-xl  inline  cursor-pointer '>Create</button>
      </form>
    </div>
  )
}

export default CreateProject