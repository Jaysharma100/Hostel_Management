import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import "../design/navbar.css"

const Navbar = ({selected,user}) => {

  const [option,setoption]=useState(selected);
  const [openthis1,setopenthis1]=useState(0);
  const [openthis2,setopenthis2]=useState(0);
  const [confirm,setconfirm]=useState(null);
  const [error,seterror]=useState(null);

  const [ogavatar,setogavatar]=useState(null);
  const [ogname,setogname]=useState(null);
  const [ogemail,setogemail]=useState(null);
    const [ogmobile,setogmobile]=useState(null);

  const [newavatar,setnewavatar]=useState(ogavatar);
  const [newname,setnewname]=useState(ogname);
  const [newemail,setnewemail]=useState(ogemail);
  const [newmobile,setnewmobile]=useState(ogmobile);

  const navigate=useNavigate();

  useEffect(()=>{
   if(user)
   {setogavatar(user.avatar);
   setogname(user.name);
   setogemail(user.email);
   setogmobile(user.mobile);
   setnewname(user.name);
   setnewemail(user.email);
   setnewmobile(user.mobile);
   }
  },[user,ogavatar,ogname,ogemail,ogmobile])

  if(!user){
   return <>Loading....</>
  }


  function handleclick(e){
     setoption(e.opt);
     if(e.opt==="1" && selected!==e.opt){
        navigate('/your_room');
     }
     if(e.opt==="2" && selected!==e.opt){
        navigate('/hostels');
     }
     if(e.opt==="3" && selected!==e.opt){
        navigate('/alert');
     }
     if(e.opt==="4" && selected!==e.opt){
        navigate('/about');
     }
  }

  const handlegoback=()=>{
   setopenthis1(0);
  }

  const updateprofile=async()=>{
    
   if((ogname!==newname || ogemail!==newemail || ogmobile!==newmobile) && confirm!=="CONFIRM"){
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
   if(newavatar)
   bodydata.append('avatar',newavatar);

   try{
     const response=await fetch(`http://localhost:4000/api/auth/updateprofile`,{
       method: 'PATCH',
       body:bodydata
     })

     const data=await response.json();
     if(response.status===200){
        setogname(data.user.name);
        setogemail(data.user.email);
        
        setogavatar(data.user.avatar);
        console.log(data.user.avatar);
        console.log(ogavatar);
        setnewavatar(null);
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

  return (
    <>
    <div className={`navbar ${(openthis1) ? "blurred" : ""}`}>
        <div className="logo"></div>
        <div className="routes">
            <div className={`linkto ${option==="1"?"selected":""}`} onClick={()=> handleclick({opt:"1"})}>Your room</div>
            <div className={`linkto ${option==="2"?"selected":""}`} onClick={()=> handleclick({opt:"2"})}>Hostel</div>
            <div className={`linkto ${option==="3"?"selected":""}`} onClick={()=> handleclick({opt:"3"})}>Notification</div>
            <div className={`linkto ${option==="4"?"selected":""}`} onClick={()=> handleclick({opt:"4"})}>more</div>
        </div>
        <div className="view" onClick={()=>setopenthis1(1)}>
            <img src={`http://localhost:4000/${ogavatar}`} alt="" />
            <span>View<br></br>Profile</span>
        </div>
    </div>

    {openthis1?
      <>
        <div className="popup">
          <div className="popuptop">
            <h2>Profile Details</h2>
            <button
              className="edit2btn edit2btnext extadd2btn"
              onClick={handlegoback}
            >
              X
            </button>
          </div>
          <div className="popupdetails adminpopcustom">
            <div className="avatarchange">
              <img className="avatarimg" src={`http://localhost:4000/${ogavatar}`} alt="" />
              <button className="edit2btn edit2btnext" onClick={()=>setopenthis2(1)}>Edit</button>
            </div>
            <div className={`${openthis2?"":"hide"} avatarchange`}>
              <button className="edit2btn edit2btnext" onClick={()=>{
                setopenthis2(0);
                setnewavatar(null);
              }}>
                Back
              </button>
              <label htmlFor="newavatar" className={newavatar?"addcolor":""}>Choose</label>
              <input type="file" id="newavatar" className="hide" onChange={(e)=>{setnewavatar(e.target.files[0])}}/>
              {newavatar && <span>✔️</span> }
            </div>
            <span>Name:</span>
            <input type="text" value={newname} onChange={(e)=>setnewname(e.target.value)}/>
            <span>Email ID:</span>
            <input type="text" value={newemail} onChange={(e)=>setnewemail(e.target.value)}/>
            <span>Mobile:</span>
            <input type="text" value={newmobile} onChange={(e)=>setnewmobile(e.target.value)}/>
            {(ogname!==newname || ogemail!==newemail || newmobile!=ogmobile)
             && <>
              <span>{`Type "CONFIRM"`}</span>
              <input type="text" value={confirm} onChange={(e)=>setconfirm(e.target.value)} />
             </>}
            {(ogname!==newname || ogemail!==newemail || newavatar || newmobile!=ogmobile) && <button className="edit2btn edit2btnext" onClick={updateprofile}>Save Changes</button>}
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

Navbar.propTypes = {
  selected: PropTypes.string.isRequired,
  user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      mobile:PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
};

export default Navbar
