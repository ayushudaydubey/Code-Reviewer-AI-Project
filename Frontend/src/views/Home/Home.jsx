import React, { useState ,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const navigate = useNavigate()
  const [projects, setprojects] = useState([])
  useEffect(() => {
  axios.get("http://localhost:3000/projects/get-all")
  .then(response=>{
   setprojects(response.data.data)
    
  })
  }, [])

  return (
    <main className='px-6 py-4'>
      <section>
        <button className='bg-blue-600 text-white px-2 py-2 font-semibold rounded-xl ' onClick={() => navigate('/create-project')}>  Create Project</button>
      </section>
      <section className='Project-section flex items-center flex-wrap  gap-4 '>
        {projects.length === 0 ? <div><p>No Projects created </p></div> : projects.map((project)=>{
          return  <div className='project-name mt-8 px-2 py-2 bg-zinc-700 border-[1px] inline-block border-400-gray rounded text-blue-300 text-xl cursor-pointer  '>
          {project.name}
        </div>
        })}

      </section>
    </main>
  )
}

export default Home
