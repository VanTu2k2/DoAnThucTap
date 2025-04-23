// import { useEffect, useState } from "react";
// import { getAppointmentAll } from "../../service/apiAppoinment";
// import { AppointmentResponse } from "../../interface/AppointmentForm_interface";
// import { Service } from "../../interface/AppointmentForm_interface";
// import { Step } from "../../interface/AppointmentForm_interface";
// import { X } from "lucide-react";
// import dayjs from "dayjs";
// import "dayjs/locale/vi";
// dayjs.locale("vi");

// const statusColor = {
//   PENDING: "bg-orange-200 text-orange-700 border-orange-300",
//   SCHEDULED: "bg-green-200 text-green-800 border-green-300",
//   CANCELLED: "bg-red-200 text-red-800 border-red-300",
//   COMPLETED: "bg-blue-200 text-blue-800 border-blue-300",
// };

// const statusLabel: Record<AppointmentStatus, string> = {
//   PENDING: "Chờ xác nhận",
//   SCHEDULED: "Đã đặt lịch",
//   CANCELLED: "Đã hủy",
//   COMPLETED: "Hoàn thành",
// };

// type AppointmentStatus = "PENDING" | "SCHEDULED" | "CANCELLED" | "COMPLETED";

// interface AppointmentListProps {
//   filterByStatus?: AppointmentStatus[];
// }

// // const AppointmentList = () => {
// const AppointmentList: React.FC<AppointmentListProps> = ({ filterByStatus }) => {
  
//   const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
//   const [selectedService, setSelectedService] = useState<Service | null>(null);
//   const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

//   const fetchAppointments = async () => {
//     try {
//       const user = localStorage.getItem("user");
  
//       if (!user) {
//         console.warn("Không tìm thấy thông tin user.");
//         return;
//       }
  
//       // const userId = JSON.parse(user).id;
//       // const data: AppointmentResponse[] = await getAppointmentAll();
  
//       // // Bước 1: Lọc theo userId
//       // const filtered: AppointmentResponse[] = data.filter(
//       //   (appointment) => appointment.userId?.id === userId
//       // );

//       const parsedUser = JSON.parse(user);
//       const userEmail = parsedUser.email?.toLowerCase(); // đảm bảo chữ thường khi so sánh
//       // console.log("📧 Email người dùng hiện tại:", userEmail);

//       const data: AppointmentResponse[] = await getAppointmentAll();

//       // Lọc lịch hẹn theo email khách hàng
//       const filtered: AppointmentResponse[] = data.filter(
//         (appointment) =>
//           appointment.userId?.email?.toLowerCase() === userEmail
//       );
//       // console.log("📅 Tất cả lịch hẹn theo email:", filtered);


//       // Bước 2: Lọc thêm theo filterByStatus nếu có
//       let finalList: AppointmentResponse[] = filtered;
  
//       if (filterByStatus) {
//         finalList = filtered.filter((item) =>
//           filterByStatus.includes(item.status as AppointmentStatus)
//         );
//       }         
  
//       // Cập nhật state
//       setAppointments(finalList);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error("Lỗi khi tải lịch hẹn:", error.message);
//       } else {
//         console.error("Lỗi không xác định:", error);
//       }
//     }
//   };  

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   // useEffect(() => {
//   //   fetchAppointments();
  
//   //   const interval = setInterval(() => {
//   //     console.log("🔄 Làm mới lúc:", new Date().toLocaleTimeString());
//   //     fetchAppointments();
//   //   }, 10000); // mỗi 10 giây gọi lại
  
//   //   return () => clearInterval(interval);
//   // }, []);

//   const handleCancel = (id: number) => {
//     setConfirmCancelId(id);
//   };

//   const updateAppointmentStatus = async (id: number, status: string) => {
//     const res = await fetch(`/api/appointments/${id}/cancel`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         status,
//         updatedAt: new Date().toISOString()
//       })
//     });
  
//     if (!res.ok) {
//       const errText = await res.text();
//       console.error("Chi tiết lỗi server:", errText);
//       throw new Error("Cập nhật trạng thái thất bại");
//     }
  
//     return res.json();
//   };

//   const confirmCancel = async () => {
//     if (!confirmCancelId) return;
  
//     try {
//       await updateAppointmentStatus(confirmCancelId, "CANCELLED");
  
//       alert("Lịch hẹn đã được hủy thành công.\n\nVui lòng vào mục 'Lịch sử' để xem các lịch đã hủy.");
  
//       // Gọi lại API để load lại danh sách
//       fetchAppointments();

