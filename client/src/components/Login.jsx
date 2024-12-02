import { useNavigate, Link } from "react-router-dom";
import "../css/Login.css";

import { useState } from "react";
import api from '../services/api';

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

    try {
      const response = await api.post('/login', {
        email,
        password
      });

      if (response.status === 200) {
        localStorage.setItem("email", email);
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }

    clearForm();
  }

  return (
    
    <div className="App">
      <div className="form-container">
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
            <p className="form-footer">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </fieldset>
        </form>
      </div>
    </div>

  );
}

export default Login;
