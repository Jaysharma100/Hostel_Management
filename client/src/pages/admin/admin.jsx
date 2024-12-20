import PropTypes from "prop-types";
import "../../design/admin.css"
import { useNavigate } from "react-router-dom"

const Admin = ({user}) => {
  const navigate=useNavigate();
  const {email,avatar,hostel}=user;

  const handlelogout=()=>{
    localStorage.removeItem('verification_token');
    navigate("/login");
  }

  return (
    <>
    <div className="admin">
      <button className="edit2btn edit2btnext logoutbtn" onClick={handlelogout}>Logout</button>
      <div className="profile">
        {email}{avatar}{hostel}
      </div>
      <div className="edit">
        <div className="editrooms gotoedit" onClick={()=>navigate("/editroom")}>
          <span>Edit Hostel rooms</span>
        </div>
        <div className="anncomp gotoedit" onClick={()=>navigate("/announcement&complaint")}>
          <span>Announcements<br></br>& Complaints</span>
        </div>
      </div>
      <div className="details">

      </div>
    </div>
    </>
  )
}

export default Admin
