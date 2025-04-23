import { useEffect, useState } from "react";
import { createAppointment } from "../../service/apiAppoinment";
import { getServiceSPA } from "../../service/apiService";
import { CustomerDataFull } from "../../interface/CustomerData_interface";
import { ServiceFull } from "../../interface/ServiceSPA_interface";

import { useLocation } from "react-router-dom";

import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi"); // đặt ngôn ngữ tiếng Việt

import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "13:00", "13:30", "14:00", "14:30", 
  "15:00", "15:30", "16:00", "16:30", "17:00"
];

const BookingPage = () => {
    const [services, setServices] = useState<ServiceFull[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDataFull | null>(null);
    const [notes, setNotes] = useState("");

    const location = useLocation();
    const preSelectedService = location.state?.selectedService || null;
    const [selectedServices, setSelectedServices] = useState(preSelectedService ? [preSelectedService.id] : []);

    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

    const handleToggleService = (id: number) => {
        if (selectedServices.includes(id)) {
            setSelectedServices((prev) => prev.filter((s) => s !== id));
        } else {
            setSelectedServices((prev) => [...prev, id]);
        }
    };

    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const [appointmentDate, setAppointmentDate] = useState<string>("");
    const [currentWeekStart, setCurrentWeekStart] = useState(dayjs().startOf("isoWeek")); // Bắt đầu từ thứ 2 đến CN
      
    const handleNextWeek = () => {
        setCurrentWeekStart(currentWeekStart.add(7, "day"));
    };

    const handlePrevWeek = () => {
        setCurrentWeekStart(currentWeekStart.subtract(7, "day"));
    };

    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // State cho lọc giá
    const [sortByPrice, setSortByPrice] = useState("default");
    
    // const filteredServices = services.filter((s) =>
    //   s.name.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    const filteredServices = services
    .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
        if (sortByPrice === "asc") return a.price - b.price;
        if (sortByPrice === "desc") return b.price - a.price;
        return 0;
    });
    
    // Tính chỉ mục trang
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedServices = filteredServices.slice(startIndex, endIndex);
    
    // Tổng số trang
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    const fromHome = location.state?.fromHome || false;

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

    const handleSubmit = async () => {
        const userId = currentUser?.id;
        const hasSelectedServices = preSelectedService || selectedServices.length > 0;
        
        console.log("preSelectedService", preSelectedService);
        console.log("selectedServices", selectedServices);

        // Kiểm tra thông tin người dùng
        if (!userId) {
            console.warn("Thiếu thông tin người dùng:", currentUser);
            alert("Thiếu thông tin người dùng.");
            return;
        }

        // Kiểm tra dịch vụ đã chọn
        if (!hasSelectedServices) {
            console.warn("Chưa chọn dịch vụ:", selectedServices, preSelectedService);
            alert("Vui lòng chọn ít nhất một dịch vụ.");
            return;
        }

        // Kiểm tra ngày giờ hẹn
        if (!appointmentDate || !selectedTime) {
            console.warn("Thiếu ngày hoặc giờ:", appointmentDate, selectedTime);
            alert("Vui lòng chọn ngày và giờ hẹn.");
            return;
        }
        
        // Lấy danh sách dịch vụ đã chọn
        const serviceIds = preSelectedService
            ? [preSelectedService.id]
            : selectedServices;

        // Tính tổng tiền
        const totalPrice = preSelectedService
            ? preSelectedService.price
            : services
                .filter((s) => selectedServices.includes(s.id))
                .reduce((sum, s) => sum + s.price, 0);

        // Ghép ngày + giờ thành ISO string
        const appointmentDateTime = `${appointmentDate}T${selectedTime}:00`;

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
            alert("Đặt lịch thành công!\n\nBạn vui lòng vào mục thông tin cá nhân để xem lịch hẹn của bạn nhé!");

            // Reset form nếu không phải lịch preset
            if (!preSelectedService) {
                setSelectedServices([]);
            }
            setNotes("");
            setAppointmentDate("");
            setSelectedTime(null);
        } catch (error: unknown) {
            console.error("Đặt lịch thất bại:", error);
            if (error instanceof Error) {
                alert(error.message || "Đặt lịch thất bại.");
            } else {
                alert("Đặt lịch thất bại.");
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <h2 className="text-3xl font-bold text-center">Đặt Lịch Hẹn Spa</h2>
        
            {/* BƯỚC 1: Thông tin khách hàng đã đăng nhập */}
            <section>
                <h3 className="text-xl font-semibold mb-4">1. Thông tin đặt hẹn</h3>
                {selectedCustomer ? (
                    <div className="flex gap-6 items-center border p-4 rounded-lg shadow-sm">
                        <img
                            src={selectedCustomer.imageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
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
                        </div>
                    </div>
                ) : (
                    <p className="text-red-500">Không tìm thấy thông tin người dùng.</p>
                )}
            </section>
            
            {/* BƯỚC 2: Chọn dịch vụ */}
            <section>
                <h3 className="text-xl font-semibold mb-4">2. Dịch vụ bạn muốn làm</h3>

                {fromHome && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 mb-4">
                        {/* Thanh tìm kiếm */}
                        <div className="flex items-center gap-2 border px-3 py-1 rounded-full bg-white shadow-sm w-full sm:w-[250px]">
                            <span className="text-lg">🔍</span>
                            <input
                                type="text"
                                placeholder="Tìm dịch vụ..."
                                className="outline-none text-sm flex-1 placeholder-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Lọc theo giá */}
                        <select
                            className="border px-3 py-1 rounded-full text-sm bg-white shadow-sm w-full sm:w-auto"
                            value={sortByPrice}
                            onChange={(e) => setSortByPrice(e.target.value)}
                        >
                            <option value="default">Mặc định</option>
                            <option value="asc">Giá thấp → cao</option>
                            <option value="desc">Giá cao → thấp</option>
                        </select>
                    </div>
                )}

                {preSelectedService ? (
                    <div className="border rounded-lg p-3 flex gap-3 items-center bg-blue-100 border-blue-500">
                        <img src={preSelectedService.images?.[0]} alt="" className="w-24 h-24 object-cover rounded" />
                        <div className="flex-1">
                            <p className="font-semibold">{preSelectedService.name}</p>
                            <p className="text-sm text-orange-500">{preSelectedService.price.toLocaleString()} VND</p>
                            <p className="text-sm mt-1">{preSelectedService.description}</p>
                        </div>
                    </div>
                ) : (
                    // <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    //     {services.map((s) => (
                    //         <div
                    //             key={s.id}
                    //             className={`border rounded-lg p-3 flex gap-3 items-center ${
                    //                 selectedServices.includes(s.id) ? "bg-blue-100 border-blue-500" : ""
                    //             }`}
                    //             >
                    //             <img src={s.images?.[0]} alt="" className="w-24 h-24 object-cover rounded" />
                    //             <div className="flex-1">
                    //                 <p className="font-semibold">{s.name}</p>
                    //                 <p className="text-sm text-gray-500">{s.price.toLocaleString()} VND</p>
                    //                 <label className="flex items-center gap-2 mt-2">
                    //                 <input
                    //                     type="checkbox"
                    //                     checked={selectedServices.includes(s.id)}
                    //                     onChange={() => handleToggleService(s.id)}
                    //                 />
                    //                 <span>Chọn dịch vụ</span>
                    //                 </label>
                    //             </div>
                    //         </div>
                    //     ))}
                    // </div>

                    // <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    //     {services
                    //     .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    //     .map((s) => (
                    //         <div
                    //             key={s.id}
                    //             className={`border rounded-lg p-3 flex gap-3 items-center ${
                    //                 selectedServices.includes(s.id) ? "bg-blue-100 border-blue-500" : ""
                    //             }`}
                    //         >
                    //             <img src={s.images?.[0]} alt="" className="w-24 h-24 object-cover rounded" />
                    //             <div className="flex-1">
                    //                 <p className="font-semibold">{s.name}</p>
                    //                 <p className="text-sm text-gray-500">{s.price.toLocaleString()} VND</p>
                    //                 <label className="flex items-center gap-2 mt-2">
                    //                     <input
                    //                         type="checkbox"
                    //                         checked={selectedServices.includes(s.id)}
                    //                         onChange={() => handleToggleService(s.id)}
                    //                     />
                    //                     <span>Chọn dịch vụ</span>
                    //                 </label>
                    //             </div>
                    //         </div>
                    //     ))}
                    // </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {paginatedServices.map((s) => (
                        <div
                            key={s.id}
                            className={`border rounded-lg p-3 flex gap-3 items-center ${
                            selectedServices.includes(s.id) ? "bg-blue-100 border-blue-500" : ""
                            }`}
                        >
                            <img src={s.images?.[0]} alt="" className="w-24 h-24 object-cover rounded" />
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

                {fromHome && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        disabled={currentPage === 1}
                        >
                        ←
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-3 py-1 border rounded ${
                            currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                            }`}
                        >
                            {i + 1}
                        </button>
                        ))}
                        <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        disabled={currentPage === totalPages}
                        >
                        →
                        </button>
                    </div>
                )}
                
            </section>         
    
            {/* BƯỚC 3: Chọn ngày giờ */}
            <section>
                {/* Tiêu đề và chú thích màu */}
                <div className="flex items-center mb-3">
                    <h3 className="text-xl font-semibold">3. Chọn Ngày Giờ</h3>
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
                    <div className="space-y-3">
                        {/* Điều hướng tuần */}
                        <div className="flex justify-between items-center">
                            {dayjs().isBefore(currentWeekStart, "day") && (
                                <button
                                    onClick={handlePrevWeek}
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    ←
                                </button>
                            )}

                            <div className="flex-1 text-center font-semibold text-gray-700">
                                Tuần {currentWeekStart.format("DD/MM")} - {currentWeekStart.add(6, "day").format("DD/MM")}
                            </div>

                            <button
                                onClick={handleNextWeek}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                →
                            </button>
                        </div>

                        {/* Các ngày trong tuần */}
                        <div className="grid grid-cols-7 gap-2 text-center text-sm">
                            {Array.from({ length: 7 }, (_, i) => {
                                const day = currentWeekStart.add(i, "day");
                                const dayStr = day.format("YYYY-MM-DD");

                                return day.isBefore(dayjs(), "day") ? null : (
                                    <button
                                        key={dayStr}
                                        onClick={() => {
                                            setAppointmentDate(dayStr);
                                            setSelectedTime(""); // <-- Reset khi đổi ngày
                                        }}
                                        className={`py-2 px-1 rounded-lg transition-all
                                            ${appointmentDate === dayStr ? "bg-orange-500 text-white" : "bg-gray-100 hover:bg-blue-100"}
                                        `}
                                    >
                                        <div className="font-medium">{day.format("ddd")}</div>
                                        <div>{day.format("DD/MM")}</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Khung giờ */}
                    <div>
                        <label className="block mb-1 font-medium">
                            Khung giờ: <i className="text-gray-500">(Vui lòng chọn ngày hẹn trước)</i>
                        </label>
                        <div className="grid grid-cols-4 gap-2 mt-2 w-full md:w-2/3">
                            {timeSlots.map((slot) => {
                                const isToday = dayjs().format("YYYY-MM-DD") === appointmentDate;
                                const currentTime = dayjs();
                                const slotTime = dayjs(`${appointmentDate} ${slot}`, "YYYY-MM-DD HH:mm");

                                // Nếu đang chọn hôm nay và giờ hẹn đã qua → disable
                                const isPast = isToday && slotTime.isBefore(currentTime);

                                return (
                                    <button
                                        key={slot}
                                        onClick={() => !isPast && appointmentDate && setSelectedTime(slot)}
                                        className={`py-2 px-4 rounded-lg text-sm transition-all
                                            ${selectedTime === slot ? "bg-orange-500 text-white" : "bg-green-100 text-gray-800"}
                                            ${!appointmentDate || isPast ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-100"}
                                        `}
                                        disabled={!appointmentDate || isPast}
                                    >
                                        {slot}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Hiển thị thời gian đã chọn */}
                    {appointmentDate && selectedTime && (
                        <div className="mt-4 text-center text-sm text-gray-700">
                            Đã chọn:{" "}
                            <strong>
                                {dayjs(appointmentDate).format("dddd").replace(/^\w/, c => c.toUpperCase())} - {dayjs(appointmentDate).format("DD/MM/YYYY")} - {selectedTime}
                            </strong>
                        </div>
                    )}

                </div>
            </section>

            {/* BƯỚC 4: Ghi chú & Xác nhận */}
            <section>
                <h3 className="text-xl font-semibold mb-4">4. Ghi chú (Không bắt buộc)</h3>
                <textarea
                    className="w-full border rounded p-3"
                    placeholder="Ghi chú thêm (Không bắt buộc)"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                
                {/* Tổng tiền */}
                <div className="text-right mt-4 text-lg font-bold">
                    Tổng tiền:{" "}
                    <span className="text-orange-500">
                        {(preSelectedService
                        ? preSelectedService.price
                        : services
                            .filter((s) => selectedServices.includes(s.id))
                            .reduce((sum, s) => sum + s.price, 0)
                        ).toLocaleString("vi-VN")} VND
                    </span>
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