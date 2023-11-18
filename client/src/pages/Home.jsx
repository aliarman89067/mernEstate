import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { Link } from "react-router-dom";
import LikePlace from "../components/LikePlace";
import axios from "axios";

export default function Home() {
  SwiperCore.use([Pagination, Navigation]);
  const [offerListing, setOfferListing] = useState(null);
  const [rentListing, setRentListing] = useState(null);
  const [saleListing, setSaleListing] = useState(null);
  const [likeIds, setLikeIds] = useState(null);
  useEffect(() => {
    const fetchOfferListing = async () => {
      const res = await fetch("/api/listing/get/search?offer=true");
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setOfferListing(data);
      fetchRentListing();
    };
    const fetchRentListing = async () => {
      const res = await fetch("/api/listing/get/search?type=rent");
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setRentListing(data);
      fetchSaleListing();
    };
    const fetchSaleListing = async () => {
      const res = await fetch("/api/listing/get/search?type=sale");
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setSaleListing(data);
    };
    fetchOfferListing();
  }, []);
  useEffect(() => {
    axios
      .get("/api/user/get/liked/id")
      .then(({ data }) => {
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setLikeIds(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <section>
      <div>
        {/* Slider */}
        <Swiper navigation pagination>
          {offerListing &&
            offerListing[0].imageUrl.length > 0 &&
            offerListing[0].imageUrl.map((url) => (
              <SwiperSlide key={url}>
                <div
                  style={{
                    height: "400px",
                    width: "100%",
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      {offerListing && (
        <div iv className="flex flex-col gap-2 mt-4 max-w-6xl mx-auto">
          {/* Offers Place */}
          <h1 className="text-xl text-slate-700">Places For Offers</h1>
          <Link
            to={"/search?offer=true"}
            className="text-sm text-slate-700 hover:underline cursor-pointer"
          >
            See more places for offers
          </Link>
          <div className="flex flex-wrap gap-2">
            {offerListing &&
              offerListing.length > 0 &&
              offerListing.map((listItem) => (
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
                            <p className="text-slate-600 font-semibold">
                              For Rent
                            </p>
                          </div>
                        ) : (
                          <div className="flex">
                            <p className="text-slate-600 font-semibold mr-2">
                              ${listItem?.regularPrice}
                            </p>
                            <p className="text-slate-600 font-semibold">
                              For Rent
                            </p>
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
                            <p className="text-slate-600 font-semibold">
                              For Sale
                            </p>
                          </div>
                        ) : (
                          <div className="flex">
                            <p className="text-slate-600 font-semibold mr-2">
                              ${listItem?.regularPrice}
                            </p>
                            <p className="text-slate-600 font-semibold">
                              For Sale
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {likeIds?.includes(listItem._id) ? (
                    <LikePlace
                      id={listItem._id}
                      color={" text-red-500 "}
                      liked={true}
                    />
                  ) : (
                    <LikePlace
                      id={listItem._id}
                      color={" text-white "}
                      liked={false}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
      {rentListing && (
        <div className="flex flex-col gap-2 mt-4 max-w-6xl mx-auto">
          {/* Rent Place */}
          <h1 className="text-xl text-slate-700">Places For Rent</h1>
          <Link
            to={"/search?type=rent"}
            className="text-sm text-slate-700 hover:underline cursor-pointer"
          >
            See more places for Rent
          </Link>
          <div className="flex flex-wrap gap-2">
            {rentListing &&
              rentListing.length > 0 &&
              rentListing.map((listItem) => (
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
                            <p className="text-slate-600 font-semibold">
                              For Rent
                            </p>
                          </div>
                        ) : (
                          <div className="flex">
                            <p className="text-slate-600 font-semibold mr-2">
                              ${listItem?.regularPrice}
                            </p>
                            <p className="text-slate-600 font-semibold">
                              For Rent
                            </p>
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
                            <p className="text-slate-600 font-semibold">
                              For Sale
                            </p>
                          </div>
                        ) : (
                          <div className="flex">
                            <p className="text-slate-600 font-semibold mr-2">
                              ${listItem?.regularPrice}
                            </p>
                            <p className="text-slate-600 font-semibold">
                              For Sale
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {likeIds?.includes(listItem._id) ? (
                    <LikePlace
                      id={listItem._id}
                      color={" text-red-500 "}
                      liked={true}
                    />
                  ) : (
                    <LikePlace
                      id={listItem._id}
                      color={" text-white "}
                      liked={false}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
      {saleListing && (
        <div className="flex flex-col gap-2 mt-4 max-w-6xl mx-auto">
          {/* Sale Place */}
          <h1 className="text-xl text-slate-700">Places For Sale</h1>
          <Link
            to={"/search?type=sale"}
            className="text-sm text-slate-700 hover:underline cursor-pointer"
          >
            See more places for Sale
          </Link>
          <div className="flex flex-wrap gap-2">
            {saleListing &&
              saleListing.length > 0 &&
              saleListing.map((listItem) => (
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
                            <p className="text-slate-600 font-semibold">
                              For Rent
                            </p>
                          </div>
                        ) : (
                          <div className="flex">
                            <p className="text-slate-600 font-semibold mr-2">
                              ${listItem?.regularPrice}
                            </p>
                            <p className="text-slate-600 font-semibold">
                              For Rent
                            </p>
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
                            <p className="text-slate-600 font-semibold">
                              For Sale
                            </p>
                          </div>
                        ) : (
                          <div className="flex">
                            <p className="text-slate-600 font-semibold mr-2">
                              ${listItem?.regularPrice}
                            </p>
                            <p className="text-slate-600 font-semibold">
                              For Sale
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {likeIds?.includes(listItem._id) ? (
                    <LikePlace
                      id={listItem._id}
                      color={" text-red-500 "}
                      liked={true}
                    />
                  ) : (
                    <LikePlace
                      id={listItem._id}
                      color={" text-white "}
                      liked={false}
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
