import { useState } from "react"
import defaultimage from "../assets/deafult avatar.jpg"
import {Link,useNavigate} from "react-router-dom"

const Signup=()=>{
    const navigate=useNavigate();
    const [avatar,setavatar]=useState(defaultimage);
    const [AvatarPreview,setAvatarPreview]=useState(defaultimage);
    const [name,setname]=useState(null);
    const [email,setemail]=useState(null);
    const [password,setpassword]=useState(null);
    const [confirmpassword,setconfirmpassword]=useState(null);
    const [role,setrole]=useState("user");
    const [hostel,sethostel]=useState("");
    const [select1,setselect1]=useState(0);
    const [error,seterror]=useState(null);
    const [next,setnext]=useState(0);
    const [mobile,setmobile]=useState(null);
    const [location,setlocation]=useState(null);

    const addclass1=select1? " inuse":" ";
    const addclass2=select1? " ":" inuse";

    const handleremove=()=>{
        setAvatarPreview(defaultimage);
        setavatar(defaultimage)
    }

    const handleAvatarChange =(e) => {
        const file = e.target.files[0];
        if (file) {
          setavatar(file);
          setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handlesignup= async(e)=>{
        e.preventDefault();
        
        if(password!==confirmpassword){
            seterror("Passwords do not match!")
            return;
        }
        
        const formdata=new FormData();
        formdata.append('name',name);
        formdata.append('email',email);
        formdata.append('password',password);
        formdata.append('avatar',avatar);
        formdata.append('role',role);
        formdata.append('hostel',hostel);
        formdata.append('mobile',mobile);
        formdata.append('location',location);

        const response= await fetch(`http://localhost:4000/api/auth/signup`,{
            method:'POST',
            body:formdata
        })

        // const data=await response.json();
        if(response.status==200){
            console.log(response);
            navigate('/login');
        }
        else{
            seterror('Signup failed. Please try again.');
        }
    };
    return(
    <> 
    <div className="top">
        <span>SignUp...</span>
        <p>{error}</p>
    </div>
    <div className="signup">
        <div className="signupselect">
            <span className={`${addclass2}`} onClick={()=>{setrole("user"); setselect1(0)}}>User</span><span className={`${addclass1}`} onClick={()=>{setrole("admin"); setselect1(1)}}>Admin</span>
        </div>
        { next===0?
        <div className="signupinput">
            <div className="input1">
                <span>Name*:</span>
                <input type="text" value={name} onChange={(e)=>{setname(e.target.value)}}/>
            </div>
            <div className="input1">
                <span>Email*:</span>
                <input type="email" value={email} onChange={(e)=>{setemail(e.target.value)}}/>
            </div>
            <div className="input1">
                <span>Password*:</span>
                <input type="password" value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
            </div>
            <div className="input1">
                <span>Confirm Password*:</span>
                <input type="password" value={confirmpassword} onChange={(e)=>{setconfirmpassword(e.target.value)}}/>
            </div>
        </div>
        :
        <div className="nextpage">
            <label htmlFor="signupdiffinput">Choose avatar</label>
            <input id="signupdiffinput" style={{display:"none"}} type="file" name="avatar" onChange={handleAvatarChange}/>
            <div className="insideavatardiv">
                <img src={AvatarPreview} alt="" />
                {avatar!==defaultimage && <button onClick={handleremove}>remove</button>}
            </div>
            <span>Mobile</span>
            <input type="number" onChange={(e)=>setmobile(e.target.value)}/>
            { role==="admin" && 
            <div className="nextinput">
                <span>Hostel Name*</span>
                <input id="hostelin" type="text" onChange={(e)=>{sethostel(e.target.value)}}/>
                <span>Location</span>
                <input type="text" onChange={(e)=>{setlocation(e.target.value)}}/>
            </div>
            }
        </div>
        }
        <div className="signupbottom">
            <div className="goto">
                {next==0?
                <button onClick={()=>{setnext(1)}}>Next</button>
                :
                <div className="gotoback">
                    <button id="backbtn" onClick={()=>{setnext(0)}}>Back</button>
                    <button onClick={handlesignup}>signup</button>
                </div>
                }
                <p>Already have an account?<Link to="/login">Login</Link></p>
            </div>
        </div>
    </div>
    </>
    )
}

export default Signup