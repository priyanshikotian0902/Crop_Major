import {  BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import Landing from "./components/Landing";
// import Form from "./components/Form";
import Weather from "./components/Weather";
import Crop from "./components/Crop";
import Nutrients from "./components/Nutrients";
import Fertilizer from "./components/Fertilizer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
       {/*<Route path="/predict" element={<Form />} />*/}
        <Route path="/weather" element={<Weather />} />
          <Route path="/crop" element={<Crop />} />
   <Route path="/nutrients" element={<Nutrients />} />
          <Route path="/fertilizers" element={<Fertilizer />} />
      </Routes>
    </Router>
  );
}

export default App;
