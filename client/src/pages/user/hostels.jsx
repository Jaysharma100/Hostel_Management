  import { useEffect, useState } from "react"
  import Loader from "../../components/loader.jsx"
  import "../../design/loader.css"
  import Navbar from "../../components/navbar"
  import "../../design/hostels.css"
  import backgroundImage from "../../assets/background.jpg";
  import PropTypes from "prop-types"


  const Hostels = ({user}) => {

    //hold states
    const [hostels,sethostels]=useState(null);
    const [error,seterror]=useState(null);
    const [details,setdetails]=useState(null);
    const [expandedRoom, setExpandedRoom] = useState(null);
    const [popupHostelers, setPopupHostelers] = useState([]);
    const [filteredHostels, setFilteredHostels] = useState(null);
    const [bookingRoomDetails, setBookingRoomDetails] = useState(null);
    const [bookingTimer, setBookingTimer] = useState(300); // 300 seconds = 5 minutes
    const [email,setemail]=useState(user.email);
    
    
    //query states
    const [namequery,setnamequery]=useState(null);
    const [locquery,setlocquery]=useState(null);
    
    //flag states
    const [openthis1,setopenthis1]=useState(0);
    const [openthis2,setopenthis2]=useState(0);
    const [visibleFloors, setVisibleFloors] = useState([0, 6]);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [isHostelerPopupOpen, setIsHostelerPopupOpen] = useState(false);
    const [bookingPopupVisible, setBookingPopupVisible] = useState(false);
    
    const handlehostelfetch=async()=>{
      try{  
        const response=await fetch('http://localhost:4000/api/auth/hostelfetch',{
          method:'GET',
        })

        const data=await response.json();
        if(response.status===200){
          sethostels(data.hostels);
        }
        else{
          seterror(data.message);
        }
      }
      catch(err){
        console.log(err);
      }
    }

    useEffect(()=>{
      if(user){
        handlehostelfetch();
      }
    },[user])

    useEffect(() => {
      if (hostels) {
        const filtered = hostels.filter(({ hostel }) => {
          const matchesName = namequery ? hostel.name.toLowerCase().includes(namequery.toLowerCase()) : true;
          const matchesLocation = locquery ? hostel.location.toLowerCase().includes(locquery.toLowerCase()) : true;
          return matchesName && matchesLocation;
        });
        setFilteredHostels(filtered);
      }
    }, [namequery, locquery, hostels]);

    
    useEffect(() => {
      if (bookingPopupVisible) {
        if (bookingTimer > 0) {
          const timer = setInterval(() => setBookingTimer((prev) => prev - 1), 1000);
          return () => clearInterval(timer);
        } else {
          setBookingPopupVisible(false);
          setBookingRoomDetails(null);
          seterror("Timeout! Try again");
        }
      }
    }, [bookingPopupVisible, bookingTimer]);

    if(!(user && hostels)){
      return <Loader/>
    }


    const handleviewclick=(e)=>{
      setdetails(e);
      setopenthis1(1);
    }

    const handlebook=()=>{
      setopenthis1(0);
      setopenthis2(1);
    }

    const handleNextFloors = () => {
      if (visibleFloors[1] < Object.keys(details.hostel.floors).length) {
        setVisibleFloors([visibleFloors[0] + 6, visibleFloors[1] + 6]);
      }
    };

    const handlePreviousFloors = () => {
      if (visibleFloors[0] > 0) {
        setVisibleFloors([visibleFloors[0] - 6, visibleFloors[1] - 6]);
      }
    };

    const handleFloorClick = (floorNumber) => {
      setSelectedFloor(floorNumber);
    };

    const handleViewHostelersPopup = (hostelers) => {
      setPopupHostelers(hostelers);
      setIsHostelerPopupOpen(true);
    };

    const handlebookclick=async()=>{
      seterror(null);
      const bodydata={
      email:details.admin.email,
      floorNumber:selectedFloor,
      roomNumber:expandedRoom,
      isopen:bookingPopupVisible
      }
      try{
      const response=await fetch('http://localhost:4000/api/auth/lockroom',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodydata)
      })

      const data=await response.json();
      if(response.status===200){
      console.log(data.message);
      if(data.open===1){
        setBookingPopupVisible(true);
        setBookingTimer(300);
      }
      else{
        setBookingPopupVisible(false);
      }
      }
      else{
      seterror(data.message);
      setBookingRoomDetails(null);
      }
      }
      catch(err){
      setBookingRoomDetails(null);
      console.log(err);
      }
    }

    const handleconfirmbook=async()=>{
      const bodydata={
        email:details.admin.email,
        floorNumber:selectedFloor,
        roomNumber:expandedRoom,
        user_email:email
       }
       try{
       const response=await fetch('http://localhost:4000/api/auth/bookroom',{
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodydata)
       })

       const data=await response.json();
       if(response.status==200){
        setemail(user.email);
        setBookingPopupVisible(false);
        handlehostelfetch()
        setopenthis2(false)
       }
       else{
        seterror(data.message);
       }
       }
       catch(err){
        console.log(err);
       }

    }

    return (
      <>
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
      <div className={`hostelsmain ${(openthis1 || openthis2)?"blurred":""}`}>
        <Navbar selected="2" user={user}/>
        <div className="hostel">
          <div className="search">
            <div className="searchby">
              <span className="searchtitle">Search By Name</span>
              <input type="text" value={namequery} onChange={(e)=>setnamequery(e.target.value)} />
            </div>
            <div className="searchby">
              <span className="searchtitle">Search By Location</span>
              <input type="text" value={locquery} onChange={(e)=>setlocquery(e.target.value)} />
            </div>
            <button className="edit2btn edit2btnext" onClick={() => { setnamequery(""); setlocquery(""); }}>Clear</button>
          </div>
          <div className="displaysearchresult">
            <table className="hostel-table">
              <thead>
                <tr>
                  <th>Serial No</th>
                  <th>Hostel Name</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(filteredHostels || hostels).map((details, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{details.hostel.name}</td>
                    <td>{details.hostel.location}</td>
                    <td>
                      <button className="edit2btn edit2btnext" onClick={()=>handleviewclick(details)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {openthis1 ?
        <div className="popup">
          <div className="popuptop">
            <h2>Hostel Details</h2>
            <button
              className="edit2btn edit2btnext extadd2btn"
              onClick={() =>{setdetails(null);setopenthis1(0)}}
            >
              X
            </button>
          </div>
          <div className="popupadd">
            <button className="edit2btn popupbook" onClick={handlebook}>Book a Room</button>
            <span className="highlight">Hostel Name:</span>
            <span style={{fontSize:"3vh"}}>{details.hostel.name}</span>

            <span className="highlight">Location:</span>
            <span style={{fontSize:"3vh"}}>{details.hostel.location}</span>

            <span className="highlight">Description:</span>
            <span style={{fontSize:"3vh"}}>{details.hostel.description}</span>

            <span className="highlight">Admin:</span>
            <span style={{fontSize:"3vh"}}>{details.admin.name}</span>

            <span className="highlight">Admin Contact:</span>
            <span style={{fontSize:"3vh"}}>{details.admin.email}</span>
            <span style={{fontSize:"3vh"}}>{details.admin.mobile}</span>
          </div>
        </div>
        :
        <></>
      }

      {openthis2 ? (
        <div className={`popupext ${(isHostelerPopupOpen || bookingPopupVisible)?"blurred":""}`}>
          <div className="popuptop">
            <h2>Book a Room in {details.hostel.name}</h2>
            <button
              className="edit2btn edit2btnext extadd2btn"
              onClick={() => {
                setdetails(null);
                setopenthis2(0);
              }}
            >
              X
            </button>
          </div>
          <div className="popupdetailsext popupadd">
            <div className="choosefloor">
              <button
                className="nav-btn"
                disabled={visibleFloors[0] === 0}
                onClick={handlePreviousFloors}
              >
                &lt;
              </button>
              {Object.keys(details.hostel.floors)
                .slice(visibleFloors[0], visibleFloors[1])
                .map((floorNumber, index) => (
                  <button
                    key={index}
                    className={`floor-btn ${
                      selectedFloor === floorNumber ? "selected" : ""
                    }`}
                    onClick={() =>{handleFloorClick(floorNumber);setExpandedRoom(null)}}
                  >
                    Floor {floorNumber}
                  </button>
                ))}
              <button
                className="nav-btn"
                disabled={visibleFloors[1] >= Object.keys(details.hostel.floors).length}
                onClick={handleNextFloors}
              >
                &gt;
              </button>
            </div>

            <div className="rooms">
              {selectedFloor &&
                details.hostel.floors[selectedFloor]?.map((room, idx) => (
                  <div
                    key={idx}
                    className={`room ${
                      expandedRoom === room.number ? "expanded" : ""
                    } ${
                      room.hostelers.length === room.capacity
                        ? "full"
                        : room.hostelers.length >= room.capacity / 2
                        ? "half-full"
                        : "available"
                    }`}                    
                    onClick={() =>
                      setExpandedRoom(room.number)
                    }
                  >
                    <span>Room Number: {room.number}</span>
                    {expandedRoom === room.number && (
                      <>
                        <span>Capacity: {room.capacity}</span>
                        <span>Hostelers: {room.hostelers.length}</span>
                        <button
                          className="view-hostelers-btn"
                          onClick={() => handleViewHostelersPopup(room.hostelers)}
                        >
                          View Hostelers
                        </button>
                        <span>{room.capacity - room.hostelers.length} seats remaining</span>
                        {room.hostelers.length < room.capacity && ( // Only show if room is not full
                          <button
                            className="book-btn"
                            onClick={() => {
                              handlebookclick();
                              setBookingRoomDetails(room);
                            }}
                          >
                            Book
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}
            </div>
          </div>
          <span>{error}</span>
        </div>
      )
      :
      <></>
      }

      {isHostelerPopupOpen ? (
        <div className="hostelers-popup">
          <div className="hostelers-popup-header">
            <h2>Hostelers</h2>
            <button
              className="edit2btn edit2btnext extadd2btn"
              onClick={() => setIsHostelerPopupOpen(false)}
            >
              X
            </button>
          </div>
          <div className="hostelers-popup-content">
            {popupHostelers.map((hosteler, idx) => (
              <div key={idx} className="hosteler-item">
                <span>{idx+1}</span>
                <div className="flexcolumn">
                  <span>Email: {hosteler.email}</span>
                  <span>Joined: {new Date(hosteler.joinedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
      :
      <></>
      }

      {bookingPopupVisible && bookingRoomDetails && (
        <div className="booking-popup">
          <div className="booking-popup-header">
            <h2>Complete Your Booking</h2>
            <button
              className="edit2btn edit2btnext extadd2btn"
              onClick={() =>handlebookclick()}
            >
              X
            </button>
          </div>
          <div className="booking-popup-content">
            <div className="timer">
              <strong>Time Remaining:</strong> {`${Math.floor(bookingTimer / 60)}:${String(bookingTimer % 60).padStart(2, '0')}`}
            </div>
            <div className="summary">
              <h3>Summary</h3>
              <p><strong>Room Number:</strong> {bookingRoomDetails.number}</p>
              <p><strong>Monthly Amount:</strong> Rs. XXXX</p>
              <p><strong>Available Seats:</strong> {bookingRoomDetails.capacity - bookingRoomDetails.hostelers.length}</p>
            </div>
            <div className="hostelers">
              <h3>Roommates</h3>
              {bookingRoomDetails.hostelers.length > 0 ? (
                bookingRoomDetails.hostelers.map((hosteler, idx) => (
                  <div key={idx} className="hosteler-item">
                    <span>{idx + 1}. {hosteler.email}</span>
                  </div>
                ))
              ) : (
                <p>No roommates currently.</p>
              )}
            </div>
            <button
              className="confirm-btn"
              onClick={() => {
                handleconfirmbook(  )
              }}
            >
              Confirm Booking
            </button>
          </div>
          <span>{error}</span>
        </div>
      )}

      </>
    )
  }

  export default Hostels

  Hostels.propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      hostel: PropTypes.string,
    }).isRequired,
  };
