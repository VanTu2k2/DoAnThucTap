import { useEffect, useState } from "react";
import { getAllAppointments } from "../../service/apiAppoinment";
import { AppointmentResponse } from "../../interface/AppointmentForm_interface";
import { X } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

const statusColor = {
  PENDING: "bg-orange-200 text-orange-700 border-orange-300",
  SCHEDULED: "bg-green-200 text-green-800 border-green-300",
  CANCELLED: "bg-red-200 text-red-800 border-red-300",
  COMPLETED: "bg-blue-200 text-blue-800 border-blue-300",
};

type AppointmentStatus = "PENDING" | "SCHEDULED" | "CANCELLED" | "COMPLETED";

interface AppointmentListProps {
  filterByStatus?: AppointmentStatus[];
}

// const AppointmentList = () => {
const AppointmentList: React.FC<AppointmentListProps> = ({ filterByStatus }) => {
  
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

  const fetchAppointments = async () => {
    try {
      const user = localStorage.getItem("user");
  
      if (!user) {
        console.warn("Không tìm thấy thông tin user.");
        return;
      }
  
      const userId = JSON.parse(user).id;
      const data: AppointmentResponse[] = await getAllAppointments();
  
      // Bước 1: Lọc theo userId
      const filtered: AppointmentResponse[] = data.filter(
        (appointment) => appointment.userId.id === userId
      );
  
      // Bước 2: Lọc thêm theo filterByStatus nếu có
      let finalList: AppointmentResponse[] = filtered;
  
      if (filterByStatus) {
        finalList = filtered.filter((item) =>
          filterByStatus.includes(item.status as AppointmentStatus)
        );
      }         
  
      // Cập nhật state
      setAppointments(finalList);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Lỗi khi tải lịch hẹn:", error.message);
      } else {
        console.error("Lỗi không xác định:", error);
      }
    }
  };  

  useEffect(() => {
    fetchAppointments();
  }, []);  

  const handleCancel = (id: number) => {
    setConfirmCancelId(id);
  };

  const updateAppointmentStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/appointments/${id}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status,
        updatedAt: new Date().toISOString()
      })
    });
  
    if (!res.ok) {
      const errText = await res.text();
      console.error("Chi tiết lỗi server:", errText);
      throw new Error("Cập nhật trạng thái thất bại");
    }
  
    return res.json();
  };

  const confirmCancel = async () => {
    if (!confirmCancelId) return;
  
    try {
      await updateAppointmentStatus(confirmCancelId, "CANCELLED");
  
      alert("Lịch hẹn đã được hủy thành công. Vui lòng vào mục 'Lịch sử' để xem các lịch đã hủy.");
  
      // Gọi lại API để load lại danh sách
      fetchAppointments();

    } catch (error) {
      console.error("Lỗi khi hủy lịch:", error);
      alert("Hủy lịch thất bại. Vui lòng thử lại.");
    } finally {
      setConfirmCancelId(null);
    }
  };
  
  
  return (
    <div className="space-y-4 px-4 py-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="bg-white border rounded-lg shadow-sm p-4 space-y-3"
        >
          <p className="font-bold text-lg text-gray-800">
            {appointment.userId.name}
          </p>

          <div className="space-y-1 text-sm text-gray-700">
            <p>Gói dịch vụ</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {appointment.serviceIds.map((service) => (
                <li key={service.id}>
                  <span className="font-medium">{service.name}</span> – {service.duration} phút{" "}
                  <button
                    onClick={() => setSelectedService(service)}
                    className="ml-2 text-blue-600 text-xs underline"
                  >
                    Xem chi tiết
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            ⏰ {dayjs(appointment.appointmentDateTime).add(7, 'hour').format("dddd, DD/MM/YYYY [lúc] HH:mm")}
          </p>

          <p className="text-sm text-gray-700">
            <strong>Tổng tiền:</strong>{" "}
              <span className="text-orange-500 font-bold">
              {appointment.totalPrice.toLocaleString()}₫
              </span>
          </p>

          <p className="text-sm text-gray-600 italic">
            📝 Ghi chú: {appointment.notes || "Không có ghi chú"}
          </p>

          <div className="flex gap-2 flex-wrap mt-2">
            {["PENDING", "SCHEDULED", "CANCELLED", "COMPLETED"].map((status) => (
              <span
                key={status}
                className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors duration-200 ${
                  appointment.status === status
                    ? statusColor[status as keyof typeof statusColor]
                    : "bg-gray-100 text-gray-500 border border-gray-200"
                }`}
              >
                {status}
              </span>
            ))}
          </div>

          <div className="flex flex-col items-start gap-2 mt-4">
            {(appointment.status === "PENDING" ||
              (appointment.status === "SCHEDULED" &&
                dayjs(appointment.appointmentDateTime).diff(dayjs(), "hour") >= 2)) 
            }

            {appointment.status === "SCHEDULED" &&
              dayjs(appointment.appointmentDateTime).diff(dayjs(), "hour") < 2 && (
                <p className="text-xs text-gray-500 italic">
                  Bạn chỉ có thể hủy lịch trước 2 tiếng.
                </p>
            )}

            {(appointment.status === "CANCELLED" || appointment.status === "COMPLETED")}
          </div>

          <div className="text-right mt-3">
            {appointment.status === "CANCELLED" ? (
              <span className="inline-block text-sm text-red-500 italic">
                Đã hủy lịch hẹn
              </span>
            ) : (
              <button
                onClick={() => handleCancel(appointment.id)}
                className="inline-block bg-red-100 hover:bg-red-200 text-red-600 text-sm px-4 py-1 rounded"
              >
                Hủy lịch hẹn
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Modal Chi tiết dịch vụ */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-3 max-w-lg w-full shadow-lg space-y-4 relative">
            <div>
              {/* Nút X đóng */}
              <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                >
                  <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-pink-600">
                🧖 Chi tiết: {selectedService.name}
              </h3>
            </div>
          
            <p className="text-gray-700">{selectedService.description}</p>

            <ul className="list-decimal list-inside text-gray-600">
              {selectedService.steps.map((step: any) => (
                <li key={step.stepId}>{step.description}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Confirm Hủy lịch */}
      {confirmCancelId && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md space-y-4 text-center">
            <p className="text-lg font-semibold text-red-600">
              Bạn có chắc muốn hủy lịch hẹn không?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Có, hủy ngay
              </button>
              <button
                onClick={() => setConfirmCancelId(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Không, giữ lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;