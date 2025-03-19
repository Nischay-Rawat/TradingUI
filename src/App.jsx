import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Feed from "./Feed";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const AUTH_URL = `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

const Login = () => {
  const handleLogin = () => {
    window.location.href = AUTH_URL;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleLogin}
        className="px-6 py-2 text-white bg-blue-600 rounded"
      >
        Login with Upstox
      </button>
    </div>
  );
};

const Callback = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchToken = async () => {
      const code = new URLSearchParams(location.search).get("code");
      if (code) {
        try {
          const response = await axios.post(
            "https://api.upstox.com/v2/login/authorization/token",
            {
              code,
              client_id: CLIENT_ID,
              redirect_uri: REDIRECT_URI,
              grant_type: "authorization_code",
              client_secret: CLIENT_SECRET,
            },
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
              },
            }
          );
          setToken(response.data.access_token);
          localStorage.setItem("accessToken", response.data.access_token);
          navigate("/dashboard");
        } catch (error) {
          console.error("Error fetching token", error);
        }
      }
    };
    fetchToken();
  }, [location, navigate]);

  return <div>Authenticating...</div>;
};

const Dashboard = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <Feed/>

      <a
        href="/place-order"
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Place Order
      </a>
    </div>
  );
};

const PlaceOrder = () => {
  const [order, setOrder] = useState({ quantity: 1, price: "", stock: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.post(
        "https://api.upstox.com/v2/orders",
        {
          ...order,
          order_type: "LIMIT",
          exchange: "NSE",
          transaction_type: "BUY",
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log("Order placed", response.data);
    } catch (error) {
      console.error("Error placing order", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Place Order</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          placeholder="Stock Symbol"
          className="border p-2 w-full"
          value={order.stock}
          onChange={(e) => setOrder({ ...order, stock: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full"
          value={order.price}
          onChange={(e) => setOrder({ ...order, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 w-full"
          value={order.quantity}
          onChange={(e) => setOrder({ ...order, quantity: e.target.value })}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        {/* <Route path="/dashboard"element={<Dashboard/>} */}
        
      </Routes>
    </Router>
  );
};

export default App;
