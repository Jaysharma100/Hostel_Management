import { Route ,Routes} from 'react-router-dom'
import './design/login.css'
import './design/signup.css'
import Login from './components/login.jsx'
import Signup from './components/signup.jsx'
import Home from './pages/home.jsx'
import Privateroute from './components/privateroute.jsx'
import User from './pages/user/user.jsx'
import Admin from './pages/admin/admin.jsx'
import Hostels from './pages/user/hostels.jsx'
import Alert from './pages/user/AnnounceComp.jsx'
import About from './pages/user/about.jsx'
import Editroom from './pages/admin/editroom.jsx'
import Anncomp from './pages/admin/announcement&complaint.jsx'

function App() {

  return (
    <>
    <Routes>
      <Route
          exact path="/signup"
          element={<Privateroute path="/signup"><Signup /></Privateroute>}
      />
      <Route
          exact path="/login"
          element={<Privateroute path="/login"><Login /></Privateroute>}
      />
      <Route
          exact path="/"
          element={<Privateroute path="/"><Home /></Privateroute>}
      />
      <Route
          exact path="/your_room"
          element={<Privateroute path="/your_room"><User /></Privateroute>}
      />
      <Route
          exact path="/admin"
          element={<Privateroute path="/admin"><Admin /></Privateroute>}
      />
      <Route
          exact path="/hostels"
          element={<Privateroute path="/hostels"><Hostels /></Privateroute>}
      />
      <Route
          exact path="/alert"
          element={<Privateroute path="/alert"><Alert /></Privateroute>}
      />
      <Route
          exact path="/about"
          element={<Privateroute path="/about"><About /></Privateroute>}
      />
      <Route
          exact path="/editroom"
          element={<Privateroute path="/editroom"><Editroom /></Privateroute>}
      />
      <Route
          exact path="/announcement&complaint"
          element={<Privateroute path="/announcement&complaint"><Anncomp/></Privateroute>}
      />
    </Routes>
    </>
  )
}

export default App
