import PropTypes from "prop-types";
import "../../design/admin.css"
import { useNavigate } from "react-router-dom"
import { useState ,useEffect} from "react";

const Admin = ({user}) => {
  const navigate=useNavigate();
  const [hide1,sethide1]=useState(1);
  const [hide2,sethide2]=useState(1);
  const [error,seterror]=useState(null);
  const [admin_popup1,setadmin_popup1]=useState(0);
  const [admin_popup2,setadmin_popup2]=useState(0);
  const [imgchange,setimgchange]=useState(null);
  const [wantto1,setwantto]=useState(0);
  const {name,email,password,avatar}=user;

  const [hostelname,sethostelname]=useState("");
  const [floors,setfloors]=useState([]);
  const [description,setdescription]=useState("");

  useEffect(() => {
    const handleHD=async()=>{
      const body={
        email:email,
      }
      try{
        const response=await fetch(`http://localhost:4000/api/auth/findhostel`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body)
        })
    
        const data=await response.json();
        if(response.status==200){
          console.log(data);
          sethostelname(data.hostel.name);
          setfloors(data.hostel.floors);
          setdescription(data.hostel.description);
        }
        else{
          seterror(data.message);
        }
      }catch(err){
        seterror(err);
      }
    }
    if (user) {
      handleHD();
    }
  }, [user,email]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handlelogout=()=>{
    localStorage.removeItem('verification_token');
    navigate("/login");
  }

  const handleupdateHD=async()=>{
    const body={
      name:hostelname,
      email:email,
      description:description,
    }
    try{
      const response=await fetch(`http://localhost:4000/api/auth/updatehostel`,{
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })

      const data=await response.json();

      if(response.status===200){
        console.log(data);
      }
      else{
        seterror(data.message);
      }
    }catch(err){
      seterror(err);
    }
  }

  const ifpassmatch= async()=>{
    const body={
      email:email,
      password:password
    }

    const response=await fetch(`http://localhost:4000/api/auth/updatehostel`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    const data=await response.json();
    if(response.status==200){
      console.log(data);
    }
    else{
      seterror(data.message);
    }
  }

  return (
    <>
    <div className={`main ${(admin_popup1 || admin_popup2) ? "blurred" : ""}`}>
      <button className="edit2btn edit2btnext logoutbtn" onClick={handlelogout}>Logout</button>
      <div className="admintop">
        <div className="hostel_details profile" onMouseEnter={()=>sethide2(0)} onMouseLeave={()=>sethide2(1)}>
          <span className={hide2?"":"hide"}>Hostel Details</span>
          <button className={hide2?"edit2btn profeditbtn hide":"edit2btn profeditbtn"} onClick={()=>setadmin_popup1(1)}>Hostel Details</button>
        </div>
        <div className="profile" onMouseEnter={()=>sethide1(0)} onMouseLeave={()=>sethide1(1)}>
          <img className="avatarimg" src={`http://localhost:4000/${avatar}`} alt="" />
          <div className="editopt">
            <span>{name}</span>
            <button className={hide1?"edit2btn edit2btnext profeditbtn hide":"edit2btn profeditbtn edit2btnext"} onClick={()=>setadmin_popup2(1)} >Edit Profile</button>
          </div>
        </div>
      </div>
      <span>{error}</span>
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

    {admin_popup1?
      <>
        <div className="popup">
          <div className="popuptop">
            <h2>Hostel Details</h2>
            <button
              className="edit2btn edit2btnext extadd2btn"
              onClick={() => setadmin_popup1(0)}
            >
              X
            </button>
          </div>
          <div className="popupdetails">
            <span>Hostel Name:</span>
            <input type="text" value={hostelname} onChange={(e)=>sethostelname(e.target.value)}/>
            <span>Description:</span>
            <textarea className="description" value={description} onChange={(e)=>setdescription(e.target.value)}>hii</textarea>
          </div>
          <button className="edit2btn edit2btnext" onClick={handleupdateHD}>Save Changes</button>
        </div>
      </>
      :
      <>
      </>
    }

    {admin_popup2?
      <>
        <div className="popup">
          <div className="popuptop">
            <h2>Profile Details</h2>
            <button
              className="edit2btn edit2btnext extadd2btn"
              onClick={() => setadmin_popup2(0)}
            >
              X
            </button>
          </div>
          <div className="popupdetails adminpopcustom">
            <div className="avatarchange">
              <img className="avatarimg" src={`http://localhost:4000/${avatar}`} alt="" />
              <button className="edit2btn edit2btnext">Edit</button>
            </div>
            <div className={`${wantto1?"hide":""} avatarchange`}>
              <label htmlFor="newavatar" className={imgchange?"addcolor":""}>Choose</label>
              <input type="file" id="newavatar" className="hide" onChange={(e)=>{setimgchange(e.target.files[0])}}/>
              <button className="edit2btn edit2btnext">Change!</button>
            </div>
            <span>{imgchange?`${imgchange}`:null}</span>
            <span>Name:</span>
            <input type="text" value={hostelname} onChange={(e)=>sethostelname(e.target.value)}/>
            <span>Email ID:</span>
            <input type="text" value={hostelname} onChange={(e)=>sethostelname(e.target.value)}/>
            <button className="edit2btn edit2btnext" onClick={handleupdateHD}>Save Changes</button>
          </div>
        </div>
      </>
      :
      <>
      </>
    }
    </>
  )
}

export default Admin

Admin.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    hostel: PropTypes.string,
  }).isRequired,
};