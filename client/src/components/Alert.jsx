import React from "react";
import { FaTimes } from "react-icons/fa";

export default function Alert({ show, setShow, alertText }) {
  const handleAlertClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div
      onClick={handleAlertClick}
      className={`absolute w-[16rem] h-[5rem] bottom-[5%] bg-slate-600 rounded-lg shadow-lg flex justify-center items-center ${
        show ? "left-[6%]" : "left-[-24rem]"
      } transition-all duration-300 px-4 py-2 z-10`}
    >
      <p className="text-white text-md font-light">{alertText}</p>
      <button
        onClick={() => setShow(false)}
        className="absolute top-2 right-2 text-white"
      >
        <FaTimes />
      </button>
    </div>
  );
}
