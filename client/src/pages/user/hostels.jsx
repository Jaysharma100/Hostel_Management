import { useEffect, useState } from "react"
import Navbar from "../../components/navbar"
import "../../design/hostels.css"
import PropTypes from "prop-types"


const Hostels = ({user}) => {
  const [hostels,sethostels]=useState(null);
  const [error,seterror]=useState(null);
  
  useEffect(()=>{
    if(user){
      const handlehostelfetch=async()=>{
        try{  
          const response=await fetch('http://localhost:4000/api/auth/hostelfetch',{
            method:'GET',
          })

          const data=await response.json();
          if(response.status===200){
            sethostels(data.hostels);
          }
          else{
            seterror(data.message);
          }
        }
        catch(err){
          console.log(err);
        }
      }
      handlehostelfetch();
    }
  },[user])

  if(!(user && hostels)){
    return <>Loading..</>
  }

  return (
    <>
    <Navbar selected="2" user={user}/>
    <div className="hostel">
        <div className="search">
          <div className="searchbyname">
            <span className="searchtitle">Search By Name</span>
            <input type="text" />
          </div>
          <div className="searchbyloc">
            <span className="searchtitle">Search By Location</span>
            <input type="text" />
          </div>
        </div>
        <div className="displaysearchresult">

        </div>
    </div>
    </>
  )
}

export default Hostels

Hostels.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    hostel: PropTypes.string,
  }).isRequired,
};
