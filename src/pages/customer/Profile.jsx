import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, Routes, Route, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {CustomerNavbar} from "../../components/Navbars"

const Profile = () => {
    return(
        <div className="container">
            <CustomerNavbar />
            <h1>Edit Profile</h1>
            
        </div>
    );

};
export default Profile;