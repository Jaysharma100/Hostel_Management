import Loader from "../../components/loader.jsx"
import Navbar from "../../components/navbar"
import "../../design/loader.css"
import PropTypes from "prop-types";

const User = ({user}) => {
  const {name,email,role,avatar,}=user;

  if(!user){
    return <Loader/>
  }

  return (
    <>
    <Navbar selected="1" user={user}/>
    <h1>this is user overhere: {name}</h1>
    </>
  )
}

User.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    hostel: PropTypes.string,
  }).isRequired,
};

export default User
