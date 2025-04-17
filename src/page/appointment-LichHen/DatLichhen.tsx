import { useEffect, useState } from "react";
import { createAppointment } from "../../service/apiAppoinment";
import { getServiceSPA } from "../../service/apiService";
import { CustomerDataFull } from "../../interface/CustomerData_interface";
import { ServiceFull } from "../../interface/ServiceSPA_interface";
// import { getCustomers } from "../../service/apiCustomer";
// import { Listbox, Transition } from "@headlessui/react";
// import { Fragment } from "react";
// import { CheckIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi"); // đặt ngôn ngữ tiếng Việt

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00"
];

const generateWeek = (startDate: dayjs.Dayjs) => {
  return Array.from({ length: 7 }, (_, i) => startDate.add(i, "day"));
};

const BookingPage = () => {
    const [services, setServices] = useState<ServiceFull[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDataFull | null>(null);
    const [notes, setNotes] = useState("");

    const location = useLocation();
    const preSelectedService = location.state?.selectedService || null;
    const [selectedServices, setSelectedServices] = useState(preSelectedService ? [preSelectedService.id] : []);

    // const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

    const handleToggleService = (id: number) => {
        if (selectedServices.includes(id)) {
            setSelectedServices((prev) => prev.filter((s) => s !== id));
        } else {
            setSelectedServices((prev) => [...prev, id]);
        }
    };

    const handleSubmit = async () => {
        const userId = currentUser?.id;
        const hasSelectedServices = preSelectedService || selectedServices.length > 0;
        console.log("preSelectedService", preSelectedService);
        console.log("selectedServices", selectedServices);

        if (!userId) {
            console.warn("Thiếu thông tin người dùng:", currentUser);
            alert("Thiếu thông tin người dùng.");
            return;
        }
        
        if (!hasSelectedServices) {
            console.warn("Chưa chọn dịch vụ:", selectedServices, preSelectedService);
            alert("Vui lòng chọn ít nhất một dịch vụ.");
            return;
        }
        
        if (!selectedDate || !selectedTime) {
            console.warn("Thiếu ngày hoặc giờ:", selectedDate, selectedTime);
            console.log(selectedDate, selectedTime)
            alert("Vui lòng chọn ngày và giờ hẹn.");
            return;
        }        

        const serviceIds = preSelectedService
            ? [preSelectedService.id]
            : selectedServices;

        const totalPrice = preSelectedService
            ? preSelectedService.price
            : services
                .filter((s) => selectedServices.includes(s.id))
                .reduce((sum, s) => sum + s.price, 0);

        // Ghép selectedDate + selectedTime vào appointmentDateTime
        const [hour, minute] = selectedTime.split(":").map(Number);
        const appointmentDateTime = selectedDate
            .hour(hour)
            .minute(minute)
            .second(0)
            .millisecond(0)
            .toDate()
            .toISOString();

        const payload = {
            userId,
            appointmentDateTime,
            totalPrice,
            notes,
            serviceIds,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            await createAppointment(payload);
            alert("Đặt lịch thành công!");

            if (!preSelectedService) {
            setSelectedServices([]);
            }
            setNotes("");
        } catch (error: unknown) {
            if (error instanceof Error) {
            alert(error.message || "Đặt lịch thất bại.");
            } else {
            alert("Đặt lịch thất bại.");
            }
        }
    };

    // Lấy thông tin người dùng
    useEffect(() => {
        const fetchData = async () => {
            const srv = await getServiceSPA();
            setServices(srv);
    
            const userData = localStorage.getItem("user");
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setSelectedCustomer(parsedUser);
            }
        };
        fetchData();
    }, []);


    const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf("week"));
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const week = generateWeek(currentWeekStart);

    const handlePrevWeek = () => setCurrentWeekStart(currentWeekStart.subtract(7, "day"));
    const handleNextWeek = () => setCurrentWeekStart(currentWeekStart.add(7, "day"));

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <h2 className="text-3xl font-bold text-center">Đặt Lịch Hẹn Spa</h2>

            {/* BƯỚC 1: Thông tin khách hàng đã đăng nhập */}
            <section>
                <h3 className="text-xl font-semibold mb-4">Thông Tin Đặt Hẹn</h3>
                {selectedCustomer ? (
                    <div className="flex gap-6 items-center border p-4 rounded-lg shadow-sm">
                        <img
                            src={selectedCustomer.imageUrl}
                            alt="avatar"
                            className="w-24 h-24 rounded-full object-cover border"
                        />
                        <div className="space-y-1">
                            <p>
                                <span className="font-semibold">Tên: </span>
                                {selectedCustomer.name}
                            </p>

                            <p>
                                <span className="font-semibold">Email: </span>
                                {selectedCustomer.email}
                            </p>

                            <p>
                                <span className="font-semibold">Số điện thoại: </span>
                                {selectedCustomer.phone}
                            </p>

                            {/* <p>
                                <span className="font-semibold">Địa chỉ: </span>
                                {selectedCustomer.address}
                            </p>
                            {selectedCustomer.description && (
                                <p>
                                    <span className="font-semibold">Ghi chú: </span>
                                    {selectedCustomer.description}
                                </p>
                            )} */}

                        </div>
                    </div>
                ) : (
                    <p className="text-red-500">Không tìm thấy thông tin người dùng.</p>
                )}
            </section>

            {/* BƯỚC 2: Chọn dịch vụ */}
            <section>
                <h3 className="text-xl font-semibold mb-4">2. Dịch vụ bạn muốn làm</h3>

                {preSelectedService ? (
                    <div className="border rounded-lg p-3 flex gap-3 items-center bg-blue-100 border-blue-500">
                    <img src={preSelectedService.images[0]} alt="" className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                        <p className="font-semibold">{preSelectedService.name}</p>
                        <p className="text-sm text-orange-500">{preSelectedService.price.toLocaleString()} VND</p>
                        <p className="text-sm mt-1">{preSelectedService.description}</p>
                    </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((s) => (
                        <div
                        key={s.id}
                        className={`border rounded-lg p-3 flex gap-3 items-center ${
                            selectedServices.includes(s.id) ? "bg-blue-100 border-blue-500" : ""
                        }`}
                        >
                        <img src={s.images[0]} alt="" className="w-24 h-24 object-cover rounded" />
                        <div className="flex-1">
                            <p className="font-semibold">{s.name}</p>
                            <p className="text-sm text-gray-500">{s.price.toLocaleString()} VND</p>
                            <label className="flex items-center gap-2 mt-2">
                            <input
                                type="checkbox"
                                checked={selectedServices.includes(s.id)}
                                onChange={() => handleToggleService(s.id)}
                            />
                            <span>Chọn dịch vụ</span>
                            </label>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
            </section>

            {/* BƯỚC 3: Ghi chú & Xác nhận */}
            <section>
                <h3 className="text-xl font-semibold mb-4">3. Ghi chú & Xác nhận</h3>

                <textarea
                    className="w-full border rounded p-3"
                    placeholder="Ghi chú thêm (tuỳ chọn)..."
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />

                {/* Tổng tiền */}
                    {/* Cách 1 */}
                {/* <div className="text-right mt-4 text-lg font-bold">
                    Tổng tiền:{" "}
                    {services
                    .filter((s) => selectedServices.includes(s.id))
                    .reduce((sum, s) => sum + s.price, 0)
                    .toLocaleString()} VND
                </div> */}
                    {/* Cách 2 */}
                <div className="text-right mt-4 text-lg font-bold">
                    Tổng tiền:{" "}
                    {(preSelectedService
                    ? preSelectedService.price
                    : services
                        .filter((s) => selectedServices.includes(s.id))
                        .reduce((sum, s) => sum + s.price, 0)
                    ).toLocaleString("vi-VN")} VND
                </div>
            </section>           

            {/* BƯỚC 4: Chọn ngày giờ */}
            <section>
                {/* Tiêu đề và chú thích màu */}
                <div className="flex items-center mb-3">
                    <h3 className="text-xl font-semibold">4. Chọn Ngày Giờ</h3>
                    <div className="flex items-center ml-6 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <span className="inline-block w-4 h-4 rounded bg-green-100 border border-green-400"></span>
                            Còn trống
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="inline-block w-4 h-4 rounded bg-orange-500"></span>
                            Đang chọn
                        </div>
                    </div>
                </div>
                
                <div className="border p-4 rounded-lg space-y-4 shadow-sm">
                    {/* Điều hướng tuần */}
                    <div className="flex justify-between items-center mb-2">
                        {/* Hiển thị nút quay lại tuần trước nếu tuần hiện tại chưa hết và chưa qua ngày hiện tại */}
                        {dayjs().isBefore(currentWeekStart, "day") && (
                            <button
                                onClick={handlePrevWeek}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                ←
                            </button>
                        )}

                        <div className="flex-1 text-center font-semibold text-gray-700">
                            {/* Hiển thị tuần với dayjs */}
                            Tuần {currentWeekStart.format("DD/MM")} - {currentWeekStart.add(6, "day").format("DD/MM")}
                        </div>

                        {/* Hiển thị nút chuyển tới tuần sau */}
                        <button
                            onClick={handleNextWeek}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            →
                        </button>
                    </div>

                    {/* Hiển thị các ngày trong tuần */}
                    <div className="grid grid-cols-7 gap-2 text-center text-sm">
                        {Array.from({ length: 7 }, (_, i) => currentWeekStart.add(i, "day")).map((day) => {
                            const dayMoment = dayjs(day);

                            return dayMoment.isBefore(dayjs(), "day") ? null : (
                                <button
                                    key={dayMoment.toString()}
                                    onClick={() => setSelectedDate(dayMoment)}
                                    className={`py-2 px-1 rounded-lg transition-all
                                        ${dayMoment.isSame(selectedDate, "day") ? "bg-orange-500 text-white" : "bg-gray-100 hover:bg-orange-100"}
                                    `}
                                >
                                    <div className="font-medium">{dayMoment.format("ddd")}</div>
                                    <div>{dayMoment.format("DD/MM")}</div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Giờ cố định mẫu */}
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {timeSlots.map((time) => {
                            const currentDateTime = dayjs(); // Lấy thời gian hiện tại bằng dayjs
                            const timeSlotMoment = dayjs(`${selectedDate.format("YYYY-MM-DD")} ${time}`, "YYYY-MM-DD HH:mm");

                            // Kiểm tra nếu giờ đã qua thì ẩn đi
                            return timeSlotMoment.isBefore(currentDateTime) ? null : (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-2 rounded-lg text-sm transition-all
                                        ${selectedTime === time ? "bg-orange-500 text-white" : "bg-green-100 hover:bg-orange-100"}
                                    `}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>

                    {/* Hiển thị thời gian đã chọn */}
                    {selectedTime && (
                        <div className="mt-4 text-center text-sm text-gray-700">
                            Đã chọn: <strong>{selectedDate.format("DD/MM/YYYY")} - {selectedTime}</strong>
                        </div>
                    )}
                </div>
            </section>

            {/* Nút xác nhận */}
            <button
                onClick={handleSubmit}
                className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700">
                Xác nhận đặt lịch
            </button>

        </div>

    );
};

export default BookingPage;
