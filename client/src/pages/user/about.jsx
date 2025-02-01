import Navbar from "../../components/navbar"
import PropTypes from "prop-types";
import Loader from "../../components/loader.jsx";
import "../../design/loader.css";
import backgroundImage from "../../assets/background.jpg";

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
    <div className="aboutme">
      
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