
import Navbar from "../components/navbar"
import PropTypes from "prop-types";

const User = ({user}) => {
  const {name,email,role,avatar,hostel}=user;
  return (
    <>
    <Navbar selected="1"/>
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
