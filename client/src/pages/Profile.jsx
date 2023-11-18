import React, { useEffect, useState } from "react";
import { houseImage } from "../images/index";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateSuccess,
  logoutSuccess,
  deleteSuccess,
} from "../redux/userSlice";
import { app } from "../firebase";
import Alert from "../components/Alert";
import DeleteBox from "../components/DeleteBox";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loadingListing, setLoadingListing] = useState(false);
  const [askingPermission, setAskingPermission] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  // const [deleteShow, setDeleteShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [filePer, setFilePer] = useState(0);
  const [downloadUrl, setdownloadUrl] = useState(null);
  const [formData, setFormData] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [listings, setListings] = useState(null);
  const [hideListing, setHideListing] = useState(false);
  useEffect(() => {
    setFormData({
      username: currentUser.username,
      email: currentUser.email,
      photo: currentUser.photo,
    });
    if (file) {
      handleFile(file[0]);
    }
  }, [file]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleFile = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setdownloadUrl(downloadUrl);
          setFormData({ ...formData, photo: downloadUrl });
        });
      }
    );
    setFile(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      if (data.message === "This Email Already Used") {
        setShowAlert(true);
        setAlertText(data.message);
        setLoading(false);
      }
      return;
    }
    dispatch(updateSuccess(data));
    setLoading(false);
    setShowAlert(true);
    setAlertText("Updated Successfully");
  };
  const handleDelete = async () => {
    if (askingPermission) {
      try {
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          setAskingPermission(false);
          return;
        }
        console.log("Deleted");
        dispatch(deleteSuccess(null));
        setAskingPermission(false);
      } catch (error) {
        console.log(error);
        setAskingPermission(false);
      }
    }
  };
  handleDelete();
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout");
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      dispatch(logoutSuccess(null));
    } catch (error) {
      console.log(error);
    }
  };
  document.addEventListener("click", () => {
    setShowAlert(false);
    setShowDeleteBox(false);
  });
  const handleShowListings = async () => {
    try {
      setShowAlert(false);
      setLoadingListing(true);
      const res = await fetch("/api/listing/get");
      const data = await res.json();
      if (data.success === false) {
        if (data.message === "User Not Authorized") {
          setAlertText("You need to login first");
          setShowAlert(true);
          setLoadingListing(false);
        }
        console.log(data.message);
        setLoadingListing(false);
        return;
      }
      if (data.length === 0) {
        setListings(null);
        setLoadingListing(false);
        return;
      }
      setListings(data);
      setLoadingListing(false);
    } catch (error) {
      console.log(error);
      setLoadingListing(false);
    }
  };
  const handleDeleteListing = async (id) => {
    try {
      const res = await fetch("/api/listing/delete/" + id, {
        method: "DELETE",
      });
      const data = await res.json();
      setListings([...listings.filter((list) => list._id !== id)]);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] max-w-2xl mx-auto p-4">
      <DeleteBox
        showDeleteBox={showDeleteBox}
        setShowDeleteBox={setShowDeleteBox}
        deleteText={deleteText}
        setAskingPermission={setAskingPermission}
      />
      <Alert show={showAlert} setShow={setShowAlert} alertText={alertText} />
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-3xl font-semibold text-slate-600 text-center leading-8">
          Update Your <br />
          <span className="text-slate-700">Profile</span>
        </h1>
        <p className="text-slate-700 text-lg">
          Change your information and profile picture
        </p>
      </div>
      {/* form */}
      <form
        onSubmit={handleSubmit}
        className="border border-gray-300 w-full p-4 rounded-xl"
      >
        <div className="flex flex-col items-center justify-center border-b border-gray-300 mb-2 pb-2">
          <label>
            <img
              src={downloadUrl ? downloadUrl : formData?.photo}
              alt="Profile Image"
              className="w-20 h-20 rounded-full object-cover cursor-pointer"
            />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setFile(e.target.files)}
            />
          </label>
          {filePer > 0 && filePer < 100 ? (
            <p className="text-slate-700 text-md">{filePer}% Uploaded</p>
          ) : filePer === 100 ? (
            <p className="text-green-500 text-md">Upload Complete</p>
          ) : (
            ""
          )}
        </div>
        <div className="border-b border-gray-300 mb-2">
          <label>
            <p className="text-slate-700">Username</p>
            <input
              type="text"
              defaultValue={formData?.username}
              onChange={handleChange}
              id="username"
              className="w-full outline-none bg-transparent border rounded-lg border-gray-300 p-2"
            />
          </label>
        </div>
        <div className="border-b border-gray-300 mb-2">
          <label>
            <p className="text-slate-700">Email</p>
            <input
              type="email"
              id="email"
              className="w-full outline-none bg-transparent border rounded-lg border-gray-300 p-2"
              defaultValue={formData?.email}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="border-b border-gray-300 mb-2">
          <label>
            <p className="text-slate-700">Password</p>
            <input
              type="password"
              id="password"
              onChange={handleChange}
              className="w-full outline-none bg-transparent border rounded-lg border-gray-300 p-2"
            />
          </label>
        </div>
        <button
          disabled={loading}
          className="bg-slate-500 w-full py-2 rounded-lg text-white hover:bg-slate-600 disabled:opacity-80 transition-all duration-300 mt-1"
        >
          {loading ? "Updating.." : "Update"}
        </button>
      </form>
      <div className="flex justify-between items-center w-full mt-2">
        <p
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteBox(true);
            setDeleteText("Are you sure you want to delete this place!");
          }}
          className="text-red-600 hover:underline cursor-pointer"
        >
          Delete Account
        </p>
        <p
          onClick={handleSignOut}
          className="text-slate-600 hover:underline cursor-pointer"
        >
          Sign Out
        </p>
      </div>
      <div className="flex justify-between items-center w-full mt-2">
        <Link
          to={"/profile/listing"}
          className="text-green-600 hover:underline cursor-pointer"
        >
          Create Listing
        </Link>
        {!hideListing ? (
          <p
            onClick={() => {
              handleShowListings();
              setHideListing(true);
            }}
            className="text-green-600 hover:underline cursor-pointer"
          >
            Show Listings
          </p>
        ) : loadingListing ? (
          <p className="text-green-600 hover:underline cursor-pointer">
            Loading...
          </p>
        ) : hideListing ? (
          <p
            onClick={() => {
              setHideListing(false);
              setListings([]);
            }}
            className="text-green-600 hover:underline cursor-pointer"
          >
            Hide Listing
          </p>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col items-start justify-start gap-4">
        {listings &&
          listings.length > 0 &&
          listings.map((listItem) => {
            return (
              <div
                key={listItem._id}
                className="flex gap-2 items-start justify-start shadow-lg rounded-lg p-4 w-full border border-gray-200"
              >
                <Link
                  to={`/listing/${listItem._id}`}
                  className="h-[9rem] w-[10rem] shrink-0"
                >
                  <img
                    src={listItem.imageUrl[0] || houseImage}
                    alt="Property Image"
                    className="h-full w-full shrink-0 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex flex-col items-start justify-start">
                  <h1 className="text-slate-800 text-lg truncate">
                    {listItem.title}
                  </h1>
                  <p className="text-slate-600 text-sm underline">
                    {listItem.address}
                  </p>
                  <p className="text-slate-600 text-sm line-clamp-2">
                    {listItem.description}
                  </p>
                  <div className="flex gap-2">
                    {listItem?.offer ? (
                      <div className="flex items-center gap-2">
                        <p className="line-through text-slate-400 font-semibold">
                          ${listItem.regularPrice.toLocaleString("en-us")}
                        </p>
                        <p className="text-slate-600 font-semibold">
                          ${listItem.discountPrice.toLocaleString("en-us")}
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-600 font-semibold">
                        ${listItem.regularPrice.toLocaleString("en-us")}
                      </p>
                    )}
                    {listItem?.type === "sale" ? (
                      <p className="text-slate-600">For Sale</p>
                    ) : listItem?.type === "rent" ? (
                      <p className="text-slate-600">For Rent</p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className=" flex items-center gap-4 mt-2">
                    <Link
                      to={`/profile/update/listing/${listItem._id}`}
                      className="w-9 h-9 bg-[rgba(0,0,0,.3)] hover:bg-[rgba(0,0,0,.5)] text-gray-100 hover:text-green-400 transition-bg duration-300 cursor-pointer rounded-full flex justify-center items-center"
                    >
                      <FaEdit size={16} />
                    </Link>
                    <div
                      onClick={() => handleDeleteListing(listItem._id)}
                      className="w-9 h-9 bg-[rgba(0,0,0,.3)] hover:bg-[rgba(0,0,0,.5)] text-gray-100 hover:text-red-400 transition-bg duration-300 cursor-pointer rounded-full flex justify-center items-center"
                    >
                      <FaTrash size={16} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {hideListing && (
          <div>
            {!listings && (
              <div>
                <p className="text-slate-600">No Listing Yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
