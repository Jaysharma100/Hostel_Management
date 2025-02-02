import { useState } from "react";
import defaultimage from "../assets/default avatar.jpg";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background.jpg";
import logo from "../assets/HMA_logo.png";
import signup_bg from "../assets/signup_bg.png";
import loading from "../assets/loading_gif.gif";

const Signup = () => {
    const navigate = useNavigate();
    const [avatar, setavatar] = useState(defaultimage);
    const [AvatarPreview, setAvatarPreview] = useState(defaultimage);
    const [name, setname] = useState(null);
    const [email, setemail] = useState(null);
    const [password, setpassword] = useState(null);
    const [confirmpassword, setconfirmpassword] = useState(null);
    const [role, setrole] = useState("user");
    const [hostel, sethostel] = useState("");
    const [select1, setselect1] = useState(0);
    const [error, seterror] = useState(null);
    const [next, setnext] = useState(0);
    const [mobile, setmobile] = useState(null);
    const [location, setlocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const addclass1 = select1 ? " inuse" : " ";
    const addclass2 = select1 ? " " : " inuse";

    const handleremove = () => {
        setAvatarPreview(defaultimage);
        setavatar(defaultimage);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setavatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handlesignup = async (e) => {
        e.preventDefault();
        if (password !== confirmpassword) {
            seterror("Passwords do not match!");
            return;
        }
        setIsLoading(true);

        const formdata = new FormData();
        formdata.append("name", name);
        formdata.append("email", email);
        formdata.append("password", password);
        formdata.append("avatar", avatar);
        formdata.append("role", role);
        formdata.append("hostel", hostel);
        formdata.append("mobile", mobile);
        formdata.append("location", location);

        const response = await fetch(`http://localhost:4000/api/auth/signup`, {
            method: "POST",
            body: formdata,
        });

        if (response.status === 200) {
            navigate("/login");
        } else {
            seterror("Signup failed. Please try again.");
        }

        setIsLoading(false);
    };

    return (
        <div className="login_page">
            <img src={logo} className="signup_logo" alt="" style={{ zIndex: "1" }} />
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    zIndex: -1,
                }}
            ></div>
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: `url(${signup_bg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: "0.42",
                    zIndex: 0,
                }}
            ></div>
            <div className="top">
                {error && <p>{error}</p>}
            </div>
            <div className="signup">
                <div className="signupselect">
                    <span className={`${addclass2}`} onClick={() => { setrole("user"); setselect1(0); }}>User</span>
                    <span className={`${addclass1}`} onClick={() => { setrole("admin"); setselect1(1); }}>Admin</span>
                </div>
                {next === 0 ? (
                    <div className="signupinput">
                        <div className="input1">
                            <span>Name*:</span>
                            <input type="text" value={name} onChange={(e) => { setname(e.target.value); }} />
                        </div>
                        <div className="input1">
                            <span>Email*:</span>
                            <input type="email" value={email} onChange={(e) => { setemail(e.target.value); }} />
                        </div>
                        <div className="input1">
                            <span>Password*:</span>
                            <input type="password" value={password} onChange={(e) => { setpassword(e.target.value); }} />
                        </div>
                        <div className="input1">
                            <span>Confirm Password*:</span>
                            <input type="password" value={confirmpassword} onChange={(e) => { setconfirmpassword(e.target.value); }} />
                        </div>
                    </div>
                ) : (
                    <div className="nextpage">
                        <label htmlFor="signupdiffinput">Choose avatar</label>
                        <input id="signupdiffinput" style={{ display: "none" }} type="file" name="avatar" onChange={handleAvatarChange} />
                        <div className="insideavatardiv">
                            <img src={AvatarPreview} alt="" />
                            {avatar !== defaultimage && <button onClick={handleremove}>remove</button>}
                        </div>
                        <span>Mobile</span>
                        <input type="number" onChange={(e) => setmobile(e.target.value)} />
                        {role === "admin" && (
                            <div className="nextinput">
                                <span>Hostel Name*</span>
                                <input id="hostelin" type="text" onChange={(e) => { sethostel(e.target.value); }} />
                                <span>Location</span>
                                <input type="text" onChange={(e) => { setlocation(e.target.value); }} />
                            </div>
                        )}
                    </div>
                )}
                <div className="signupbottom">
                    <div className="goto">
                        {next === 0 ? (
                            <button onClick={() => { setnext(1); }} className="next">Next</button>
                        ) : (
                            <div className="gotoback">
                                <button id="backbtn_signup" onClick={() => { setnext(0); }}>Back</button>
                                <button onClick={handlesignup} disabled={isLoading}>Signup</button>
                                {isLoading && <img src={loading} alt="Loading..." className="loading-gif" />}
                            </div>
                        )}
                        <p>Already have an account?<Link to="/login" className="shortnav">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;