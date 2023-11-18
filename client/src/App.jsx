import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import UserChecker from "./components/UserChecker";
import axios from "axios";
import CreateListing from "./pages/CreateListing";
import ListingInfo from "./pages/ListingInfo";
import Search from "./pages/Search";
import Favourites from "./pages/Favourites";

export default function App() {
  axios.defaults.withCredentials = true;
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/listing/:id" element={<ListingInfo />} />
          <Route path="/search" element={<Search />} />
          <Route element={<UserChecker />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/listing" element={<CreateListing />} />
            <Route path="/favorites" element={<Favourites />} />
            <Route
              path="/profile/update/listing/:id"
              element={<CreateListing />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
