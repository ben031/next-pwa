'use client';

import { useState } from 'react';

const Test2 = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handlePopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page 2</h1>
      <button
        onClick={handlePopup}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Popup 오픈
      </button>
      <button
        onClick={handleClosePopup}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Popup 닫기
      </button>
      {showPopup && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <p className="text-xl">popup!</p>
        </div>
      )}
    </div>
  );
};

export default Test2;