//     } catch (error) {
//       console.error("Lỗi khi hủy lịch:", error);
//       alert("Hủy lịch thất bại. Vui lòng thử lại.");
//     } finally {
//       setConfirmCancelId(null);
//     }
//   };
  
  
//   return (
//     <div className="space-y-4 px-4 py-4">
//       {appointments.map((appointment) => (
//         <div
//           key={appointment.id}
//           className="bg-white border rounded-lg shadow-sm p-4 space-y-3"
//         >
//           <p className="font-bold text-lg text-gray-800">
//             {appointment.userId?.name}
//           </p>

//           <div className="space-y-1 text-sm text-gray-700">
//             <p>Gói dịch vụ</p>
//             <ul className="list-disc list-inside space-y-1 text-gray-700">
//               {appointment.serviceIds.map((service) => (
//                 <li key={service.id}>
//                   <span className="font-medium">{service.name}</span> - {service.duration} phút{" "}
//                   <button
//                     onClick={() => setSelectedService(service)}
//                     className="ml-2 text-blue-600 text-xs underline"
//                   >
//                     Xem chi tiết
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <p className="text-sm text-gray-600">
//             ⏰ {dayjs(appointment.appointmentDateTime).format("dddd, DD/MM/YYYY [lúc] HH:mm").replace(/^\w/, c => c.toUpperCase())}
//           </p>


//           <p className="text-sm text-gray-700">
//             <strong>Tổng tiền:</strong>{" "}
//               <span className="text-orange-500 font-bold">
//               {appointment.totalPrice.toLocaleString()}₫
//               </span>
//           </p>

//           <p className="text-sm text-gray-600 italic">
//             📝 Ghi chú: {appointment.notes || "Không có ghi chú"}
//           </p>

//           <div className="flex gap-2 flex-wrap mt-2">
//             {(["PENDING", "SCHEDULED", "CANCELLED", "COMPLETED"] as AppointmentStatus[]).map((status) => (
//               <span
//                 key={status}
//                 className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors duration-200 ${
//                   appointment.status === status
//                     ? statusColor[status]
//                     : "bg-gray-100 text-gray-500 border border-gray-200"
//                 }`}
//               >
//                 {statusLabel[status]}
//               </span>
//             ))}
//           </div>

//           {/* <div className="flex flex-col items-start gap-2 mt-4">
//             {(appointment.status === "PENDING" ||
//               (appointment.status === "SCHEDULED" &&
//                 dayjs(appointment.appointmentDateTime).diff(dayjs(), "hour") >= 2)) 
//             }

//             {appointment.status === "SCHEDULED" &&
//               dayjs(appointment.appointmentDateTime).diff(dayjs(), "hour") < 2 && (
//                 <p className="text-xs text-gray-500 italic">
//                   Bạn chỉ có thể hủy lịch trước 2 tiếng.
//                 </p>
//             )}

//             {(appointment.status === "CANCELLED" || appointment.status === "COMPLETED")}
//           </div> */}

//           {/* Sau 2 tiếng, Thời gian chuyển từ PENDING sang SCHEDULED */}
//           <div className="text-right mt-3">
//             {(appointment.status === "PENDING" ||
//               (appointment.status === "SCHEDULED" &&
//                 dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "hour") < 2)) && (
//               <button
//                 onClick={() => handleCancel(appointment.id)}
//                 className="inline-block bg-red-100 hover:bg-red-200 text-red-600 text-sm px-4 py-1 rounded"
//               >
//                 Hủy lịch hẹn
//               </button>
//             )}

//             {appointment.status === "SCHEDULED" && (
//               <>
//                 {(appointment as { updatedAt?: string }).updatedAt && (
//                   <>
//                     <p className="text-xs text-gray-500 italic">
//                       Đã xác nhận lúc:{" "}
//                       {dayjs((appointment as { updatedAt?: string }).updatedAt!).format("HH:mm DD/MM/YYYY")}
//                     </p>

//                     {/* Thông báo thời gian còn lại để hủy */}
//                     {dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "hour") < 2 ? (
//                       <p className="text-xs text-green-600 italic">
//                         Bạn còn {120 - dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "minute")} phút để hủy lịch hẹn.
//                       </p>
//                     ) : (
//                       <p className="text-xs text-red-500 italic">
//                         Bạn chỉ có thể hủy trong vòng 2 tiếng sau khi được xác nhận.
//                       </p>
//                     )}
//                   </>
//                 )}
//               </>
//             )}

