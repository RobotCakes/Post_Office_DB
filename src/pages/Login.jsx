import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/Login.css';

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
      userRef.current.focus();
  }, []);

  useEffect(() => {
      setErrMsg('');
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user, pwd);
    setSuccess(true);
  };

  return (
    <>
      {success ? (
          <section className="login-container">
              <h1>You are logged in!</h1>
              <br />
              <p>
                <Link to="/register">Register (Testing)</Link>
              </p>
          </section>
      ) : (
      <section className="login-container">
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <div className="login-form">
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                className="login-input"
            />

            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                className="login-input"
            />
            <button className="login-button">Sign In</button>
          </form>
          <p className="line">
              Need an Account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </section>
    )}
  </>
  );
};

export default Login;