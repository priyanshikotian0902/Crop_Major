import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import nutrients from '../support/nutrients.jpg';

function Nutrients() {
  const location = useLocation();
  const { Rainfall, Temperature, Soil_color, pH, Crop } = location.state || {};

  const [inputs, setInputs] = useState({
    Rainfall: Rainfall || '',
    Temperature: Temperature || '',
    Soil_color: Soil_color || '',
    pH: pH || '',
    Crop: Crop || ''
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [showTransferButton, setShowTransferButton] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (Rainfall !== undefined && Temperature !== undefined && Soil_color !== undefined && pH !== undefined && Crop !== undefined) {
      setInputs({
        Rainfall: Rainfall,
        Temperature: Temperature,
        Soil_color: Soil_color,
        pH: pH,
        Crop: Crop
      });
    }
  }, [Rainfall, Temperature, Soil_color, pH, Crop]);

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
      const response = await axios.post('http://localhost:5001/predict', {
        temperature: parseFloat(inputs.Temperature),
        rainfall: parseFloat(inputs.Rainfall),
        soil_color: inputs.Soil_color.toLowerCase(),
        ph: parseFloat(inputs.pH),
        crop: inputs.Crop.toLowerCase()
      });
      setPrediction(response.data);
      setError(null);
      setShowTransferButton(true); // Show the transfer button upon successful prediction
    } catch (error) {
      setError("There was an error making the prediction request!");
      console.error("There was an error making the prediction request!", error);
    }
  };

  const handleTransferToFertilizers = () => {
    // Redirect to Fertilizers component with inputs and prediction
    navigate('/fertilizers', {
      state: {
        Rainfall: inputs.Rainfall,
        Temperature: inputs.Temperature,
        Soil_color: inputs.Soil_color,
        pH: inputs.pH,
        Crop: inputs.Crop,
        Nitrogen: prediction ? prediction.Nitrogen.toFixed(2) : null,
        Phosphorus: prediction ? prediction.Phosphorus.toFixed(2) : null,
        Potassium: prediction ? prediction.Potassium.toFixed(2) : null
      }
    });
  };

  return (
    <div className="relative h-screen flex">
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6">N P K Prediction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-gray-700">Temperature</label>
                <input type="number" name="Temperature" value={inputs.Temperature} onChange={handleChange} required
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Rainfall</label>
                <input type="number" name="Rainfall" value={inputs.Rainfall} onChange={handleChange} required
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-gray-700">Soil Color</label>
                <input type="text" name="Soil_color" value={inputs.Soil_color} onChange={handleChange} required
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">pH</label>
                <input type="number" step="0.1"
                       name="pH" value={inputs.pH} onChange={handleChange} required
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
            </div>
            <div className="form-group">
              <label className="block text-gray-700">Crop</label>
              <input type="text" name="Crop" value={inputs.Crop} onChange={handleChange} required
                     className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
            </div>
            <button type="submit"
                    className="w-full bg-blue-500 text-white py-4 rounded-full shadow-md hover:bg-blue-700 font-bold mb-4">
              Proceed with Nutrients Predictions
            </button>
          </form>
          {prediction && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold">Prediction Results</h3>
                <p><span className="text-green-600 font-bold">Nitrogen: {prediction.Nitrogen.toFixed(2)}</span></p>
                <p><span className="text-blue-600 font-bold">Phosphorus: {prediction.Phosphorus.toFixed(2)}</span></p>
                <p><span className="text-purple-600 font-bold">Potassium: {prediction.Potassium.toFixed(2)}</span></p>
              </div>
            )}
            {showTransferButton && (
              <button
                onClick={handleTransferToFertilizers}
                className="bg-black text-white py-2 px-4 rounded-full shadow-md hover:bg-gray-800 font-bold mt-4"
              >
                Transfer to Fertilizers
              </button>
            )}
            {error && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-red-600">Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            )}

        </div>
      </div>
      <div className="w-1/2 relative">
        <img src={nutrients} alt="Background" className="absolute inset-0 object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Nutrients</h1>
          <p className="text-lg">Get Recommended Nutrients to Supplied According to Conditions</p>
        </div>
      </div>
    </div>
  );
}

export default Nutrients;
