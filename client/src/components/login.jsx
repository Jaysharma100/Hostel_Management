import { useState } from "react"
import {Link,useNavigate} from "react-router-dom"

const Login=()=>{
    const navigate=useNavigate();
    const [email,setemail]=useState(null);
    const [password,setpassword]=useState(null);
    const [error,seterror]=useState(null);

    const handlelogin= async(e)=>{
        e.preventDefault();
        
        const bodydata = {
            email: email,
            password: password,
        };

        const response= await fetch(`http://localhost:4000/api/auth/login`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodydata)
        })

        const resdata=await response.json();
        if(response.status==200){
            localStorage.setItem('verification_token',resdata.token);
            navigate("/");
        }
        else{   
            seterror(resdata.message);
        }
    };

    return(
    <div className="login_page">
        <div className="top1">
            <span>Login...</span>
            <p>{error}</p>
        </div>
        <div className="login">
            <div className="logininput">
                <span >Email:</span>
                <input type="email" value={email} onChange={(e)=>{setemail(e.target.value)}}/>
                <span>Password:</span>
                <input type="password" value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
            </div>
            <div className="goto">
                <button onClick={handlelogin}>Login</button>
                <p>New here? <Link to="/signup">Signup</Link></p>
            </div>
        </div>
    </div>
    )
}

export default Login