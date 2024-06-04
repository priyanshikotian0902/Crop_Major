import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import weather from "../support/weather.jpg";

const Weather = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    useCurrentLocation: false,
    city: '',
    state: '',
    latitude: '',
    longitude: '',
    temperature: '',
    rainfall: '',
    district: 'MAHARASHTRA'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=152a98b269f9ab5bdbd9628c2fb0735b&units=metric`);
      const data = await response.json();
      const temperature = parseFloat(data.main.temp).toFixed(1);
      const windSpeed = data.wind.speed;
      const scaledWindSpeed = Math.max(0, Math.min(1, windSpeed / 10));
      const averageRainfall = Math.floor(scaledWindSpeed * 800) + 300;

      setFormData(prevData => ({
        ...prevData,
        temperature,
        rainfall: averageRainfall
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleUseCurrentLocation = async () => {
    if (formData.useCurrentLocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherData(latitude, longitude);
          setFormData(prevData => ({ ...prevData, latitude, longitude }));
        },
        (error) => console.error('Error getting current location:', error)
      );
    } else {
      try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${formData.city},${formData.state}.json?access_token=pk.eyJ1IjoicHJpeWFuc2hpa290aWFuIiwiYSI6ImNsdnIybmRtYjBpc2Mya3BnNWNhbGNvNmcifQ.h228a3vIolNmOtRleN41NA`);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [longitude, latitude] = data.features[0].center;
          await fetchWeatherData(latitude, longitude);
          setFormData(prevData => ({ ...prevData, latitude, longitude }));
        } else {
          console.error('No results found for the specified city and state.');
        }
      } catch (error) {
        console.error('Error fetching geocoding data:', error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/crop', { state: { rainfall: formData.rainfall, temperature: formData.temperature } });
  };

  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      fetchWeatherData(formData.latitude, formData.longitude);
    }
  }, [formData.latitude, formData.longitude]);

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6">Weather Data Results</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="block text-gray-700">
                <input type="checkbox" name="useCurrentLocation" checked={formData.useCurrentLocation}
                       onChange={handleChange} className="mr-2"/>
                Use Current Location
              </label>
            </div>
            {!formData.useCurrentLocation && (
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-gray-700">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange}
                         className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
                </div>
                <div className="form-group">
                  <label className="block text-gray-700">State</label>
                  <select name="state" value={formData.state} onChange={handleChange}
                          className="mt-1 p-2 block w-full border border-gray-300 rounded">
                    <option>ANDAMAN And NICOBAR</option>
                    <option>ANDHRA PRADESH</option>
                    <option>ARUNACHAL PRADESH</option>
                    <option>ASSAM</option>
                    <option>BIHAR</option>
                    <option>CHANDIGARH</option>
                    <option>CHHATTISGARH</option>
                    <option>DADRA And NAGAR HAVELI</option>
                    <option>DAMAN And DIU</option>
                    <option>DELHI</option>
                    <option>GOA</option>
                    <option>GUJARAT</option>
                    <option>HARYANA</option>
                    <option>HIMACHAL PRADESH</option>
                    <option>JAMMU And KASHMIR</option>
                    <option>JHARKHAND</option>
                    <option>KARNATAKA</option>
                    <option>KERALA</option>
                    <option>LAKSHADWEEP</option>
                    <option>MADHYA PRADESH</option>
                    <option>MAHARASHTRA</option>
                    <option>MANIPUR</option>
                    <option>MEGHALAYA</option>
                    <option>MIZORAM</option>
                    <option>NAGALAND</option>
                    <option>ODISHA</option>
                    <option>PUDUCHERRY</option>
                    <option>PUNJAB</option>
                    <option>RAJASTHAN</option>
                    <option>SIKKIM</option>
                    <option>TAMIL NADU</option>
                    <option>TELANGANA</option>
                    <option>TRIPURA</option>
                    <option>UTTAR PRADESH</option>
                    <option>UTTARAKHAND</option>
                    <option>WEST BENGAL</option>
                  </select>
                </div>
              </div>
            )}
            <button type="button" onClick={handleUseCurrentLocation}
                    className="w-full bg-blue-500 text-white py-4 rounded-full shadow-md hover:bg-blue-700 font-bold mb-4">
              Get Longitude and Latitude Co-ordinates
            </button>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="block text-gray-700">Latitude</label>
                <input type="text" name="latitude" value={formData.latitude} readOnly
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
              <div className="form-group">
                <label className="block text-gray-700">Longitude</label>
                <input type="text" name="longitude" value={formData.longitude} readOnly
                       className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
              </div>
            </div>
            <div className="form-group">
              <label className="block text-gray-700">Temperature</label>
              <input type="text" value={formData.temperature} readOnly
                     className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
            </div>
            <div className="form-group">
              <label className="block text-gray-700">Rainfall</label>
              <input type="text" value={formData.rainfall} readOnly
                     className="mt-1 p-2 block w-full border border-gray-300 rounded"/>
            </div>
            <button type="submit"
                    className="w-full bg-blue-500 text-white py-4 rounded-full shadow-md hover:bg-blue-700 font-bold mb-4">
              Proceed with Crop Predictions
            </button>
          </form>
        </div>
      </div>
      <div className="w-1/2 relative">
        <img src={weather} alt="Background" className="absolute inset-0 object-cover w-full h-full"/>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Weather</h1>
          <p className="text-lg">Get the current temperature and rainfall of your area</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
