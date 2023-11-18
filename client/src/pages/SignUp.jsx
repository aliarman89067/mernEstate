import React, { useState } from "react";
import { houseImage2, logo } from "../images";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import GoogleAuth from "../components/GoogleAuth";

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    let keyNames = [];
    setLoading(true);
    try {
      if (formData.username && formData.password && formData.email) {
        setShow(false);
        const res = await fetch("/api/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          if (data.message === "This Email is Already Used") {
            setLoading(false);
            setAlertText(data.message);
            setShow(true);
          }
          return;
        } else {
          setLoading(false);
          setFormData({
            username: "",
            email: "",
            password: "",
          });
          navigate("/login");
        }
      } else {
        for (const key in formData) {
          if (formData[key] === "") keyNames.push(key);
        }
        setLoading(false);
        setAlertText(`${keyNames[0]} required`);
        setShow(true);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const handleFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  document.addEventListener("click", () => {
    setShow(false);
  });
  return (
    <main className="flex items-center min-h-[calc(100vh-74px)] max-w-6xl mx-auto p-4">
      <Alert show={show} setShow={setShow} alertText={alertText} />
      <div className="hidden md:inline flex-1 rounded-lg shadow-lg overflow-hidden">
        <img
          src={houseImage2}
          alt="House Cover Image"
          className="hover:scale-105 transition-scale duration-300"
        />
      </div>
      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="flex flex-col items-center">
          <img src={logo} alt="logo" className="w-8 object-cover" />
          <h1 className="text-slate-700 font-semibold text-3xl">
            Nice To Meet You
          </h1>
          <p className="text-slate-500">Register your account</p>
        </div>
        <div className="w-full px-[4rem]">
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <label>
              <p className="text-md text-slate-600 my-2 ml-[1.5rem]">
                Username
              </p>
              <input
                type="text"
                value={formData.username}
                id="username"
                placeholder="Enter Email"
                className="w-full mb-1 px-5 py-3 rounded-lg border border-gray-300 outline-none"
                onChange={handleFormData}
              />
            </label>
            <label>
              <p className="text-md text-slate-600 my-2 ml-[1.5rem]">Email</p>
              <input
                type="email"
                value={formData.email}
                id="email"
                placeholder="Enter Email"
                className="w-full mb-1 px-5 py-3 rounded-lg border border-gray-300 outline-none"
                onChange={handleFormData}
              />
            </label>
            <label>
              <p className="text-md text-slate-600 my-2 ml-[1.5rem]">
                Password
              </p>
              <input
                type="password"
                value={formData.password}
                id="password"
                placeholder="Enter Password"
                className="w-full mb-1 px-5 py-3 rounded-lg border border-gray-300 outline-none"
                onChange={handleFormData}
              />
            </label>
            <button
              disabled={loading}
              className="bg-slate-700 py-2 rounded-lg text-white hover:opacity-95 disabled:opacity-85"
            >
              {loading ? "Loading.." : "Sign Up"}
            </button>
          </form>
          <GoogleAuth />
          <p className="text-center mt-2 text-slate-600">
            Already have an account?{" "}
            <Link to={"/login"} className="text-slate-700 underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
