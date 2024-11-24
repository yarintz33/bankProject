import React from "react";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/1/verify-token",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          console.log("authenthication succeed!");
          if (isAuthenticated === false) setIsAuthenticated(true);
          //navigate("/");
        } else {
          console.log("not autharized!");
          if (isAuthenticated == true) {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Error verifying auth:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<Register />}></Route>
      </Routes>
      {
        // <Routes>
        //   <Route path="/" element={<Layout />}>
        //     <Route index element={<Home />} />
        //     <Route path="blogs" element={<Blogs />} />
        //     <Route path="contact" element={<Contact />} />
        //     <Route path="*" element={<NoPage />} />
        //   </Route>
        // </Routes>
      }
    </BrowserRouter>
  );
}
