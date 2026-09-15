import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import Bookingscreen from "./screens/Bookingscreen";
import Registerscreen from "./screens/Registerscreen";
import Loginscreen from "./screens/Loginscreen";
import Profilescreen from "./screens/Profilescreen";
import Adminscreen from "./screens/Adminscreen";
import Landingscreen from "./screens/Landingscreen";

function App() {
  return (
    <BrowserRouter>
      <div className="App d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Landingscreen />} />
            <Route path="/home" element={<Homescreen />} />
            <Route path="/book/:roomid/:fromDate/:toDate" element={<Bookingscreen />} />
            <Route path="/register" element={<Registerscreen />} />
            <Route path="/login" element={<Loginscreen />} />
            <Route path="/bookings" element={<Profilescreen />} />
            <Route path="/admin" element={<Adminscreen />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
