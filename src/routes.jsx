import React from 'react';
import { useContext, useEffect } from "react";
import { Route, Routes, useRoutes } from "react-router-dom";
import { Session } from "../../server/trpc/auth/auth";
import { AuthContext, AuthProvider } from "./auth/SessionProvider";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Tracking from "./pages/trackPac";

const baseRoutes = [
    { path: "/", index: true, element: <Home />, label: "Home", isNav: true },
    { path: "signup", element: <Signup />, label: "Signup", isNav: false },
    { path: "login", element: <Login />, label: "Login", isNav: false },
    { path: "track-package", element: <Tracking />, label: "Tracking", isNav: false },
    { path: "profile", element: <Profile />, label: "Profile", isNav: false },
    { path: "store", element: <Products />, label: "Store", isNav: true },
  ];

