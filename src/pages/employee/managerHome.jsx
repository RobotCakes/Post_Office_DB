import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ManagerNavbar } from "../../components/Navbars";
import '../../styles/employeeHome.css';

const managerHome = () => {
    
    return (
        <ManagerNavbar />
    )
}

export default managerHome;