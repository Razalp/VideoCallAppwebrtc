import { Route, Routes } from 'react-router-dom'
import './App.css'
import Lobby from './screens/Lobby'
import Room from './screens/Room'
import Test from './screens/Test'

function App() {


  return (

      <Routes>
        <Route path='/' element={<Lobby/>}/>
        <Route path='/room/:id' element={<Room/>}/>
        <Route path='/test' element={<Test/>}/>
        
      </Routes>


  )
}

export default App
