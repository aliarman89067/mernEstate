import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaSearch, FaHamburger, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { houseImage } from "../images";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/userSlice";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/user/token")
      .then(({ data }) => {
        if (data === "cookie not found") {
          dispatch(logoutSuccess(null));
        }
      })
      .catch((error) => {
        console.log(error);
      });
    const urlParams = new URLSearchParams(location.search);
    let searchText = urlParams.get("searchText");
    searchText = "";
  }, [location.search]);
  async function handleSearchClick() {
    const searchIndex = new URLSearchParams(window.location.search);
    searchIndex.set("searchText", searchText);
    const searchQuery = searchIndex.toString();
    navigate(`/search?${searchQuery}`);
  }
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div>
      <header className="shadow-lg p-4 mb-8 w-full">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link to={"/"} className="text-2xl font-semibold text-slate-600">
            Nice <span className="text-slate-700">Estate</span>
          </Link>
          <div className="hidden sm:inline rounded-full border border-gray-300 px-4 py-2 shadow-md">
            <input
              type="text"
              placeholder="Seach..."
              className="border-none outline-none w-[15rem]"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={handleSearchClick} className="text-slate-400">
              <FaSearch />
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Link to={"/"} className="text-slate-600 hover:underline">
              Home
            </Link>
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to={"/favorites"}
                  className="text-slate-600 hover:underline"
                >
                  Favorites
                </Link>
                <Link
                  to={"/profile"}
                  className="text-slate-600 hover:underline"
                >
                  Profile
                </Link>
                <Link to={"/profile"}>
                  <img
                    src={currentUser.photo}
                    alt="Profile Image"
                    className="w-8 h-8 object-cover rounded-full"
                  />
                </Link>
              </div>
            ) : (
              <Link to={"/login"} className="text-slate-600 hover:underline">
                Sign in
              </Link>
            )}
          </div>
          <div className="sm:hidden inline z-10">
            <button
              className={`${mobileMenu ? "text-white" : "text-slate-600"}`}
              onClick={() => setMobileMenu((prev) => !prev)}
            >
              <FaHamburger size={20} />
            </button>
          </div>
        </div>
      </header>
      <nav
        className={`w-[200px] flex justify-end h-screen bg-slate-600 fixed top-0 ${
          mobileMenu ? "right-[0px]" : "-right-[200px]"
        } transition-all duration-300 z-30`}
      >
        <FaTimes
          onClick={() => setMobileMenu(false)}
          className="absolute right-2 top-2 text-white text-xl cursor-pointer"
        />
        <div className="flex flex-col items-end gap-4 mt-[5rem] mr-4">
          <Link to={"/"} className="text-white hover:underline">
            Home
          </Link>
          {currentUser ? (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <Link to={"/profile"}>
                  <img
                    src={houseImage}
                    alt="Profile Image"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </Link>
                <Link to={"/profile"} className="text-white hover:underline">
                  Profile
                </Link>
              </div>
              <Link to={"/favourites"} className="text-white hover:underline">
                Favourites
              </Link>
            </div>
          ) : (
            <Link to={"/login"} className="text-white hover:underline">
              Log in
            </Link>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}
