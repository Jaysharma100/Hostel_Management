import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const Privateroute = ({ path, children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("verification_token");
      console.log(token);
      if (!token) {
        // If no token, check if the path is login. If it's login, allow access.
        if (path === "/login" || path==="/signup") {
          setIsAuthorized(true);
        } else {
          navigate("/login", { replace: true }); // Redirect to login
        }
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/api/auth/verify", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path }),
        });

        if (response.status === 200) {
          const data = await response.json();
          setuser(data.user);
          if (!data.redirect) {
            setIsAuthorized(true);
          } else {
            navigate(data.redirect, { replace: true });
          }
        } else {
                                                                //same as done before
          if (path === "/login" || path==="/signup") {
            setIsAuthorized(true);
          } 
          else
          navigate("/login", { replace: true }); 
        }
      } catch (err) {
        console.log(err);
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [path, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? React.cloneElement(children, { user }) : null;
};

Privateroute.propTypes = {
  path: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Privateroute;
