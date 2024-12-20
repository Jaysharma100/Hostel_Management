import { useNavigate } from "react-router-dom"
import { useState } from "react"
import PropTypes from "prop-types"
import "../design/navbar.css"

const Navbar = ({selected}) => {
  const [option,setoption]=useState(selected);
  const navigate=useNavigate();

  function handleclick(e){
     setoption(e.opt);
     if(e.opt===1){
        navigate('/your_room');
     }
     if(e.opt===2){
        navigate('/hostels');
     }
     if(e.opt===3){
        navigate('/alert');
     }
     if(e.opt===4){
        navigate('/about');
     }  
  }
  return (
    <>
    <div className="navbar">
        <div className="logo"></div>
        <div className="routes">
            <div className={`linkto ${option==="1"?"selected":""}`} onClick={()=> handleclick({opt:1})}>Your room</div>
            <div className={`linkto ${option==="2"?"selected":""}`} onClick={()=> handleclick({opt:2})}>Hostel</div>
            <div className={`linkto ${option==="3"?"selected":""}`} onClick={()=> handleclick({opt:3})}>Notification</div>
            <div className={`linkto ${option==="4"?"selected":""}`} onClick={()=> handleclick({opt:4})}>more</div>
        </div>
        <div className="view"></div>
    </div>
    </>
  )
}

Navbar.propTypes = {
  selected: PropTypes.string.isRequired,
};

export default Navbar
