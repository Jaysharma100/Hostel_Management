import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Loader from "../../components/loader.jsx";
import "../../design/loader.css";
import "../../design/yourroom.css"  
import PropTypes from "prop-types";

const User = ({ user }) => {
  const {email} = user;
  const [room, setRoom] = useState(null);
  const [hostelers, setHostelers] = useState([]);
  const [msg, setMsg] = useState("Some Error occurred, try again");
  const [admin,setadmin]=useState(null);
  const [hostelname,sethostelname]=useState(null);
  const [floor,setfloor]=useState(null);

  useEffect(() => {
    const findHostelRoom = async () => {
      const bodydata = {
        user_email: email,
        justcheck: 1,
      };
      try {
        const response = await fetch(`http://localhost:4000/api/auth/bookroom`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodydata),
        });

        const data = await response.json();

        if (response.status === 200) {
          setRoom(data.room);
          sethostelname(data.hostel);
          setadmin(data.admin);
          setfloor(data.floor);

          const otherHostelers = data.room.hostelers.filter(
            (hosteler) => hosteler.email !== email
          );

          const hostelerDetails = [];
          for (const hosteler of otherHostelers) {
            const userResponse = await fetch(`http://localhost:4000/api/auth/finduser`,{
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: hosteler.email }),
            });

            if (userResponse.status === 200) {
              const userData = await userResponse.json();
              hostelerDetails.push(userData.user);
            }
          }

          setHostelers(hostelerDetails);
        } else {
          setMsg(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };

    findHostelRoom();
  }, [email]);

  const leaveroom=async()=>{
    const bodydata = {
      user_email: email,
      hostel_email: admin.email,
      room:room.number,
      floor:floor
    };
    try {
      const response = await fetch(`http://localhost:4000/api/auth/leaveroom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodydata),
      });

      const data = await response.json();

      if (response.status === 200) {
        setRoom(null);
        sethostelname(null);
        setadmin(null);
        setfloor(null);
        setMsg("Get yourself a room by browsing them at hostels")
      } else {
        setMsg(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (!user) {
    return <Loader />;
  }

  return (
    <>
      <Navbar selected="1" user={user} />
      <div className="display">
        <h2>Room Details</h2>
        {room ? (
          <>
            <div className="room-info">
              <p>
                Hostel Name: <span>{hostelname}</span>
              </p>
              <div className="room-info-more">
              <p>
                Room Number: <span>{room.number}</span>
              </p>
              <p>
                Floor Number: <span>{floor}</span>
              </p>
              <button className="edit2btn edit2btnext" onClick={leaveroom}>Leave Room</button>
              </div>
            </div>
            <h3>Hostelers</h3>
            <ul>
              {hostelers.length > 0 ? (
                hostelers.map((hosteler) => (
                  <li key={hosteler.email}>
                    <div>
                      <p>
                        <span>Name:</span> {hosteler.name}
                      </p>
                      <p>
                        <span>Email:</span> {hosteler.email}
                      </p>
                      <p>
                        <span>Mobile:</span> {hosteler.mobile || "N/A"}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <p>No other hostelers found in this room.</p>
              )}
            </ul>
            <div className="contact-hostel">
              <h3>Contact Hostel</h3>
              <p>
                <span>Admin Name:</span> {admin ? admin.name : "N/A"}
              </p>
              <p>
                <span>Email:</span> {admin ? admin.email : "N/A"}
              </p>
              <p>
                <span>Mobile:</span> {admin ? admin.mobile : "N/A"}
              </p>
            </div>
          </>
        ) : (
          <p>{msg}</p>
        )}
      </div>
    </>
  );
};

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

export default User;
