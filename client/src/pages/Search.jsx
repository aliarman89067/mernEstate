import React, { useEffect, useState } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Pagination } from "swiper/modules";
import "swiper/css/bundle";

export default function Search() {
  SwiperCore.use([Pagination]);
  const navigate = useNavigate();
  const [listings, setListings] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(true);
  const [formData, setFormData] = useState({
    searchText: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchText = urlParams.get("searchText");
    const type = urlParams.get("type");
    const parking = urlParams.get("parking");
    const furnished = urlParams.get("furnished");
    const offer = urlParams.get("offer");
    const sort = urlParams.get("sort");
    const order = urlParams.get("order");
    if (searchText || type || parking || furnished || offer || sort || order) {
      setFormData({
        searchText: searchText || "",
        type: type || "all",
        parking: parking === "true" ? true : false,
        furnished: furnished === "true" ? true : false,
        offer: offer === "true" ? true : false,
        sort: sort || "createdAt",
        order: order || "desc",
      });
    }
    const fetchListing = async () => {
      const searchQuery = urlParams.toString();
      console.log(searchQuery);
      const res = await fetch(`/api/listing/get/search?${searchQuery}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListings(data);
    };
    fetchListing();
  }, [location.search]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchText", formData.searchText);
    urlParams.set("type", formData.type);
    urlParams.set("parking", formData.parking);
    urlParams.set("furnished", formData.furnished);
    urlParams.set("offer", formData.offer);
    urlParams.set("sort", formData.sort);
    urlParams.set("order", formData.order);
    const searchQuery = urlParams.toString();
    navigate("/search?" + searchQuery);
    const res = await fetch(`/api/listing/get/search?${searchQuery}`);
    const data = await res.json();
    if (data.success === false) {
      console.log(data.message);
      return;
    }
    setListings([...data, ...data, ...data]);
  };
  const handleChange = (e) => {
    if (e.target.id === "searchText") {
      setFormData({ ...formData, searchText: e.target.value });
    }
    if (
      e.target.id === "rent" ||
      e.target.id === "sale" ||
      e.target.id === "all"
    ) {
      setFormData({ ...formData, type: e.target.id });
    }
    if (e.target.id === "furnished") {
      if (e.target.checked) {
        setFormData({ ...formData, furnished: true });
      } else {
        setFormData({ ...formData, furnished: false });
      }
    }
    if (e.target.id === "parking") {
      if (e.target.checked) {
        setFormData({ ...formData, parking: true });
      } else {
        setFormData({ ...formData, parking: false });
      }
    }
    if (e.target.id === "offer") {
      if (e.target.checked) {
        setFormData({ ...formData, offer: true });
      } else {
        setFormData({ ...formData, offer: false });
      }
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";
      setFormData({ ...formData, sort, order });
    }
  };
  console.log(formData);
  return (
    <section className="flex items-start justify-between">
      <div
        onClick={() => setShowFilterMenu((prev) => !prev)}
        className={`w-10 h-10 rounded-full bg-slate-300 text-slate-600 hover:bg-slate-400 hover:text-slate-800 transition-all duration-300 cursor-pointer flex justify-center items-center z-20 absolute top-20 ${
          showFilterMenu ? "left-72" : "left-0"
        }`}
      >
        <FaFilter size={15} />
      </div>
      <div
        className={`shadow-xl h-screen bg-slate-200 -mt-8 w-[22rem] p-6 absolute ${
          showFilterMenu ? "left-0" : "-left-[25rem]"
        }  transition-all duration-300 z-10`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center mt-8 shadow-lg border border-gray-300 px-3 py-1 bg-white rounded-lg ">
            <input
              id="searchText"
              value={formData.searchText}
              onChange={handleChange}
              type="text"
              placeholder="Search..."
              className="w-full outline-none border-none"
            />
            <div
              onClick={handleSubmit}
              className="bg-transparent hover:bg-slate-200 transition-bg duration-300 text-gray-600 hover:text-gray-700 cursor-pointer rounded-full w-14 h-12 flex justify-center items-center"
            >
              <FaSearch />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl text-slate-500 font-semibold">Category</h1>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1">
                <p className="text-lg text-slate-600">Rent & Sale</p>
                <input
                  id="all"
                  type="checkbox"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={formData.type === "all"}
                />
              </label>
              <label className="flex items-center gap-1">
                <p className="text-lg text-slate-600">Rent</p>
                <input
                  id="rent"
                  type="checkbox"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />
              </label>
              <label className="flex items-center gap-1">
                <p className="text-lg text-slate-600">Sale</p>
                <input
                  id="sale"
                  type="checkbox"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl text-slate-500 font-semibold">Facilities</h1>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1">
                <p className="text-lg text-slate-600">Parking</p>
                <input
                  id="parking"
                  type="checkbox"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={formData.parking}
                />
              </label>
              <label className="flex items-center gap-1">
                <p className="text-lg text-slate-600">Furnished</p>
                <input
                  id="furnished"
                  type="checkbox"
                  className="w-4 h-4"
                  onChange={handleChange}
                  checked={formData.furnished}
                />
              </label>
              <label className="flex items-center gap-1">
                <p className="text-lg text-slate-600">Offer</p>
                <input
                  id="offer"
                  type="checkbox"
                  className="w-4 h-4"
                  checked={formData.offer}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl text-slate-500 font-semibold">
              Sort By Filter
            </h1>
            <select
              id="sort_order"
              onChange={handleChange}
              defaultChecked="createdAt_desc"
              className="p-2 outline-none border border-gray-300 shadow-lg rounded-lg"
            >
              <option>Select</option>
              <option value={"createdAt_desc"}>Newest to Oldest</option>
              <option value={"createdAt_asc"}>Oldest to Newest</option>
              <option value={"regularPrice_desc"}>
                High Price to Low Price
              </option>
              <option value={"regularPrice_asc"}>
                Low Price to High Price
              </option>
            </select>
          </div>
          <button className="bg-slate-500 text-white p-3 rounded-lg mt-2 hover:opacity-90 disabled:opacity-80 transition-opacity duration-300">
            Search
          </button>
        </form>
      </div>
      <div
        className={`flex items-start justify-start flex-wrap gap-4 ${
          showFilterMenu
            ? "w-full sm:w-[calc(100%-22rem)] sm:ml-auto"
            : "w-full ml-auto"
        } transition-all duration-300 sm:p-4`}
      >
        {listings &&
          listings.length > 0 &&
          listings.map((listItem) => (
            <Link
              to={`/listing/${listItem._id}`}
              className="w-[220px] sm:w-[300px] rounded-lg p-2 shadow-lg border bg-slate-300 z-0"
            >
              <Swiper pagination>
                {listItem.imageUrl.length > 0 &&
                  listItem.imageUrl.map((url) => (
                    <SwiperSlide key={url}>
                      <div
                        style={{
                          width: "100%",
                          height: "220px",
                          background: `url(${url}) center no-repeat`,
                          backgroundSize: "cover",
                          borderRadius: "8px",
                        }}
                      ></div>
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
                          {listItem?.regularPrice}
                        </p>
                        <p className="text-slate-600 font-semibold mr-2">
                          {listItem?.discountPrice}
                        </p>
                        <p className="text-slate-600 font-semibold">For Rent</p>
                      </div>
                    ) : (
                      <div className="flex">
                        <p className="text-slate-600 font-semibold mr-2">
                          {listItem?.regularPrice}
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
                          {listItem?.regularPrice}
                        </p>
                        <p className="text-slate-600 font-semibold mr-2">
                          {listItem?.discountPrice}
                        </p>
                        <p className="text-slate-600 font-semibold">For Sale</p>
                      </div>
                    ) : (
                      <div className="flex">
                        <p className="text-slate-600 font-semibold mr-2">
                          {listItem?.regularPrice}
                        </p>
                        <p className="text-slate-600 font-semibold">For Sale</p>
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
