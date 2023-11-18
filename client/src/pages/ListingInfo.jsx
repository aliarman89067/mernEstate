import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaBath, FaBed, FaCar, FaDirections, FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function ListingInfo() {
  const { currentUser } = useSelector((state) => state.user);
  const [mailShow, setMailShow] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  SwiperCore.use([Navigation]);
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  useEffect(() => {
    fetch(`/api/listing/listing-info/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListing(data);
        fetchUserData(data.userRef);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  const fetchUserData = async (id) => {
    const res = await fetch(`/api/user/get-user/${id}`);
    const data = await res.json();
    if (data.success === false) {
      console.log(data.message);
      return;
    }
    setUser(data);
  };
  if (!listing) {
    return (
      <div className="max-w-6xl mx-auto">
        <p className="text-slate-700 mx-4">Loading...</p>
      </div>
    );
  }
  const handleHideMail = () => {
    setTimeout(() => {
      setMailShow(false);
    }, 1000);
  };
  return (
    <div>
      <div className="-mt-8">
        {/* Swiper */}
        <Swiper navigation>
          {listing?.imageUrl &&
            listing?.imageUrl.length > 0 &&
            listing?.imageUrl.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[400px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-2">
        {/* Content */}
        <div className="flex flex-col gap-2 items-start justify-start">
          <h1 className="text-xl text-slate-700 font-semibold">
            {listing?.title}
          </h1>
          <a
            className="text-slate-700 underline flex items-center gap-1"
            href={`https://www.google.com/maps/place/${listing?.address}`}
            target="_blank"
          >
            <FaDirections />
            {listing?.address}
          </a>
          <p className="text-slate-600">{listing?.description}</p>
          <div>
            {listing?.offer ? (
              <div className="flex items-center gap-2">
                <p className="font-semibold text-xl line-through text-slate-400">
                  ${listing?.regularPrice.toLocaleString("en-us")}
                </p>
                <p className="font-semibold text-xl text-slate-700">
                  ${listing?.discountPrice.toLocaleString("en-us")}
                </p>
                {listing?.type === "sale" ? (
                  <p className="font-semibold text-xl text-green-600">
                    For Sale
                  </p>
                ) : listing?.type === "rent" ? (
                  <p className="font-semibold text-xl text-green-600">
                    For Rent
                  </p>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-semibold text-xl text-slate-700">
                  ${listing?.regularPrice.toLocaleString("en-us")}
                </p>
                {listing?.type === "sale" ? (
                  <p className="font-semibold text-xl text-green-600">
                    For Sale
                  </p>
                ) : listing?.type === "rent" ? (
                  <p className="font-semibold text-xl text-green-600">
                    For Rent
                  </p>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xl text-slate-700 flex items-start gap-1">
              <FaBed className="mt-1" />
              <span className="text-lg">BedRooms</span>
              {listing?.bedRooms}
            </p>
            <p className="text-xl text-slate-700 flex items-start gap-1">
              <FaBath className="mt-1" />
              <span className="text-lg">BathRooms</span>
              {listing?.bathRooms}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p
              className={`flex items-center gap-1 text-xl ${
                listing?.furnished
                  ? "text-slate-700"
                  : "text-slate-400 line-through"
              }`}
            >
              <FaHome />
              Furnished
            </p>
            <p
              className={`flex items-center gap-1 text-xl ${
                listing?.parking
                  ? "text-slate-700"
                  : "text-slate-400 line-through"
              }`}
            >
              <FaCar />
              Parking
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto mt-4">
        {/* Contact */}
        {currentUser && listing?.userRef !== currentUser._id && (
          <div>
            {!mailShow ? (
              <button
                onClick={() => setMailShow(true)}
                className="w-full py-4 rounded-lg bg-slate-600 text-white hover:opacity-90 transition-opacity duration-300"
              >
                Contact To Landlord
              </button>
            ) : (
              <div>
                <textarea
                  placeholder="Enter Message"
                  className="w-full h-[8rem] resize-none border border-gray-300 shadow-lg rounded-xl outline-none p-2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <Link
                  onClick={handleHideMail}
                  to={`mailto:${user?.email}?subject=Regarding ${listing.title}&body=${message}`}
                  className="flex items-center justify-center w-full h-full py-4 rounded-lg bg-slate-600 text-white hover:opacity-90 transition-opacity duration-300"
                >
                  Send Message
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
