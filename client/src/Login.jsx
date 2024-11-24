import { useNavigate } from "react-router-dom";
import "./css/Login.css";

import { useState } from "react";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const clearForm = () => {
    setEmail("");
    setPassword("");
  };

  async function handleSubmit(e) {
    e.preventDefault();

    let newUser = {
      email: email,
      password: password,
    };
    try {
      const response = await fetch("http://localhost:5000/api/1/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newUser),
      });
      // .then((response) => response.json())
      // .then((data) => {
      //   console.log(data);
      // })

      if (response.ok) {
        localStorage.setItem("email", email);
        setIsAuthenticated(true);
        navigate("/");
        console.log("login success!!");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      window.alert(error);
      return;
    }

    clearForm();
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <fieldset>
          <h2>Sign In</h2>

          <div className="Field">
            <label>
              Email address <sup>*</sup>
            </label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email address"
            />
          </div>
          <div className="Field">
            <label>
              Password <sup>*</sup>
            </label>
            <input
              value={password}
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
            />
          </div>
          <button type="submit">Sign in</button>
        </fieldset>
      </form>
    </div>
  );
}

export default Login;
