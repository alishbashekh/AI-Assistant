import React from 'react'
import {BrowserRouter as Router , Routes , Route , Navigate} from "react-router-dom";
import Login from './pages/Auth/Login';
import Registerpage from './pages/Auth/Registerpage';
import NotFoundpage from './pages/NotFoundpage';
import Dashboardpage from './pages/Dashboard/Dashboardpage';
import DocumentListPage from './pages/Document/DocumentListPage';
import Documentdetailpage from './pages/Document/Documentdetailpage';
import FlashCardList from './pages/Flashcards/FlashCardList';
import QuizTake from './pages/quizzes/QuizTake';
import QuizResult from './pages/quizzes/QuizResult';
import Profilepage from './pages/profile/profilepage';
import FlashCardPage from './pages/Flashcards/flashCardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';



const App = () => {
   
   const {isAuthenticated, loading} = useAuth();
  
   if(loading){
      return(
        <div className="flex items-center justify-center h-screen">
        <p>loadig...</p>
        </div>
      )
    }

  return (
   
   <Router>
    <Routes>
     
     <Route path='/' 
     element={isAuthenticated ? <Navigate to="/dashboard" replace/> : <Navigate to="/login" replace/>} />
     <Route path='/login' element={<Login/>} />
     <Route path='/register' element={<Registerpage/>} />

     {/* protected routes */}
     <Route element={<ProtectedRoute/>}>
      <Route path='/dashboard' element={<Dashboardpage/>}/>
      <Route path='/documents' element={<DocumentListPage/>}/>
      <Route path='/documents/:id' element={<Documentdetailpage/>}/>
      <Route path='/flashcards' element={<FlashCardList/>}/>
      <Route path='/documents/:id/flashcards' element={<FlashCardPage/>}/>
      <Route path='/quizzes/:quizId' element={<QuizTake/>}/>
      <Route path='/quizzes/:quizId/results' element={<QuizResult/>}/>
      <Route path='/profile' element={<Profilepage/>}/>
     </Route>



     <Route path='*' element={<NotFoundpage/>}/>
    </Routes>
   </Router>

  )
}

export default App
