import "../css/Register.css";
import { useState } from "react";
import { validateEmail } from "../utils";
import { useNavigate, Link } from "react-router-dom";
import Modal from './Modal';

const PasswordErrorMessage = () => {
  return (
    <p className="FieldError">Password should have at least 8 characters</p>
  );
};

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();

  const getIsFormValid = () => {
    return (
      firstName &&
      validateEmail(email) &&
      password.length >= 8
    );
  };

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  async function handleSubmit(e) {
    e.preventDefault();

    let newUser = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      plainPass: password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/1/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(newUser),
      });
      
      if (response.ok) {
        setIsModalOpen(true);
      }
    } catch(error) {
      window.alert(error);  
      return;
    }
    clearForm();
  }

  const handleCodeSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/1/registeration/confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setIsSuccessModalOpen(true);
      } else {
        alert('Invalid verification code');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await fetch('http://localhost:5000/api/1/registeration/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        alert('New verification code has been sent to your email');
      } else {
        alert('Failed to resend verification code');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong while resending the code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <fieldset>
          <h2>Sign Up</h2>
          <div className="Field">
            <label>
              First name <sup>*</sup>
            </label>
            <input
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              placeholder="First name"
            />
          </div>
          <div className="Field">
            <label>Last name</label>
            <input
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              placeholder="Last name"
            />
          </div>
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
            {password.length < 8 ? <PasswordErrorMessage /> : null}
          </div>

          <button type="submit" disabled={!getIsFormValid()}>
            Create account
          </button>
          <p>
        Already have an account? <Link to="/login">Sign in here</Link>
      </p>
        </fieldset>
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="verification-modal">
          <h2>Email Verification</h2>
          <p>Please enter the verification code sent to your email</p>
          <form onSubmit={handleCodeSubmit}>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              maxLength="6"
            />
            <div className="verification-buttons">
              <button type="submit">Verify</button>
              <button 
                type="button" 
                onClick={handleResendCode} 
                disabled={isResending}
              >
                {isResending ? 'Resending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal isOpen={isSuccessModalOpen} onClose={() => {
        setIsSuccessModalOpen(false);
        navigate('/login');
      }}>
        <div className="success-modal">
          <h2>Registration Completed!</h2>
          <p>Your account has been successfully verified.</p>
          <Link to="/login" className="login-link">
            Go to Login Page
          </Link>
        </div>
      </Modal>
    </div>
  );
}

export default Register;