import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'
import {Route,Routes} from 'react-router-dom'
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';


const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/* //admin route */}
          <Route path='/' element={<></>}></Route>
          <Route path='/admin-dashboard' element={<Dashboard/>}></Route>
          <Route path='/all-appointments' element={<AllAppointments/>}></Route>
          <Route path='/all-doctor' element={<AddDoctor/>}></Route>
          <Route path='/doctor-list' element={<DoctorsList/>}></Route>

          {/* doctor route  */}

          <Route path='/doctor-dashboard' element={<DoctorDashboard/>}></Route>
          <Route path='/doctor-profile' element={<DoctorProfile/>}></Route>
          <Route path='/doctor-appointments' element={<DoctorAppointment/>}></Route>

        </Routes>
      </div>
      
    </div>
  ) : (
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App