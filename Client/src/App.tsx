import { Routes, Route } from 'react-router-dom'
import './App.css'
import Create from './components/Create'

function App() {

  return (
    <Routes>
      <Route path='/create' Component={Create}>Create</Route>
    </Routes>
  )
}

export default App
