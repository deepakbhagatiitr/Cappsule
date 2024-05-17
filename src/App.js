import './App.css';
import Home from './components/Home';
import MedicineInformation from './components/Medicine';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/medicine" element={<MedicineInformation/>} />
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;