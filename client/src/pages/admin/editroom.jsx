import { useState } from "react";
import PropTypes from "prop-types";
import "../../design/editroom.css";
import { useNavigate } from "react-router-dom";

const Editroom = ({user}) => {
  const navigate=useNavigate();
  const [addselect, setaddselect] = useState(0);
  const [floor, setfloor] = useState("");
  const [roomcap, setroomcap] = useState("");
  const [singleRoom, setSingleRoom] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [roomno, setroomno] = useState([]);
  const [findfloor,setfindfloor]=useState("");
  const [findroom,setfindroom]=useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showpopup2,setshowpopup2]= useState(false);
  const {email}=user;
  const [ogemail,setogemail]=useState(email);
  const [error,seterror]=useState(null);
  const [error2,seterror2]=useState(null);

  const [newroom,setnewroom]=useState("");
  const [newfloor,setnewfloor]=useState("");
  const [newcap,setnewcap]=useState("");
  const [hostelers,sethostelers]=useState([]);

  const addclass1 = addselect === 0 ? "selected" : "";
  const addclass2 = addselect === 1 ? "selected" : "";

  const handleclear=()=>{
    setfloor("");
    setroomcap("");
    setSingleRoom("");
    setRangeStart("");
    setRangeEnd("");
  }

  const handleAddToList = () => {
    if (!floor || !roomcap) {
      alert("Please fill in the Floor and Capacity fields.");
      return;
    }

    if (addselect === 0 && singleRoom) {
      const newRoom = {
        roomno: parseInt(singleRoom),
        floor: parseInt(floor),
        capacity: parseInt(roomcap),
      };
      setroomno((prev) => [...prev, newRoom]);
      handleclear();
    } else if (addselect === 1 && rangeStart && rangeEnd) {
      const start = parseInt(rangeStart);
      const end = parseInt(rangeEnd);
      if (start <= end) {
        const newRooms = Array.from({ length: end - start + 1 }, (_, i) => ({
          roomno: start + i,
          floor: parseInt(floor),
          capacity: parseInt(roomcap),
        })); 
        setroomno((prev) => [...prev, ...newRooms]);
        handleclear();
      } else {
        alert("Invalid range. Start should be less than or equal to End.");
      }
    }
  };

  const handleRemove = (index) => {
    setogemail(ogemail)
    setroomno((prev) => prev.filter((_, i) => i !== index));
  };

  const bodydata={
    hostelfind:email,
    roomdetails: roomno
  }

  const handleaddroom= async()=>{
    const response=await fetch(`http://localhost:4000/api/auth/addrooms`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodydata)
    })

    const data=await response.json();
    if(response.status===200){
      console.log(data);
      setroomno([]);
    }
    else{
      seterror(data.message);
    }
  }

  const handlefind = async () => {
    const body = {
      hostelfind:email,
      floor: findfloor,
      room: findroom,
    };
    const response = await fetch(`http://localhost:4000/api/auth/findroom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  
    const data = await response.json();
  
    if (response.status === 200) {
      console.log(data.details)
      setnewroom(data.details.number);
      setnewfloor(findfloor);
      setnewcap(data.details.capacity);
      sethostelers(data.details.hostelers || []);
      setshowpopup2(true);
    } 
    else {
      seterror2(data.message);
    }
  };

  const handleroomupdate=async()=>{
    const bodydata = {
      email: ogemail,
      ogfloor: findfloor,
      ogroom: findroom,
      newfloor,
      newroom,
      capacity: newcap,
      hostelers,
    };
  
    try{
      const response=await fetch(`http://localhost:4000/api/auth/updateroom`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodydata),
      })

      const data=await response.json();
      if(response.status===200){
        console.log(data);
        seterror("");
      }
      else{
        seterror(data.message);
      }
    }
    catch(err){
      seterror(err.message);
    }
  }
  

  return (
    <>
      <div className={`main ${(showPopup || showpopup2) ? "blurred" : ""}`}>
        <button className="edit2btn edit2btnext" id="backbtn" onClick={()=>navigate("/admin")}>{`<<< BACK`}</button>
        <h2>Add Rooms</h2>
        <div className="addroom">
          <div className="selectmode">
            <div
              className={`single selectcom ${addclass1}`}
              onClick={() => setaddselect(0)}
            >
              Add One
            </div>
            <div
              className={`multiple selectcom ${addclass2}`}
              onClick={() => setaddselect(1)}
            >
              Add Multiple Similar
            </div>
          </div>
          <span style={{color:"red"}}>(View List to Add Rooms to Hostel)</span>
          <div className="container">
            <div className="inputs">
              <div className="commonin">
                <div className="group">
                  <span>Enter Floor No.</span>
                  <input
                    type="number"
                    className="edit1"
                    value={floor}
                    onChange={(e) => setfloor(e.target.value)}
                  />
                </div>
                <div className="group">
                  <span>Enter Room Capacity</span>
                  <input
                    type="number"
                    className="edit1"
                    value={roomcap}
                    onChange={(e) => setroomcap(e.target.value)}
                  />
                </div>
              </div>
              {addselect === 0 ? (
                <>
                  <span>Enter Room number</span>
                  <input
                    type="number"
                    className="edit1"
                    value={singleRoom}
                    onChange={(e) => setSingleRoom(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <span style={{ fontSize: "4vh" }}>Enter Room number range</span>
                  <div className="roomrange">
                    <div className="group">
                      <span>From</span>
                      <input
                        type="number"
                        className="edit1"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                      />
                    </div>
                    <div className="group">
                      <span>To</span>
                      <input
                        type="number"
                        className="edit1"
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="addsubmit">
              <button className="edit2btn" onClick={handleAddToList}>Add to List</button>
              <button className="edit2btn" onClick={() => setShowPopup(true)}>View List</button>
            </div>
          </div>
          <span>{error}</span>
        </div>

        {/* editdetails */}
        <h2>Edit Room Details</h2>
        <div className="editdetails">
          <div className="find">
            <div className="findfloor">
              <span>Floor No?</span>
              <input type="number" onChange={(e)=>setfindfloor(e.target.value)}/>
            </div>
            <div className="findroom">
              <span>Room No?</span>
              <input type="number" onChange={(e)=>setfindroom(e.target.value)}/>
            </div>
            <button className="edit2btn edit2btnext" onClick={handlefind}>Edit</button>
          </div>
          <span style={{color:"red"}}>{error2}</span>
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="listtop">
              <span style={{ fontSize: "4vh" }}>Room List</span>
              <button className="edit2btn edit2btnext extadd2btn" onClick={() => setShowPopup(false)}>
                X
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Floor No</th>
                    <th>Room No</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roomno.length > 0 ? (
                    roomno.map((room, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{room.floor}</td>
                        <td>{room.roomno}</td>
                        <td>{room.capacity}</td>
                        <td>
                          <button
                            className="edit2btn edit2btnext"
                            onClick={() => handleRemove(index)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">Add Rooms to the list!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button className="edit2btn" style={{margin:"5vh 0vh 0vh 0vh"}} onClick={()=>{handleaddroom()}}>
              ADD to Hostel
            </button>
          </div>
        </div>
      )}


      {showpopup2 && (
        <div className="popup">
          <div className="popuptop">
            <h2>Edit Details</h2>
            <button
              className="edit2btn edit2btnext extadd2btn"
              onClick={() => setshowpopup2(false)}
            >
              X
            </button>
          </div>
          <div className="popupdetails">
            <div className="edit_group">
              <span>Room Number</span>
              <input
                type="number"
                value={newroom}
                onChange={(e) => setnewroom(e.target.value)}
              />
            </div>
            <div className="edit_group">
              <span>Floor Number</span>
              <input
                type="number"
                value={newfloor}
                onChange={(e) => setnewfloor(e.target.value)}
              />
            </div>
            <div className="edit_group">
              <span>Room Capacity</span>
              <input
                type="number"
                value={newcap}
                onChange={(e) => setnewcap(e.target.value)}
              />
            </div>
            <div className="hostelers-edit ">
              <span className="edit_group">Hostelers</span>
              <div className="hostelers-container">
                {hostelers.length > 0 ? (
                  hostelers.map((hosteler, index) => (
                    <div key={index} className="hosteler-row">
                      <div className="protect">
                      <span className="index_custom">{index+1}</span>
                      <input
                        type="email"
                        value={hosteler.email}
                        onChange={(e) => {
                          const updatedHostelers = [...hostelers];
                          updatedHostelers[index].email = e.target.value;
                          sethostelers(updatedHostelers);
                        }}
                        placeholder="Enter email"
                        />
                      </div>
                      <div className="hosteleropt">
                        <div className="joined-date">
                          <span>Joined:</span>
                          <span>{new Date(hosteler.joinedAt).toLocaleString()}</span>
                        </div>
                        <button
                          className="edit2btn edit2btnext"
                          onClick={() => {
                            const updatedHostelers = hostelers.filter(
                              (_, i) => i !== index
                            );
                            sethostelers(updatedHostelers);
                          }}
                          >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hostelers found.</p>
                )}
              </div>
              <button
                className="edit2btn edit2btnext"
                style={{ margin: "10px 0" }}
                onClick={() => {
                  if (hostelers.length >= newcap) {
                    alert("Cannot add more hostelers than the room's capacity.");
                    return;
                  }
                  const newHosteler = { email: "", joinedAt: new Date() };
                  sethostelers((prev) => [...prev, newHosteler]);
                }}
              >
                Add Hosteler
              </button>
            </div>
            <button
              className="edit2btn"
              onClick={() => {
                if (hostelers.length > newcap) {
                  alert(
                    `The number of hostelers exceeds the capacity (${newcap}). Adjust the hostelers list or increase the capacity.`
                  );
                  return;
                }
                handleroomupdate();
              }}
            >
              Save Changes
            </button>
            <span>{error}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Editroom;

Editroom.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    hostel: PropTypes.string,
  }).isRequired,
};