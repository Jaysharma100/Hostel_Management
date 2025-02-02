import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background.jpg";
import logo from "../assets/HMA_logo.png";
import login_bg from "../assets/Login_bg.png";
import loading from "../assets/loading_gif.gif";

const Login = () => {
    const navigate = useNavigate();
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [error, seterror] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlelogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const bodydata = { email, password };

        try {
            const response = await fetch(`http://localhost:4000/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodydata),
            });

            const resdata = await response.json();

            if (response.status === 200) {
                localStorage.setItem("verification_token", resdata.token);
                navigate("/");
            } else {
                seterror(resdata.message);
            }
        } catch (err) {
            console.log(err);
            seterror("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login_page">
            <img src={logo} className="login_logo" alt="Logo" style={{ zIndex: "2" }} />

            <div style={{
                position: "fixed",
                top: 0, left: 0,
                width: "100%", height: "100%",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                zIndex: -1,
            }}></div>

            <div style={{
                position: "fixed",
                top: 0, left: 0,
                width: "100%", height: "100%",
                backgroundImage: `url(${login_bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                opacity: "0.43",
                zIndex: 0,
            }}></div>

            <div className="top1">
                {error && <p>{error}</p>}
            </div>

            <div className="login">
                <div className="logininput">
                    <span>Email:</span>
                    <input type="email" value={email} onChange={(e) => setemail(e.target.value)} />
                    <span>Password:</span>
                    <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} />
                </div>
                <div className="goto">
                    <button onClick={handlelogin} disabled={isLoading}>Login</button>
                    {isLoading && <img src={loading} alt="Loading..." className="loading-gif" />}
                    <p>New here? <Link to="/signup" className="shortnav">Signup</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
