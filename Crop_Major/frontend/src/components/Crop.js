import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import crop from "../support/crop.jpeg";
import axios from "axios";

const Crop = () => {
  const location = useLocation();
  const { rainfall, temperature } = location.state || {};

  const [inputs, setInputs] = useState({
    Rainfall: rainfall || '',
    Temperature: temperature || '',
    Soil_color: '',
    pH: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [showTransferButton, setShowTransferButton] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/predict', {
        ...inputs,
        Soil_color: inputs.Soil_color.toLowerCase() // Ensure Soil_color is lowercase
      });
      setPrediction(response.data.prediction);
      setError(null);
      setShowTransferButton(true); // Show the transfer button upon successful prediction
    } catch (error) {
      setError("There was an error making the prediction request!");
      console.error("There was an error making the prediction request!", error);
    }
  };

  const handleTransferToNutrients = () => {
    // Redirect to Nutrients component with inputs
    navigate('/nutrients', {
      state: {
        Rainfall: inputs.Rainfall,
        Temperature: inputs.Temperature,
        Soil_color: inputs.Soil_color,
        pH: inputs.pH,
        Crop: prediction
      }
    });
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 relative">
        <img src={crop} alt="Background" className="absolute inset-0 object-cover w-full h-full"/>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Crop</h1>
          <p className="text-lg">Get Recommended Crop on Weather Conditions and Manual Soil Data</p>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6">Crop Prediction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-gray-700">Rainfall</label>
                <input type="number" name="Rainfall" value={inputs.Rainfall} onChange={handleChange} required
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Soil Color</label>
                <select name="Soil_color" value={inputs.Soil_color} onChange={handleChange}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded">
                  <option value="">Select</option>
                  <option value="Black">Black</option>
                  <option value="Red">Red</option>
                  <option value="Dark Brown">Dark Brown</option>
                  <option value="Reddish Brown">Reddish Brown</option>
                  <option value="Light Brown">Light Brown</option>
                  <option value="Medium Brown">Medium Brown</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-gray-700">Temperature</label>
                <input type="number" name="Temperature" value={inputs.Temperature} onChange={handleChange} required
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">pH</label>
                <input type="number" step="0.1" name="pH" value={inputs.pH} onChange={handleChange} required
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
            </div>
            <button type="submit"
                    className="w-full bg-blue-500 text-white py-4 rounded-full shadow-md hover:bg-blue-700 font-bold mb-4">
              Proceed with Crop Predictions
            </button>
          </form>
          {prediction && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold">Prediction Results</h3>
              <p className="text-gray-800 font-bold text-xl text-green-600">Predicted Crop: {prediction}</p>
              {showTransferButton && (
                <button
                  onClick={handleTransferToNutrients}
                  className="bg-black text-white py-2 px-4 rounded-full shadow-md hover:bg-gray-800 font-bold mt-4"
                >
                  Transfer to Nutrients
                </button>
              )}
            </div>
          )}
          {error && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-red-600">Error</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Crop;
