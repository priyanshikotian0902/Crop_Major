import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from "../support/landing.png";

export default function Landing() {
  const navigate = useNavigate();

  const handleWeatherReportClick = () => {
    navigate('/weather');
  };

  const handleStartPredictionClick = () => {
    navigate('/weather');
  };

  return (
    <div className="relative bg-white h-screen">
      <nav className="flex justify-between items-center py-4 px-8 z-10">
        <div className="text-3xl font-bold text-[#bd1e59]">GrowWise</div>
        <div className="flex space-x-4">
          <a className="text-gray-600 hover:text-gray-900" href="/">
            Home
          </a>
          <a className="text-gray-600 hover:text-gray-900" href="/explore">
            Explore
          </a>
          <a className="text-gray-600 hover:text-gray-900" href="/contact">
            Contact
          </a>
        </div>
        <div className="flex space-x-8">
          <a className="text-gray-600 hover:text-gray-900" href="#">
            growwise.find.in
          </a>
          <button
            className="bg-black text-white px-4 py-2 rounded-md"
            onClick={handleWeatherReportClick}
          >
            Weather Report
          </button>
        </div>
      </nav>
      <div className="relative h-full">
        <img
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={backgroundImage}
          alt="Background"
        />
        <div className="absolute inset-0 w-full h-full bg-black opacity-50 z-0"></div> {/* Optional: Adds a dark overlay */}
        <div className="flex items-center justify-center h-full z-10 relative px-8">
          <div className="text-white max-w-lg ml-auto">
            <h1 className="text-6xl font-bold mb-4">A New Way to Look at Agriculture</h1>
            <p className="text-lg text-gray-100 mb-4">
              GrowWise provides farmers and producers with online self-service
              applications and educational materials to predict Crop, Nutrient and Fertilizer Supply.
            </p>
            <button
              className="bg-[#22C55E] text-white px-8 py-4 rounded-full mt-4 font-bold"
              onClick={handleStartPredictionClick}
            >
              Start Prediction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
