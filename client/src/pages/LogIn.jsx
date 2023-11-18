import React, { useState } from "react";
import { houseImage, logo } from "../images";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import GoogleAuth from "../components/GoogleAuth";

export default function LogIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let alertArray = [];
    setLoading(true);
    try {
      if (formData.email && formData.password) {
        const res = await fetch("/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          if (
            data.message === "User Not Found!" ||
            data.message === "Password Is Not Correct!"
          ) {
            setLoading(false);
            setAlertText(data.message);
            setShow(true);
          }
          return;
        }
        dispatch(loginSuccess(data));
        navigate("/");
      } else {
        for (const key in formData) {
          if (formData[key] === "") {
            alertArray.push(key);
            setAlertText(`${alertArray[0]} required`);
            setShow(true);
          }
        }
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  document.addEventListener("click", () => {
    setShow(false);
  });
  return (
    <main className="flex items-center min-h-[calc(100vh-74px)] max-w-6xl mx-auto p-4">
      <Alert show={show} setShow={setShow} alertText={alertText} />
      <div className="hidden md:inline flex-1 rounded-lg shadow-lg overflow-hidden">
        <img
          src={houseImage}
          alt="House Cover Image"
          className="hover:scale-105 transition-scale duration-300"
        />
      </div>
      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <img src={logo} alt="logo" className="w-8 object-cover" />
          <h1 className="text-slate-700 font-semibold text-3xl">
            Welcome Back
          </h1>
          <p className="text-slate-500">Enter your account details</p>
        </div>
        <div className="w-full px-[4rem]">
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <label>
              <p className="text-md text-slate-600 my-2 ml-[1.5rem]">Email</p>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full mb-3 px-5 py-3 rounded-lg border border-gray-300 outline-none"
              />
            </label>
            <label>
              <p className="text-md text-slate-600 my-2 ml-[1.5rem]">
                Password
              </p>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full mb-3 px-5 py-3 rounded-lg border border-gray-300 outline-none"
              />
            </label>
            <button
              disabled={loading}
              className="bg-slate-700 py-2 rounded-lg text-white hover:opacity-95 disabled:opacity-85"
            >
              {loading ? "Loading.." : "Log in"}
            </button>
          </form>
          <GoogleAuth />
          <p className="text-center mt-2 text-slate-600">
            Dont have account?{" "}
            <Link to={"/signup"} className="text-slate-700 underline">
              Create Now
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
