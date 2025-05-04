import React from 'react'
import { BrowserRouter as AppRouter, Route, Routes as AppRoutes } from 'react-router-dom';
import Home from  "../views/Home/Home.jsx"
import CreateProject from '../views/create-project/CreateProject.jsx';
import Project from '../views/Projects/Project.jsx';



const Routes = () => {
  return (
   <AppRouter>
    <AppRoutes>
      <Route path='/' element ={<Home/>} />
      <Route path='/create-project' element ={<CreateProject/>} />
      <Route path='/project/:id' element ={<Project/>} />

    </AppRoutes>
   </AppRouter>
  )
}

export default Routes