//             {(appointment.status === "CANCELLED" || appointment.status === "COMPLETED") && (
//               <div className="text-right w-full">
//                 {appointment.status === "CANCELLED" ? (
//                   <span className="inline-block text-sm text-red-500 italic">Đã hủy lịch hẹn</span>
//                 ) : (
//                   <span className="inline-block text-sm text-blue-500 italic">Đã hoàn thành</span>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Sau 5 phút */}
//           {/* <div className="flex flex-col items-start gap-2 mt-4"> */}
//           {/* <div className="text-right mt-3">
//             {(appointment.status === "PENDING" ||
//               (appointment.status === "SCHEDULED" &&
//                 dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "minute") <= 5)) && (
//               <button
//                 onClick={() => handleCancel(appointment.id)}
//                 className="inline-block bg-red-100 hover:bg-red-200 text-red-600 text-sm px-4 py-1 rounded"
//               >
//                 Hủy lịch hẹn
//               </button>
//             )}

//             {appointment.status === "SCHEDULED" && (
//               <>
//                 {(appointment as { updatedAt?: string }).updatedAt && (
//                   <>
//                     <p className="text-xs text-gray-500 italic">
//                       Đã xác nhận lúc:{" "}
//                       {dayjs((appointment as { updatedAt?: string }).updatedAt!).format("HH:mm DD/MM/YYYY")}
//                     </p>

//                     {dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "minute") > 5 && (
//                       <p className="text-xs text-red-500 italic">
//                         Bạn chỉ có thể hủy trong vòng 5 phút sau khi được xác nhận.
//                       </p>
//                     )}
//                   </>
//                 )}
//               </>
//             )}

//             {(appointment.status === "CANCELLED" || appointment.status === "COMPLETED") && (
//               <div className="text-right w-full">
//                 {appointment.status === "CANCELLED" ? (
//                   <span className="inline-block text-sm text-red-500 italic">Đã hủy lịch hẹn</span>
//                 ) : (
//                   <span className="inline-block text-sm text-blue-500 italic">Đã hoàn thành</span>
//                 )}
//               </div>
//             )}
//           </div> */}

//           {/* <div className="text-right mt-3">
//             {appointment.status === "CANCELLED" ? (
//               <span className="inline-block text-sm text-red-500 italic">
//                 Đã hủy lịch hẹn
//               </span>

//             ) : appointment.status === "COMPLETED" ? (
//               <span className="inline-block text-sm text-blue-500 italic">
//                 Đã hoàn thành
//               </span>

//             ) : (
//               <button
//                 onClick={() => handleCancel(appointment.id)}
//                 className="inline-block bg-red-100 hover:bg-red-200 text-red-600 text-sm px-4 py-1 rounded"
//               >
//                 Hủy lịch hẹn
//               </button>
//             )}
//           </div> */}

//         </div>
//       ))}

//       {/* Modal Chi tiết dịch vụ */}
//       {selectedService && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
//           <div className="bg-white rounded-xl p-3 max-w-lg w-full shadow-lg space-y-4 relative">
//             <div>
//               {/* Nút X đóng */}
//               <button
//                   onClick={() => setSelectedService(null)}
//                   className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
//                 >
//                   <X className="w-5 h-5" />
//               </button>
//               <h3 className="text-lg font-semibold text-pink-600">
//                 🧖 Chi tiết: {selectedService.name}
//               </h3>
//             </div>
          
//             <p className="text-gray-700">{selectedService.description}</p>

//             <ul className="list-decimal list-inside text-gray-600">
//               {selectedService.steps.map((step: Step) => (
//                 <li key={step.stepId}>{step.description}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}

//       {/* Confirm Hủy lịch */}
//       {confirmCancelId && (
//         <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
//           <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md space-y-4 text-center">
//             <p className="text-lg font-semibold text-red-600">
//               Bạn có chắc muốn hủy lịch hẹn không?
//             </p>
//             <div className="flex justify-center gap-4 mt-4">
//               <button
//                 onClick={confirmCancel}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 Có, hủy ngay
//               </button>
//               <button
//                 onClick={() => setConfirmCancelId(null)}
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 Không, giữ lại
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AppointmentList;


import { useEffect, useState } from "react";
import { getAppointmentAll } from "../../service/apiAppoinment";
import { AppointmentResponse } from "../../interface/AppointmentForm_interface";
import { Service } from "../../interface/AppointmentForm_interface";
import { Step } from "../../interface/AppointmentForm_interface";
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

const statusLabel: Record<AppointmentStatus, string> = {
  PENDING: "Chờ xác nhận",
  SCHEDULED: "Đã đặt lịch",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn thành",
};

type AppointmentStatus = "PENDING" | "SCHEDULED" | "CANCELLED" | "COMPLETED";

interface AppointmentListProps {
  filterByStatus?: AppointmentStatus[];
}

