import axios from "axios";

// Khởi tạo axios instance
const api = axios.create({
    //baseURL: "https://massage-therapy-production.up.railway.app/api",
    baseURL: import.meta.env.VITE_URL_SERVER,
    withCredentials: true, // Đảm bảo gửi cookie tự động
  });


  /// Payment - Thanh Toán -----------------------------------------------------------------------------------------------------------
export const createPayment = async (data: any) => {
  try {
    const response = await api.post("/payments/vnpay", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to create payment.");
    }
  } 
} 

// Google Pay
export const saveGooglePayPaymentInfo = async (payload: any) => {
  try {
    const response = await api.post("/google-pay/save-payment-info", payload);
    return response; // Return the entire response to check status
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to save Google Pay payment info.");
    }
  }
};


export const getTransactionById = async (id: number) => {
  try {
    const response = await api.get(`/vnpay/transaction/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to get transaction.");
    }
  } 
}

export const callback = async () => {
  try {
    const response = await api.get("/vnpay/callback");
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw error;
    } else {
      throw new Error("Failed to get transactions.");
    }
  } 
}