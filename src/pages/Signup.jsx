import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate  } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const USER_REGEX = /^[A-z0-9-_]{4,20}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$]).{8,20}$/;
const REGISTER_URL = '/register';

const Signup = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        console.log(user, pwd);
        setSuccess(true);
    }
    return (
        <>
        {success ? (
            <section>
                <h1>Success!</h1>
                <p>
                    <Link to="/login">Sign In</Link>
                </p>
            </section>
        ) : (
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
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
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                />

                <label htmlFor="password">
                    Password:
                    <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                </label>
                <input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />

                <label htmlFor="confirmPwd">
                    Confirm Password:
                    <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                    <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                </label>
                <input
                    type="password"
                    id="confirmPwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />

                <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
            </form>
            <p>
                Already Signed Up?<br />
                <span className="line">
                    <Link to="/login">Sign In</Link>
                </span>
            </p>
        </section>
        )}
    </>
    )
}

export default Signup