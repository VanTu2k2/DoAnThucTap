import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentForm from "../page/vnpay/components/PaymentForm";
import PaymentSuccess from "../page/vnpay/components/PaymentSuccess";
import GooglePay from "../page/google_pay/google_pay";
import Cart from "../page/cart/cart";

const NavigatorBrowser: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cart />} />
        <Route path="/vnpay-pay" element={<PaymentForm />} />
        <Route path="/google-pay" element={<GooglePay />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
};

export default NavigatorBrowser;
