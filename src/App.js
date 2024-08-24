import React from "react";
import "./App.css";
import LoyalCustomers from "./components/LoyalCustomers";
import RevenueSpikes from "./components/RevenueSpikes";
function App() {
  // Giả sử bạn biết ID của đơn hàng

  return (
    <div className="app">
      <div className="container">
        <RevenueSpikes />
        <LoyalCustomers/>
      </div>
    </div>
  );
}

export default App;
