import React, { useState } from 'react';
import Axios from '../utilities/Axios';

export const UpdateRequestTest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRequest = async () => {
    setIsLoading(true);
    try {
      // Make a POST request to the update request endpoint with the necessary data
      const response = await Axios.post('/inventory/requests/3/action/approve/');
      console.log('Update request response:', response.data);
      // Handle the response as needed
    } catch (error) {
      console.error('Error updating request:', error);
      // Handle errors
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Update Request Test</h1>
      <button
        onClick={handleUpdateRequest}
        disabled={isLoading}
        className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Loading...' : 'Update Request'}
      </button>
    </div>
  );
};
