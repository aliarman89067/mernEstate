import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import Alert from "./Alert";

export default function LikePlace({ id, color, liked }) {
  const [like, setLike] = useState(false);
  async function getLike() {
    try {
      const res = await fetch("/api/user/like-place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      const data = await res.json();
      if (data.success === false) {
        alert("Please Login First!");
        console.log(data.message);
        return;
      }
      setLike((prev) => !prev);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <button className="absolute right-2 bottom-2 text-xl">
      {like || liked ? (
        <FaHeart className={" text-red-500 " || color} />
      ) : (
        <FaHeart onClick={getLike} className={" text-white " || color} />
      )}
    </button>
  );
}
