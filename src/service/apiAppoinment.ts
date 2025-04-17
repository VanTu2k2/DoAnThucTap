import axios from "axios";
import { AppointmentForm } from "../interface/AppointmentForm_interface";

// Khởi tạo axios instance
const api = axios.create({
  //baseURL: "https://massage-therapy-production.up.railway.app/api",
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Đảm bảo gửi cookie tự động
});

// thêm lịch hẹn
export const createAppointment = (data: AppointmentForm) => {
  try {
    return api.post("/appointments/create", data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Khong the ket noi den server");
    }
  }
};

// Xem tất cả lịch đặt hẹn
export const getAllAppointments = async () => {
  try {
    const response = await api.get("/appointments/");
    return response.data; // hoặc response nếu muốn lấy thêm status, headers...
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Không thể kết nối đến server");
    }
  }
};
