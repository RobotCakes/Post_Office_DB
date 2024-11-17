import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GuestNavbar } from "../components/Navbars";
import axios from 'axios';
import '../styles/Signup.css';

const USER_REGEX = /^[A-z0-9-_]{4,20}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$]).{8,20}$/;

const Signup = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [showPwd, setShowPwd] = useState(false); // Toggle password visibility

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);
    const [showMatchPwd, setShowMatchPwd] = useState(false); // Toggle confirm password visibility

    const [accountType, setAccountType] = useState('personal');

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd && matchPwd !== '');
    }, [pwd, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd]);

    // ------------ASHLEY-------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2 || !validMatch) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            
            const response = await axios.post('https://post-backend-2f54f7162fc4.herokuapp.com/guest/signup', {
                username: user,
                password: pwd,
                accountType: accountType
            });

            if (response.data.message === 'Signup successful') {
                setSuccess(true);
                console.log("Signup success");
            }
        } catch (error) {
            console.error('Signup error:', error);
            if (error.response && error.response.data.message) {
                setErrMsg(error.response.data.message); // Mostly to handle matching usernames
            } else {
                setErrMsg('Signup failed, please try again');
            }
        }
    };
    // ------------ASHLEY (END)-------------------------------------------------

    return (
        <div className="container">
            <GuestNavbar />
            {success ? (
                <section className="signup-container">
                    <h1>Success!<br /></h1>
                    <p>Your account has been created successfully. <br />
                        <Link to="/login" className="btn">Sign In</Link>
                    </p>
                </section>
            ) : (
                <section className="signup-container">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <div className="signup-form">
                        <h1>Sign-Up</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">
                                Username:
                                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                                aria-invalid={validName ? "false" : "true"}
                                onFocus={() => setUserFocus(true)}
                                onBlur={() => setUserFocus(false)}
                                className="signup-input"
                            />

                            <label htmlFor="password">
                                Password:
                                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                            </label>
                            <div className="password-container">
                                <input
                                    type={showPwd ? "text" : "password"} // Toggle visibility
                                    id="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                    aria-invalid={validPwd ? "false" : "true"}
                                    onFocus={() => setPwdFocus(true)}
                                    onBlur={() => setPwdFocus(false)}
                                    className="signup-input"
                                />
                                <button type="button" onClick={() => setShowPwd(prev => !prev)}>
                                    <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
                                </button>
                            </div>

                            <label htmlFor="confirmPwd">
                                Confirm Password:
                                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                            </label>
                            <div className="password-container">
                                <input
                                    type={showMatchPwd ? "text" : "password"} // Toggle visibility
                                    id="confirmPwd"
                                    onChange={(e) => setMatchPwd(e.target.value)}
                                    value={matchPwd}
                                    required
                                    aria-invalid={validMatch ? "false" : "true"}
                                    onFocus={() => setMatchFocus(true)}
                                    onBlur={() => setMatchFocus(false)}
                                    className="signup-input"
                                />
                                <button type="button" onClick={() => setShowMatchPwd(prev => !prev)}>
                                    <FontAwesomeIcon icon={showMatchPwd ? faEyeSlash : faEye} />
                                </button>
                                
                            </div>
                                {pwdFocus  && (
                                    <ul className="password-requirements">
                                        <li>8-20 characters</li>
                                        <li>At least one uppercase letter</li>
                                        <li>At least one lowercase letter</li>
                                        <li>At least one number</li>
                                        <li>At least one special character (!, @, or $)</li>
                                    </ul>
                                )}
                            <label htmlFor="accountType">Account Type:</label>
                                <select 
                                    id="accountType" 
                                    value={accountType} 
                                    onChange={(e) => setAccountType(e.target.value)} 
                                    className="signup-input"
                                >
                                    <option value="personal">Personal Account</option>
                                    <option value="business">Business Account</option>
                            </select>

                            <button className="signup-button" disabled={!validName || !validPwd || !validMatch}>Sign Up</button>
                        </form>
                        <p className="line">
                            Already Signed Up? <Link to="/login">Sign In</Link>
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
};

export default Signup;
