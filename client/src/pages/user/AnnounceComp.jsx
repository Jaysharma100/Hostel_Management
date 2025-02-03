  import { useEffect, useState,useRef } from "react";
  import Navbar from "../../components/navbar";
  import PropTypes from "prop-types";
  import Loader from "../../components/loader.jsx";
  import "../../design/loader.css";
  import "../../design/AnnounceComp.css"
  import backgroundImage from "../../assets/background.jpg";

  const AnnounceComp = ({ user }) => {
    const [admin, setAdmin] = useState(null);
    const [announcements, setAnnouncements] = useState([]);
    const [msg, setMsg] = useState(null);
    const [showthis1, setShowthis1] = useState(0);
    const [openthis1, setOpenthis1] = useState(0);
    const messagesEndRef = useRef(null);
    const [comp_reply,setcomp_reply]=useState(null);
    const [complaint, setComplaint] = useState("");

    useEffect(() => {
      const fetchHostelDetails = async () => {
        const bodydata = {
          user_email: user.email,
          justcheck: 1,
        };

        try {
          const response = await fetch(`https://hostel-management-app-cx6f.onrender.com/api/auth/bookroom`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodydata),
          });

          const data = await response.json();

          if (response.status === 200) {
            setAdmin(data.admin);

            const annBodyData = {
              email: data.admin.email,
              justcheck: 1,
            };

            const annResponse = await fetch(`https://hostel-management-app-cx6f.onrender.com/api/auth/announcement`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(annBodyData),
            });

            const annData = await annResponse.json();

            if (annResponse.status === 200) {
              if(!annData.announcements==[])
              setAnnouncements(annData.announcements.messages);
              setShowthis1(1);
            } else {
              setMsg(annData.message);
            }

            const compBodyData = {
              To: data.admin.email,
              from: user.email,
            };

            const compResponse = await fetch(`https://hostel-management-app-cx6f.onrender.com/api/auth/complaints_reply`,{
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(compBodyData),
            });

            const compData = await compResponse.json();

            if (compResponse.status === 200) {
              setcomp_reply(compData.messages);
            } else {
              setMsg(compData.message);
            }
          } else {
            setMsg(data.message);
          }
        } catch (err) {
          console.error(err);
          setMsg("An error occurred while fetching details.");
        }
      };

      fetchHostelDetails();
    }, [user.email]);

    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [announcements]);

    const handleComplaintReply = async () => {
      if (!complaint.trim()) return;
      try {
        const response = await fetch("https://hostel-management-app-cx6f.onrender.com/api/auth/complaints_reply", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            To: admin.email,
            from: user.email,
            message: complaint,
            type:"complaint"
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          setcomp_reply(data.comp_reply);
          setComplaint("");
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };


    if (!user) {
      return <Loader />;
    }

    return (
      <>
        <Navbar selected="3" user={user} />
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
        <div className="announcement-container">
          {showthis1 === 0 ? (
            msg ? (
              <p>{msg}</p>
            ) : (
              <Loader />
            )
          ) : (
            <div className="anncomp addtoanncomp">
              <div className="selecttop">
                <span
                  className={`selectone edit2btn extrafont ${openthis1 === 0 ? "addcolor" : ""}`}
                  onClick={() => setOpenthis1(0)}
                >
                  Announcement
                </span>
                <span
                  className={`selectone edit2btn extrafont ${openthis1 === 1 ? "addcolor" : ""}`}
                  onClick={() => setOpenthis1(1)}
                >
                  Complaints
                </span>
              </div>
              {openthis1 === 0 ? (
                <div className="displayann">
                  {announcements.length === 0 ? (
                    <p>No announcements right now.</p>
                  ) : (
                    <div className="past-announcements">
                      {announcements.map((ann, index) => (
                        <div key={index} className="announcement">
                          <span className="timestamp message-timestamp">
                            {ann.createdAt && new Date(ann.createdAt).toLocaleString()}
                          </span>
                          <span>{ann.text}</span>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>              
              ) : (
              <div className="see_add addtosee_add">
                <div className="comp_reply ">
                  {comp_reply && comp_reply.map((msg, index) => (
                    <div key={index} className={`single-message ${msg.type}`}>
                      <span className="message-timestamp">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                      <span className="message-sender">
                        {msg.type === "reply" ? `Admin: ${admin.name}` : `You:`}
                      </span>
                      <span className="message-text">{msg.text}</span>
                    </div>
                  ))}
                </div>

                <div className="addcomplaints">
                  <textarea
                    className="complaintadd"
                    value={complaint}
                    onChange={(e) => setComplaint(e.target.value)}
                    placeholder="Write your complaint..."
                  ></textarea>
                  <button className="edit2btn edit2btnext" onClick={handleComplaintReply}>
                    Submit
                  </button>
                </div>
              </div>
            )}
            </div>
          )}
        </div>
      </>
    );
  };

  AnnounceComp.propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      hostel: PropTypes.string,
    }).isRequired,
  };

  export default AnnounceComp;
