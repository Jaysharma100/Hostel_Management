import jwt from "jsonwebtoken"

function verifyjwt(role){
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
    
        if (!token) {
          return res.status(401).json({ success: false,message: "Unauthorized!"});
        }
    
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded; 
          if (role && req.user.role !== role) {
            return res.status(403).json({ success: false, message: "Forbidden" });
          }
    
          next();
        } catch (error) {
          return res.status(403).json({ success: false, message: "Invalid Token" });
        }
    };
}

export default verifyjwt;