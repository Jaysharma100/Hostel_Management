import PropTypes from "prop-types";
import Loader from "../../components/loader.jsx"
import "../../design/loader.css"
import "../../design/admin.css"
import { useNavigate } from "react-router-dom"
import { useState ,useEffect} from "react";
import backgroundImage from "../../assets/background.jpg";

const Admin = ({user}) => {
  const navigate=useNavigate();
  const [hide1,sethide1]=useState(1);
  const [hide2,sethide2]=useState(1);
  const [error,seterror]=useState(null);
  const [admin_popup1,setadmin_popup1]=useState(0);
  const [admin_popup2,setadmin_popup2]=useState(0);
  const [imgchange,setimgchange]=useState(null);
  const [wantto1,setwantto1]=useState(0);
  const [isopen,setisopen]=useState(0);
  const {name,email,avatar}=user;
  
  //new hostel details
  const [hostelname,sethostelname]=useState("");
  const [floors,setfloors]=useState([]);
  const [description,setdescription]=useState("");
  const [floornumber,setfloornumber]=useState("1");
  
  //original hostel details
  const [oghostelname,setoghostelname]=useState("");
  const [ogdescription,setogdescription]=useState("");

  //rooms
  const [rooms,setrooms]=useState(null);
  const [areHostelersVisible, setAreHostelersVisible] = useState({});

  
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
          setoghostelname(data.hostel.name);
          setogdescription(data.hostel.description);
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

  useEffect(() => {
    if (floors && Object.keys(floors).length > 0) {
      const firstFloor = Object.keys(floors)[0];
      setfloornumber(firstFloor);
      setrooms(floors[firstFloor]);
      handleselect(firstFloor); // Ensure it runs even if dropdown is not interacted with
    }
  }, [floors]);
  
  //original profile details
  const [ogname,setogname]=useState(name);
  const [ogemail,setogemail]=useState(email);
  const [ogavatar,setogavatar]=useState(avatar);
  

  //new profile details
  const [newname,setnewname]=useState(ogname);
  const [newemail,setnewemail]=useState(ogemail);
  const [confirm,setconfirm]=useState("");

  if (!user) {
    return <Loader/>;
  }

  const handleViewHostelers = (roomNumber) => {
    setAreHostelersVisible(prevState => ({
      ...prevState,
      [roomNumber]: !prevState[roomNumber],  // Toggle visibility for the specific room
    }));
  };

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
        setoghostelname(hostelname);
        setogdescription(description);
      }
      else{
        seterror(data.message);
      }
    }catch(err){
      seterror(err);
    }
  }

  const updateprofile=async()=>{
    
    if((ogname!==newname || ogemail!==newemail) && confirm!=="CONFIRM"){
      setconfirm("");
      seterror("Cannot Proceed! Type CONFIRM correctly");
      return;
    }

    const bodydata=new FormData();
    if(newname)
    bodydata.append('name',newname);
    if(ogemail){
    bodydata.append('email',ogemail);
    }
    if(newemail)
    bodydata.append('newemail',newemail);
    if(imgchange)
    bodydata.append('avatar',imgchange);

    try{
      const response=await fetch(`http://localhost:4000/api/auth/updateprofile`,{
        method: 'PATCH',
        body:bodydata
      })

      const data=await response.json();
      if(response.status===200){
        console.log(data);
        setogname(data.user.name);
        setogemail(data.user.email);
        setogavatar(data.user.avatar);
        setimgchange(null);
        seterror("");
        setconfirm("");
      }
      else{
        seterror(data.message);
      }
    }
    catch(err){
      seterror(err.message || "An unexpected error occurred");
    }
  }

  const handlegoback=(e)=>{
    if(e===1){
      setadmin_popup1(0);
      sethostelname(oghostelname);
      setdescription(ogdescription);
    }
    if(e===2){
      setadmin_popup2(0);
      setnewname(ogname);
      setnewemail(ogemail);
    }
    seterror("");
  }

  const handleselect=(e)=>{
    setfloornumber(e);
    setrooms(floors[e]);
    setisopen(0);
  }

  return (
    <>
    <div className={`main ${(admin_popup1 || admin_popup2) ? "blurred" : ""}`}>
      <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `url(${backgroundImage})`,
      opacity:"0.7",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      zIndex: -1,
      }}></div>
      <button className="edit2btn edit2btnext logoutbtn" onClick={handlelogout}>Logout</button>
      <div className="admintop">
        <div className="hostel_details profile" onMouseEnter={()=>sethide2(0)} onMouseLeave={()=>sethide2(1)}>
          <span className={hide2?"":"hide"}>Hostel Details</span>
          <button className={hide2?"edit2btn profeditbtn hide":"edit2btn profeditbtn"} onClick={()=>setadmin_popup1(1)}>Hostel Details</button>
        </div>
        <div className="profile" onMouseEnter={()=>sethide1(0)} onMouseLeave={()=>sethide1(1)}>
          <img className="avatarimg" src={`http://localhost:4000/${ogavatar}`} alt="" />
          <div className="editopt">
            <span>{ogname}</span>
            <button className={hide1?"edit2btn edit2btnext profeditbtn hide":"edit2btn profeditbtn edit2btnext"} onClick={()=>setadmin_popup2(1)} >Edit Profile</button>
          </div>
        </div>
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
        <div className="filter">
          <div className="dropdown-header" onClick={()=>setisopen(!isopen)} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <span>Floor</span>
            <span style={{ marginLeft: "10px" }}>{floornumber}</span>
          </div>
          {isopen==1 && (
            <div className="dropdown-content">
              {Object.keys(floors).map((floorNumber, index) => (
                <div
                  key={index}
                  className="dropdown-item"
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    margin: "5px 0",
                    textAlign: "center",
                    backgroundColor: "#f1f1f1",
                  }}
                  onClick={()=>handleselect(floorNumber)}
                >
                  Floor {floorNumber}
                </div>
              ))}
            </div>
          )}
        </div>
        {rooms &&
        <div className="rooms_admin">
          {rooms && rooms.map((room, index) => (
            <div
              key={index}
              className="room-item"
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                margin: "5px 0",
                backgroundColor: "#f0f8ff",
              }}
            >
              <div className="roomtop">
                <div className="put">
                  <span>Room: </span>
                  <span>{room.number}</span>
                </div>
                <div className="put">
                  <span>Capacity</span>
                  <span>{room.capacity}</span>
                </div>
                <button 
                  className="edit2btn edit2btnext" 
                  onClick={() => handleViewHostelers(room.number)}
                >
                  {areHostelersVisible[room.number] ? "Close" : "View Hostelers"}
                </button>
              </div>
              {room.hostelers.length > 0 ? (
                <div className="hostelers">
                  {areHostelersVisible[room.number] && (
                    room.hostelers.map((hosteler, index) => (
                      <div className="hosteler" key={index}>
                        <span>{index+1}</span>
                        <span>{hosteler.email}</span>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <span style={{
                  padding: "10px",
                  margin: "5vh 0",
                }}>No hostelers</span>
              )}
            </div>
          ))}
        </div>
        }
      </div>
    </div>

    {admin_popup1?
      <>
        <div className="popup">
          <div className="popuptop">
            <h2>Hostel Details</h2>
            <button
              className="edit2btn edit2btnext extadd2btn"
              onClick={() =>{handlegoback(1)}}
            >
              X
            </button>
          </div>
          <div className="popupdetails">
            <span>Hostel Name:</span>
            <input type="text" value={hostelname} onChange={(e)=>sethostelname(e.target.value)}/>
            <span>Description:</span>
            <textarea className="description" value={description} onChange={(e)=>setdescription(e.target.value)}></textarea>
            {(oghostelname!==hostelname || ogdescription!==description) && <button className="edit2btn edit2btnext" onClick={handleupdateHD}>Save Changes</button>}
            <span>{error? error.toString():""}</span>
          </div>
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
              onClick={() =>{handlegoback(2)}}
            >
              X
            </button>
          </div>
          <div className="popupdetails adminpopcustom">
            <div className="avatarchange">
              <img className="avatarimg" src={`http://localhost:4000/${ogavatar}`} alt="" />
              <button className="edit2btn edit2btnext" onClick={()=>setwantto1(1)}>Edit</button>
            </div>
            <div className={`${wantto1?"":"hide"} avatarchange`}>
              <button className="edit2btn edit2btnext" onClick={()=>{
                setwantto1(0);
                setimgchange(null);
              }}>
                Back
              </button>
              <label htmlFor="newavatar" className={imgchange?"addcolor":""}>Choose</label>
              <input type="file" id="newavatar" className="hide" onChange={(e)=>{setimgchange(e.target.files[0])}}/>
              {imgchange && <span>✔️</span> }
            </div>
            <span>Name:</span>
            <input type="text" value={newname} onChange={(e)=>setnewname(e.target.value)}/>
            <span>Email ID:</span>
            <input type="text" value={newemail} onChange={(e)=>setnewemail(e.target.value)}/>
            {(ogname!==newname || ogemail!==newemail)
             && <>
              <span>{`Type "CONFIRM"`}</span>
              <input type="text" value={confirm} onChange={(e)=>setconfirm(e.target.value)} />
             </>}
            {(ogname!==newname || ogemail!==newemail || imgchange) && <button className="edit2btn edit2btnext" onClick={updateprofile}>Save Changes</button>}
            <span>{error? error.toString():""}</span>
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