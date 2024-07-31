'use client';

import { useState, useEffect } from 'react';

const Test1 = () => {
  const [result, setResult] = useState<number | null>(null);

  const handleClick = () => {
    let sum = 0;
    for (let i = 1; i <= 100; i++) {
      sum += i;
    }
    setResult(sum);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page 1</h1>
      <button
        onClick={handleClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Calculate Sum (1 to 100)
      </button>
      {result !== null && (
        <div className="mt-4">
          <p className="text-xl">Result: {result}</p>
        </div>
      )}
    </div>
  );
};

export default Test1;
