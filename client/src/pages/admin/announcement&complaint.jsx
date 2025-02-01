import { useState, useEffect } from "react";
import Loader from "../../components/loader.jsx"
import "../../design/loader.css"
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../../design/announcement&complaint.css";
import backgroundImage from "../../assets/background.jpg";

const Anncomp = ({user}) => {
  const [openthis1, setopenthis1] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [complaints_reply,setcomplaints_reply]=useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [reply,setreply]=useState(null);
  const [selecthosteler,setselecthosteler]=useState(null);
  const [email,setemail]=useState(user.email);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/auth/announcement",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email:email}),
        });
        const data = await response.json();
        if (response.ok) {
          setAnnouncements(data.announcements);
          setemail(email);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchcomplaints_reply = async()=>{
      try {
        const response = await fetch("http://localhost:4000/api/auth/complaints_reply",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({To:email}),
        });
        const data = await response.json();
        if (response.ok) {
          setcomplaints_reply(data.comp_reply);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if(user){
      if (openthis1 === 0) {
        fetchAnnouncements();
      }

      if(openthis1===1){
        fetchcomplaints_reply();
      }
    }

  }, [openthis1,email,user]);

  if (!user) {
    return <Loader/>;
  }

  const handlegetann = () => {
    setopenthis1(0);
  };

  const handlegetcomplaint = () => {
    setopenthis1(1);
  };

  const handleAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    try {
      const response = await fetch("http://localhost:4000/api/auth/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email:email,message: newAnnouncement }),
      });
      const data = await response.json();
      if (response.ok) {
        setAnnouncements(data.announcements);
        setNewAnnouncement("");
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
  
  const handlereply=async()=>{
    // if (!reply.trim()) return;
    try {
      const response = await fetch("http://localhost:4000/api/auth/complaints_reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({To:email,from:selecthosteler,message:reply,type:"reply"}),
      });
      const data = await response.json();
      if (response.ok) {
        setcomplaints_reply(data.comp_reply);
        setreply("");
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="anncomp">
        <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: `url(${backgroundImage})`,
        opacity:"0.7",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        zIndex: -1,
        }}></div>
        <div className="selecttop">
          <span
            className={`selectone edit2btn ${openthis1 ? " " : "addcolor"}`}
            onClick={handlegetann}
          >
            Announcement
          </span>
          <span
            className={`selectone edit2btn ${openthis1 ? "addcolor" : " "}`}
            onClick={handlegetcomplaint}
          >
            Complaints
          </span>
          <span
            className="edit2btn edit2btnext backbtn"
            onClick={() => navigate("/admin")}
          >
            {"<<BACK"}
          </span>
        </div>
        {openthis1 === 0 ? (
          <div className="displayann">
            <div className="past-announcements">
              {announcements.map((ann, index) => (
                <div key={index} className="announcement">
                  <span className="timestamp">{ann.createdAt && new Date(ann.createdAt).toLocaleString()}</span>
                  <span>{ann.text}</span>
                </div>
              ))}
            </div>
            <div className="add-announcement">
              <textarea
                type="text"
                placeholder="Write your announcement..."
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
              />
              <button onClick={handleAnnouncement}>Announce!</button>
            </div>
          </div>
        ) : (
          <div className="displaycomplaint">
            <div className="from">
              <span>Complaints</span>
              {complaints_reply && complaints_reply.map((comp,index)=>(
                <div className="fromhosteler" key={index} onClick={()=>{setselecthosteler(comp.email)}}>
                  <span className="hostelername">{comp.name}</span>
                  <span className="hosteleremail">{comp.email}</span>
                </div>
              ))}
            </div>
            <div className="see_add">
              {selecthosteler ? (
                complaints_reply
                  .filter((comp) => comp.email === selecthosteler)
                  .map((comp, index) => (
                    <div key={index} className="comp_reply">
                      {comp.messages && 
                        comp.messages.slice().reverse().map((msg, msgIndex) => (
                          <div className={`single-message ${msg.type}`} key={msgIndex}>
                            <span className="message-timestamp" style={{fontSize:"2.4vh"}}>
                              {new Date(msg.createdAt).toLocaleString()}  
                            </span>
                            <span className="message-text">{msg.text}</span>
                          </div>
                        ))}
                    </div>
                  ))
              ) : (
                <span>Select a Hosteler to view its complaint</span>
              )}
              {selecthosteler &&
              <div className="addcomplaints">
                <textarea className="complaintadd" value={reply} onChange={(e)=>{setreply(e.target.value)}}></textarea>
                <button className="edit2btn edit2btnext" onClick={handlereply}>Reply!</button>
              </div>
              }
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Anncomp;

Anncomp.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    hostel: PropTypes.string,
  }).isRequired,
};
