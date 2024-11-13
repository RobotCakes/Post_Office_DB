import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CustomerNavbar } from "../../components/Navbars";
import '../../styles/home.css';
const History = () => {
    const userID = localStorage.getItem('userID');
    
}

export default History;