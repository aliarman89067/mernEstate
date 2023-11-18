import React, { useState } from "react";

export default function DeleteBox({
  showDeleteBox,
  setShowDeleteBox,
  deleteText,
  setAskingPermission,
}) {
  const handleDeleteBox = (e) => {
    e.stopPropagation();
  };
  return (
    <>
      {showDeleteBox && (
        <div
          onClick={(e) => handleDeleteBox(e)}
          className="absolute rounded-lg shadow-xl h-32 px-10 bg-white border-2 border-gray-300 flex flex-col items-center justify-center"
        >
          <p className="text-red-500 text-md">{deleteText}</p>
          <div className="mt-4 flex justify-between items-center w-full">
            <button onClick={() => setAskingPermission(true)}>Yes</button>
            <button onClick={() => setShowDeleteBox(false)}>No</button>
          </div>
        </div>
      )}
    </>
  );
}
