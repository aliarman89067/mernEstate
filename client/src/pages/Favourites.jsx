import axios from "axios";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function Favourites() {
  SwiperCore.use([Navigation, Pagination]);
  const [listings, setListings] = useState(null);
  useEffect(() => {
    try {
      axios.get("/api/listing/liked/places").then(({ data }) => {
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListings(data);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);
  async function deleteFavourite(id) {
    await axios
      .post("/api/user/delete/favourite", { id: id })
      .then(({ data }) => {
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListings([...listings.filter((list) => list._id !== id)]);
      });
  }
  if (!listings) {
    return (
      <p className="text-lg text-gray-600 max-w-6xl mx-auto px-4">Loading...</p>
    );
  }
  if (listings.length === 0) {
    return (
      <p className="text-lg text-gray-600 max-w-6xl mx-auto px-4">
        No Liked Place Yet!
      </p>
    );
  }
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-2">
        {listings &&
          listings.length > 0 &&
          listings.map((listItem) => (
            <div
              key={listItem._id}
              className="w-[220px] sm:w-[300px] rounded-lg p-2 shadow-lg border bg-slate-300 z-0 relative"
            >
              <Swiper pagination>
                {listItem.imageUrl.length > 0 &&
                  listItem.imageUrl.map((url) => (
                    <SwiperSlide key={url}>
                      <Link to={`/listing/${listItem._id}`}>
                        <div
                          style={{
                            width: "100%",
                            height: "220px",
                            background: `url(${url}) center no-repeat`,
                            backgroundSize: "cover",
                            borderRadius: "8px",
                          }}
                        ></div>
                      </Link>
                    </SwiperSlide>
                  ))}
              </Swiper>
              <h1 className="text-slate-700 truncate mt-1">
                {listItem?.title}
              </h1>
              <p className="text-slate-500 text-sm line-clamp-2 mt-1">
                {listItem?.description}
              </p>
              <div>
                {listItem.type === "rent" ? (
                  <div>
                    {listItem.offer ? (
                      <div className="flex">
                        <p className="text-slate-500 line-through font-semibold mr-2">
                          ${listItem?.regularPrice}
                        </p>
                        <p className="text-slate-600 font-semibold mr-2">
                          ${listItem?.discountPrice}
                        </p>
                        <p className="text-slate-600 font-semibold">For Rent</p>
                      </div>
                    ) : (
                      <div className="flex">
                        <p className="text-slate-600 font-semibold mr-2">
                          ${listItem?.regularPrice}
                        </p>
                        <p className="text-slate-600 font-semibold">For Rent</p>
                      </div>
                    )}
                  </div>
                ) : listItem.type === "sale" ? (
                  <div>
                    {listItem.offer ? (
                      <div className="flex">
                        <p className="text-slate-500 line-through font-semibold mr-2">
                          ${listItem?.regularPrice}
                        </p>
                        <p className="text-slate-600 font-semibold mr-2">
                          ${listItem?.discountPrice}
                        </p>
                        <p className="text-slate-600 font-semibold">For Sale</p>
                      </div>
                    ) : (
                      <div className="flex">
                        <p className="text-slate-600 font-semibold mr-2">
                          ${listItem?.regularPrice}
                        </p>
                        <p className="text-slate-600 font-semibold">For Sale</p>
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div
                onClick={() => deleteFavourite(listItem._id)}
                className="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-[rgba(0,0,0,.4)] text-white z-50 flex justify-center items-center cursor-pointer"
              >
                <FaTimes />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
