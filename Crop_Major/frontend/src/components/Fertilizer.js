import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import fertilizer from '../support/fertilizer.jpg';
import axios from 'axios';

const Fertilizer = () => {
  const location = useLocation();

  // Destructuring values from location state
  const { Rainfall, Temperature, Soil_color, pH, Crop, Nitrogen, Potassium, Phosphorus } = location.state || {};

  // Initialize inputs state with values from location state
  const [inputs, setInputs] = useState({
    Rainfall: Rainfall || '',
    Temperature: Temperature || '',
    Soil_color: Soil_color || '',
    pH: pH || '',
    Crop: Crop || '',
    Nitrogen: Nitrogen || '',
    Phosphorus: Phosphorus || '',
    Potassium: Potassium || '',
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        Temperature: parseFloat(inputs.Temperature),
        Rainfall: parseFloat(inputs.Rainfall),
        Soil_color: inputs.Soil_color,
        pH: parseFloat(inputs.pH),
        Crop: inputs.Crop,
        Nitrogen: parseFloat(inputs.Nitrogen),
        Phosphorus: parseFloat(inputs.Phosphorus),
        Potassium: parseFloat(inputs.Potassium),
      };

      console.log('Payload:', payload);  // Debugging line

      const response = await axios.post('http://localhost:5002/predict', payload);
      setPrediction(response.data.prediction);
      setError(null);
    } catch (error) {
      setError('There was an error making the prediction request!');
      console.error('Error:', error);
    }
  };

  return (
    <div className="relative h-screen flex">
      <div className="w-1/2 relative">
        <img src={fertilizer} alt="Background" className="absolute inset-0 object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Fertilizers</h1>
          <p className="text-lg">Give your plants the harvest they need with our predicted fertilizer</p>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6">Fertilizer Prediction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-gray-700">Temperature</label>
                <input type="number" name="Temperature" value={inputs.Temperature} readOnly
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Rainfall</label>
                <input type="number" name="Rainfall" value={inputs.Rainfall} readOnly
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-gray-700">Soil Color</label>
                <input type="text" name="Soil_color" value={inputs.Soil_color} readOnly
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">pH</label>
                <input type="number" step="0.1" name="pH" value={inputs.pH} readOnly
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
            </div>
            <div className="form-group">
              <label className="block text-gray-700">Crop</label>
              <input type="text" name="Crop" value={inputs.Crop} readOnly
                     className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-gray-700">Nitrogen</label>
                <input type="number" name="Nitrogen" value={inputs.Nitrogen} readOnly
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Potassium</label>
                <input type="number" name="Potassium" value={inputs.Potassium} readOnly
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
            </div>
            <div className="form-group">
              <label className="block text-gray-700">Phosphorus</label>
              <input type="number" name="Phosphorus" value={inputs.Phosphorus} readOnly
                     className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
            </div>

            <button type="submit"
                    className="w-full bg-blue-500 text-white py-4 rounded-full shadow-md hover:bg-blue-700 font-bold mb-4">
              Proceed with Fertilizers Predictions
            </button>
          </form>
          {prediction && (
            <div className="mt-8">
              <h3 className="text-xl font-bold">Prediction Results</h3>
              <p className="text-blue-600 font-bold text-lg">Fertilizer: {prediction}</p>
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

export default Fertilizer;
