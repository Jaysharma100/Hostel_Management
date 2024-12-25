import { useState } from "react"
import "../../design/announcement&complaint.css"

const Anncomp = () => {
  const [openthis1,setopenthis1]=useState(0);

  const handlegetann=()=>{
    setopenthis1(0);
  }

  const handlegetcomplaint=()=>{
    setopenthis1(1);
  }

  return (
    <>
    <div className="anncomp">
        <div className="selecttop">
          <span className="selectone edit2btn" onClick={handlegetann}>Announcement</span>
          <span className="selectone edit2btn" onClick={handlegetcomplaint}>Complaints</span>
          <span className="edit2btn edit2btnext backbtn">{"<<< BACK"}</span>
        </div>
        {openthis1===0?
          <div className="displayann">
            hii
          </div>
          :
          <div className="displaycomplaint">
            hello
          </div>
        }
    </div>
    </>
  )
}

export default Anncomp
