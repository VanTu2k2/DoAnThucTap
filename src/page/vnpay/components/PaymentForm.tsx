import React, { useState, useEffect } from "react";
import { createVNPayPayment } from "../services/paymentService";
import "../../../styles/vnpay.css";

const PaymentForm: React.FC = () => {
  // State for user input and loading state
  const [userId, setUserId] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Automatically generate userId when component mounts
  useEffect(() => {
    // Generate a random user ID (for example, a random number between 1 and 1000)
    const randomUserId = Math.floor(Math.random() * 1000) + 1; // Example random ID
    setUserId(randomUserId);
  }, []); // Empty dependency array to run only once when the component mounts

  // Handle the payment submission
  const handlePayment = async () => {
    // Validate user ID and amount
    if (!userId || userId <= 0) {
      setError("User ID phải là số dương!");
      return;
    }
    if (!amount || amount <= 0) {
      setError("Số tiền phải là số dương!");
      return;
    } else if (amount < 10000) {
      setError("Số tiền phải từ 10,000 VND trở lên!");
      return;
    } else if (amount > 50000000) {
      setError("Số tiền phải từ 10,000 VND đến 50,000,000 VND!");
      return;
    }

    // Reset any previous errors before processing the payment
    setError("");

    try {
      setLoading(true);
      const paymentUrl = await createVNPayPayment(
        userId as number,
        amount as number
      );
      console.log("VNPay URL:", paymentUrl); // Check URL in console
      // Redirect to payment URL
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      setError("Có lỗi xảy ra trong quá trình thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <img
        src="/credit-card.png"
        alt="credit-card.png"
        height={80}
        width={80}
      />
      <div
        className="boxcard"
        title="Chấp nhận thanh toán bằng thẻ Visa, Mastercard, QR Code"
      >
        <img src="/visa.png" alt="visa" />
        <img src="/card.png" alt="mastercard" />
        <img src="/qr-scan.png" alt="jcb" />
      </div>
      {/* Display error message */}
      {error && (
        <div className="error-message" style={{ color: "red" }}>
          {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <label>Thông tin khách hàng:</label>
        <input
          type="number"
          value={userId}
          readOnly
          placeholder="User ID được tạo tự động"
        />
      </div>

      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <label>Chọn ngân hàng:</label>
        <select id="bankCode" name="bankCode">
          <option value="">--- Trống ---</option>
          <option value="NCB">Ngân hàng NCB</option>
          <option value="AGRIBANK">Ngân hàng AGRIBANK</option>
          <option value="SCB">Ngân hàng SCB</option>
          <option value="SACOMBANK">Ngân hàng SACOMBANK</option>
          <option value="EXIMBANK">Ngân hàng EXIMBANK</option>
          <option value="MSBANK">Ngân hàng MSBANK</option>
          <option value="NAMABANK">Ngân hàng NAMABANK</option>
          <option value="VNMART">Ngân hàng VNMART</option>
          <option value="VIETINBANK">Ngân hàng VIETINBANK</option>
          <option value="VIETCOMBANK">Ngân hàng VIETCOMBANK</option>
          <option value="HDBANK">Ngân hàng HDBANK</option>
          <option value="DONGABANK">Ngân hàng DONGABANK</option>
          <option value="TPBANK">Ngân hàng TPBANK</option>
          <option value="OJB">Ngân hàng OJB</option>
          <option value="MBBANK">Ngân hàng MBBANK</option>
          <option value="ACB">Ngân hàng ACB</option>
          <option value="VPBANK">Ngân hàng VPBANK</option>
          <option value="HDBANK">Ngân hàng HDBANK</option>
          <option value="TECHCOMBANK">Ngân hàng TECHCOMBANK</option>
          <option value="VPAYQR">Ngân hàng VPAYQR</option>
          <option value="SAIGONBANK">Ngân hàng SAIGONBANK</option>
          <option value="OCB">Ngân hàng OCB</option>
          <option value="IVB">Ngân hàng IVB</option>
        </select>
      </div> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <label>
          Tổng số tiền cần thanh toán: <span className="jet">VND</span>
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value) || "")}
          min={10000}
          max={50000000}
          title="Số tiền từ 10,000 VND đến 50,000,000 VND"
        />
      </div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Đang xử lý..." : "Thanh Toán"}
      </button>
    </div>
  );
};

export default PaymentForm;
