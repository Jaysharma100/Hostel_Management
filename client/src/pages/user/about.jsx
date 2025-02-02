import Navbar from "../../components/navbar"
import PropTypes from "prop-types";
import Loader from "../../components/loader.jsx";
import "../../design/loader.css";
import backgroundImage from "../../assets/background.jpg";
import profilePic from "../../assets/about_pic.jpg";
import "../../design/about.css";
import { Link } from "react-router-dom";

const About = ({user}) => {
  
  if(!user){
    return <Loader />;
  }

  return (
    <>
    <Navbar selected="4" user={user}/>
    <div style={{
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
    }}></div>
    <div className="about-container">
        <div className="about-header">
          <img src={profilePic} alt="Profile" className="profile-img" />
          <h1>Hi, I am Jay Sharma</h1>
          <p>Software Developer | Passionate Coder</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>About Me</h2>
            <p>
              I am a dedicated software developer passionate about building scalable web applications.
              With a strong foundation in **MERN Stack** and **Socket.IO**. Currently, I am working on a **room booking system** using **Redis**.
            </p>
          </section>

          <section className="about-section">
            <h2>My Projects</h2>
            <ul>
              <li><strong>🚀 Real-Time Chat App</strong> – Built using MERN & Socket.IO  <Link target="_blank" rel="noopener noreferrer" to="https://pollpost.netlify.app/">Link to PollPost App</Link></li>
              <li><strong>📊 Booking System</strong> – Manages hostel rooms efficiently (Uses Redis)</li>
              <li><strong>🔧 More...</strong> Check out my GitHub below! </li>
            </ul>
          </section>

          <section className="about-section">
            <h2>My Skills</h2>
            <div className="skills">
              <span>JavaScript</span>
              <span>React.js</span>
              <span>Node.js</span>
              <span>MongoDB</span>
              <span>Socket.IO</span>
              <span>Redis</span>
              <span>Git & GitHub</span>
            </div>
          </section>

          <section className="about-section">
            <h2>Connect with Me</h2>
            <div className="social-links">
              <a href="https://github.com/jaysharma100" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://linkedin.com/in/jaysharma100" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="mailto:jaysharma100125@gmail.com">Email Me</a>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default About;

About.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    hostel: PropTypes.string,
  }).isRequired,
};