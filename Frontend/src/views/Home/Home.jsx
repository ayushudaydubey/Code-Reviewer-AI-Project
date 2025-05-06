import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const navigate = useNavigate()
  const [projects, setprojects] = useState([])

  function navigateToProjects(projectId) {
    navigate(`/project/${projectId}`)
  }

  useEffect(() => {
    axios.get("http://localhost:3000/projects/get-all")
      .then(response => {
        setprojects(response.data.data)
      })
      .catch(error => {
        console.error("Error fetching projects:", error)
      })
  }, [])

  return (
    <main className='px-6 py-5'>
      <section >
        <h1 className='text-center text-4xl  font-semibold py-2 mb-4' >Welcome to CodeReviwer AI</h1>
        <h3 className='text-center text-xl  font-medium py-2 mb-4'  > CodeReviewer - Collaborative Coding and AI Review Platform</h3>
        <p className='text-center  px-6 text-center py-2 mb-4'>CodeReviewer is an innovative platform that allows users to create and manage multiple coding projects efficiently. Users can connect different projects together, making it easier to manage complex development tasks and collaborate across related modules.

          The platform supports team collaboration, where multiple users can join the same project and contribute simultaneously. Each project includes a built-in chat feature, enabling team members to communicate in real-time, share ideas, and solve problems together within the project workspace.

          One of the standout features of CodeReviewer is its AI-powered code review system. Users can request feedback on their written code, and the AI analyzes it for quality, efficiency, readability, and potential errors, offering suggestions to improve the codebase. This helps users learn best practices and ensures cleaner, more maintainable code.

          Whether you're working solo or with a team, CodeReviewer provides a collaborative, smart, and connected environment for modern software development.</p>


       <div className='flex items-center justify-center  flex-col gap-4'>
        <h2 className='text-2xl '>Create new project now...!</h2>
        
               <button className='bg-blue-600 text-white px-2 py-2 font-semibold rounded-xl ' onClick={() => navigate('/create-project')}>Create Project</button>
       </div>

      </section>
      <h1 className='text-2xl py-2 px-6 '>Your Currently Created Projects</h1>
      <section className='Project-section flex items-center flex-wrap gap-4  px-6'>
     

        {projects.length === 0 ? <div><p>No Projects created </p></div> : projects.map((project, index) => {
          return (
            <div
              key={index}
              onClick={() => navigateToProjects(project._id)}
              className='project-name mt-8 px-2 py-2 bg-zinc-700 border-[1px] inline-block border-gray-400 rounded text-blue-300 text-xl cursor-pointer'
            >
              {project.name}
            </div>
          )
        })}
      </section>
    </main>
  )
}

export default Home