const AppointmentList: React.FC<AppointmentListProps> = ({ filterByStatus }) => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

  const fetchAppointments = async () => {
    try {
      const user = localStorage.getItem("user");

      if (!user) {
        console.warn("Không tìm thấy thông tin user.");
        return;
      }

      const parsedUser = JSON.parse(user);
      const userEmail = parsedUser.email?.toLowerCase();

      const data: AppointmentResponse[] = await getAppointmentAll();

      // Lọc lịch hẹn theo email khách hàng
      const filtered: AppointmentResponse[] = data.filter(
        (appointment) =>
          appointment.userId?.email?.toLowerCase() === userEmail
      );

      let finalList: AppointmentResponse[] = filtered;

      if (filterByStatus) {
        finalList = filtered.filter((item) =>
          filterByStatus.includes(item.status as AppointmentStatus)
        );
      }

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

      alert("Lịch hẹn đã được hủy thành công.\n\nVui lòng vào mục 'Lịch sử' để xem các lịch đã hủy.");

      fetchAppointments();

    } catch (error) {
      console.error("Lỗi khi hủy lịch:", error);
      alert("Hủy lịch thất bại. Vui lòng thử lại.");
    } finally {
      setConfirmCancelId(null);
    }
  };

  const groupAppointmentsByDate = (appointments: AppointmentResponse[]) => {
    const grouped: Record<string, AppointmentResponse[]> = {};

    appointments.forEach((appointment) => {
      const dateKey = dayjs(appointment.appointmentDateTime).format("YYYY-MM-DD");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(appointment);
    });

    return grouped;
  };

  const groupedAppointments = groupAppointmentsByDate(appointments);

  return (
    <div className="space-y-4 px-4 py-4">
      {Object.keys(groupedAppointments).map((date) => (
        <div key={date} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {dayjs(date).format("dddd, DD/MM/YYYY").replace(/^\w/, c => c.toUpperCase())}
          </h3>

          {groupedAppointments[date].map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white border rounded-lg shadow-sm p-4 space-y-3"
            >
              <p className="font-bold text-base text-gray-800">
                {appointment.userId?.name}
              </p>

              <div className="space-y-1 text-sm text-gray-700">
                <p>Gói dịch vụ</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {appointment.serviceIds.map((service) => (
                    <li key={service.id}>
                      <span className="font-medium">{service.name}</span> - {service.duration} phút{" "}
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
                ⏰ {dayjs(appointment.appointmentDateTime).format("dddd, DD/MM/YYYY [lúc] HH:mm").replace(/^\w/, c => c.toUpperCase())}
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
                {(["PENDING", "SCHEDULED", "CANCELLED", "COMPLETED"] as AppointmentStatus[]).map((status) => (
                  <span
                    key={status}
                    className={`px-3 py-1 text-xs rounded-full border font-medium transition-colors duration-200 ${
                      appointment.status === status
                        ? statusColor[status]
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {statusLabel[status]}
                  </span>
                ))}
              </div>

              <div className="text-right mt-3">
                {(appointment.status === "PENDING" ||
                  (appointment.status === "SCHEDULED" &&
                    dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "hour") < 2)) && (
                  <button
                    onClick={() => handleCancel(appointment.id)}
                    className="inline-block bg-red-100 hover:bg-red-200 text-red-600 text-sm px-4 py-1 rounded"
                  >
                    Hủy lịch hẹn
                  </button>
                )}

                {appointment.status === "SCHEDULED" && (
                  <>
                    {(appointment as { updatedAt?: string }).updatedAt && (
                      <>
                        <p className="text-xs text-gray-500 italic">
                          Đã xác nhận lúc:{" "}
                          {dayjs((appointment as { updatedAt?: string }).updatedAt!).format("HH:mm DD/MM/YYYY")}
                        </p>

                        {dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "hour") < 2 ? (
                          <p className="text-xs text-green-600 italic">
                            Bạn còn {120 - dayjs().diff(dayjs((appointment as { updatedAt?: string }).updatedAt!), "minute")} phút để hủy lịch hẹn.
                          </p>
                        ) : (
                          <p className="text-xs text-red-500 italic">
                            Bạn chỉ có thể hủy trong vòng 2 tiếng sau khi được xác nhận.
                          </p>
                        )}
                      </>
                    )}
                  </>
                )}

                {(appointment.status === "CANCELLED" || appointment.status === "COMPLETED") && (
                  <div className="text-right w-full">
                    {appointment.status === "CANCELLED" ? (
                      <span className="inline-block text-sm text-red-500 italic">Đã hủy lịch hẹn</span>
                    ) : (
                      <span className="inline-block text-sm text-blue-500 italic">Đã hoàn thành</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Modal Chi tiết dịch vụ */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl p-3 max-w-lg w-full shadow-lg space-y-4 relative">
            <div>
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
              {selectedService.steps.map((step: Step) => (
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