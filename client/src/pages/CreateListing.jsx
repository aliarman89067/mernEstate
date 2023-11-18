import React, { useEffect, useState } from "react";
import { FaCamera, FaStar, FaTrash } from "react-icons/fa";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [editFormLoading, setEditFormLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    description: "",
    type: "sale",
    parking: false,
    furnished: false,
    offer: false,
    bedRooms: 0,
    bathRooms: 0,
    regularPrice: false,
    discountPrice: false,
    imageUrl: [],
  });
  useEffect(() => {
    if (id) {
      fetch(`/api/listing/list-by-id/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({ ...data });
        })
        .catch((error) => console.log(error));
    }
  }, [id]);
  const handleFiles = (files) => {
    if (files.length > 0 && files.length + formData.imageUrl.length < 9) {
      setLoading(true);
      setError("");
      let urlArray = [];
      for (let i = 0; i < files.length; i++) {
        urlArray.push(handleSingleFile(files[i]));
      }
      Promise.all(urlArray)
        .then((url) => {
          setFormData({ ...formData, imageUrl: formData.imageUrl.concat(url) });
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else {
      setError("You can only use 8 images!");
    }
  };
  const handleSingleFile = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };
  function handleMainImage(url) {
    setFormData({
      ...formData,
      imageUrl: [
        formData.imageUrl.filter((link) => link === url),
        ...formData.imageUrl.filter((link) => link !== url),
      ],
    });
  }
  function handleDeleteImage(url) {
    setFormData({
      ...formData,
      imageUrl: formData.imageUrl.filter((link) => link !== url),
    });
  }
  function handleChange(e) {
    const targetId = e.target.id;
    const targetValue = e.target.value;
    if (
      targetId === "title" ||
      targetId === "address" ||
      targetId === "description" ||
      targetId === "bedRooms" ||
      targetId === "bathRooms" ||
      targetId === "regularPrice" ||
      targetId === "discountPrice"
    ) {
      setFormData({ ...formData, [targetId]: targetValue });
    }
    if (targetId === "sale" || targetId === "rent") {
      setFormData({ ...formData, type: targetId });
    }
    if (
      targetId === "parking" ||
      targetId === "furnished" ||
      targetId === "offer"
    ) {
      if (e.target.checked) {
        setFormData({ ...formData, [targetId]: true });
      } else {
        setFormData({ ...formData, [targetId]: false });
      }
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.imageUrl.length > 0) {
      if (id) {
        try {
          setEditFormLoading(true);
          const res = await fetch("/api/listing/update-listing", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...formData, id }),
          });
          const data = await res.json();
          console.log(data);
          if (data.success === false) {
            setEditFormLoading(false);
            return;
          }
          setEditFormLoading(false);
          navigate("/listing/" + data._id);
        } catch (error) {
          console.log(error);
          setEditFormLoading(false);
        }
      } else {
        try {
          setFormLoading(true);
          setLoading(true);
          const res = await fetch("/api/listing/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (data.success === false) {
            console.log(data.message);
            setFormLoading(false);
            setLoading(false);
            return;
          }
          setFormLoading(false);
          setLoading(false);
          navigate("/listing/" + data._id);
        } catch (error) {
          console.log(error);
          setFormLoading(false);
          setLoading(false);
        }
      }
    } else {
      setError("Select atleast 1 image");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row items-start justify-center max-w-6xl mx-auto gap-4 sm:gap-10 px-4"
    >
      <div className="w-full md:flex-1">
        {/* Left Content */}
        <label>
          <p className="text-lg text-slate-600">Title</p>
          <input
            required
            value={formData.title}
            onChange={handleChange}
            type="text"
            id="title"
            className="border border-gray-300 outline-none px-2 py-1 rounded-lg w-full mb-2"
          />
        </label>
        <label>
          <p className="text-lg text-slate-600">Address</p>
          <input
            required
            value={formData.address}
            onChange={handleChange}
            type="text"
            id="address"
            className="border border-gray-300 outline-none px-2 py-1 rounded-lg w-full mb-2"
          />
        </label>
        <label>
          <p className="text-lg text-slate-600">Description</p>
          <textarea
            required
            value={formData.description}
            onChange={handleChange}
            type="text"
            id="description"
            className="border border-gray-300 outline-none px-2 py-1 rounded-lg w-full mb-2 h-[8rem] resize-none"
          />
        </label>
        <div className="flex flex-col items-start gap-1 mb-2">
          <h3 className="text-lg text-slate-700 font-semibold">Type</h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <p className="text-lg text-slate-600">Sale</p>
              <input
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
            </label>
            <label className="flex items-center gap-1">
              <p className="text-lg text-slate-600">Rent</p>
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1 mb-2">
          <h3 className="text-lg text-slate-700 font-semibold">Facilities</h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <p className="text-lg text-slate-600">Parking</p>
              <input
                type="checkbox"
                id="parking"
                checked={formData.parking === true}
                onChange={handleChange}
              />
            </label>
            <label className="flex items-center gap-1">
              <p className="text-lg text-slate-600">Furnished</p>
              <input
                type="checkbox"
                id="furnished"
                checked={formData.furnished === true}
                onChange={handleChange}
              />
            </label>
            <label className="flex items-center gap-1">
              <p className="text-lg text-slate-600">Offer</p>
              <input
                type="checkbox"
                id="offer"
                checked={formData.offer === true}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1 mb-2">
          <h3 className="text-lg text-slate-700 font-semibold">
            BedRooms & BathRooms
          </h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <p className="text-lg text-slate-600">BedRooms</p>
              <input
                required
                value={formData.bedRooms}
                type="number"
                id="bedRooms"
                className="w-16 text-center border border-gray-300 outline-none p-1 rounded-lg"
                min={1}
                onChange={handleChange}
              />
            </label>
            <label className="flex items-center gap-1">
              <p className="text-lg  text-slate-600">BathRooms</p>
              <input
                required
                value={formData.bathRooms}
                type="number"
                id="bathRooms"
                className="w-16 text-center border border-gray-300 outline-none p-1 rounded-lg"
                min={1}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1 mb-2">
          <h3 className="text-lg text-slate-700 font-semibold">Prices</h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1">
              <p className="text-lg text-slate-600">Regular Price</p>
              <input
                required
                value={formData.regularPrice}
                type="number"
                id="regularPrice"
                className="w-20 text-center border border-gray-300 outline-none p-1 rounded-lg"
                min={50}
                onChange={handleChange}
              />
            </label>
            {formData.offer && (
              <label className="flex items-center gap-1">
                <p className="text-lg text-slate-600">Discount Price</p>
                <input
                  required
                  value={formData.discountPrice}
                  type="number"
                  id="discountPrice"
                  className="w-16 text-center border border-gray-300 outline-none p-1 rounded-lg"
                  min={40}
                  onChange={handleChange}
                />
              </label>
            )}
          </div>
        </div>
      </div>
      <div className="w-full md:flex-1 border border-gray-300 rounded-lg p-4">
        {/* Right Content */}
        <div className="w-full h-[10rem] bg-slate-100 rounded-lg border border-gray-300">
          <label className="w-full h-full flex flex-col justify-center items-center cursor-pointer">
            <div className="w-16 h-16 border border-gray-400 rounded-full flex items-center justify-center">
              <FaCamera size={30} className="text-slate-600" />
            </div>
            {!loading ? (
              <h1 className="text-xl font-semibold text-slate-600">
                Upload Images
              </h1>
            ) : (
              <h1 className="text-xl text-center font-semibold text-slate-600">
                Uploading Images <br />
                <p className="text-lg font-normal">Please Wait</p>
              </h1>
            )}
            {!loading && (
              <p className="text-slate-500">
                Upload best images of your property
              </p>
            )}
            {error && (
              <p className="text-red-500 text-center text-md">{error}</p>
            )}
            {!loading && (
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={(e) => handleFiles(e.target.files)}
              />
            )}
          </label>
        </div>
        {formData.imageUrl.length > 0 && (
          <div className="flex flex-col gap-2 mt-4">
            {formData.imageUrl.map((url) => {
              return (
                <div key={url} className="w-full h-[10rem] rounded-lg relative">
                  <img
                    src={url}
                    alt="Listing Image"
                    className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity duration-300"
                  />
                  {formData?.imageUrl[0] === url ? (
                    <div className="absolute w-10 h-10 rounded-full bottom-2 left-2 flex justify-center items-center bg-[rgba(255,255,255,.2)] cursor-pointer">
                      <FaStar size={20} className="text-white" />
                    </div>
                  ) : (
                    <div
                      onClick={() => handleMainImage(url)}
                      className="absolute w-10 h-10 rounded-full bottom-2 left-2 flex justify-center items-center bg-[rgba(255,255,255,.8)] cursor-pointer"
                    >
                      <FaStar size={20} className="text-slate-800" />
                    </div>
                  )}
                  <div
                    onClick={() => handleDeleteImage(url)}
                    className="absolute w-10 h-10 rounded-full bottom-2 right-2 flex justify-center items-center bg-[rgba(255,255,255,.8)] cursor-pointer"
                  >
                    <FaTrash size={16} className="text-red-600" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <button
          disabled={loading}
          className="mt-4 bg-slate-600 p-4 rounded-lg w-full text-white hover:opacity-95 disabled:opacity-80"
        >
          {!formLoading && loading && <p>Uploading...</p>}
          {formLoading && loading && <p>Creating...</p>}
          {!id && !loading && <p>Create</p>}
          {id && !editFormLoading && <p>Update</p>}
          {id && editFormLoading && <p>Updating...</p>}
        </button>
      </div>
    </form>
  );
}
