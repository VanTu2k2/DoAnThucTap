import { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Pagination } from "@mui/material";
import { getServiceSPA, deleteServiceSPA, activateServiceSPA, deactivateServiceSPA } from "../../service/apiService";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { AlarmClock, Ban, ShieldCheck, Trash2 } from "lucide-react";
import { motion } from 'framer-motion'
import { ServiceFull } from "../../interface/ServiceSPA_interface";




const pageSize = 6;

const ServiceList: React.FC = () => {
    const [services, setServices] = useState<ServiceFull[]>([]);
    const [currentPage, setCurrentPage] = useState(1); //State currenPage
    const [open, setOpen] = useState(false); // State để kiểm soát việc hiển thị Dialog
    const [selectedService, setSelectedService] = useState<ServiceFull | null>(null); // State để lưu thông tin dịch vụ được chọn
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchServices();
    }, []);


    // Tải danh sách dịch vụ
    const fetchServices = async () => {
        try {
            const response = await getServiceSPA(); // Thay thế bằng API thực tế
            setServices(response);
        } catch (error) {
            console.error("Lỗi tải danh sách dịch vụ:", error);
        }
    };

    const filteredSer = services.filter((ser) => {
        return ser.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === "" || ser.status === statusFilter);
    })


    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };


    // Render danh sách dịch vụ theo Page
    const paginatedServices = filteredSer.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    // Hiển thị Dialog
    const handleOpenDialog = (service: ServiceFull) => {
        setSelectedService(service);
        setOpen(true);
    };

    // Đóng Dialog
    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedService(null); // Reset thông tin dịch vụ
    };

    //Delete service
    const handleDeleteService = async (serviceId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) return;
        try {
            await deleteServiceSPA(serviceId);
            toast.success('Xóa dịch vụ thành công.')
            fetchServices();
        } catch (error) {
            console.error("Lỗi xóa dịch vụ:", error);
            toast.error("Xóa dịch vụ thất bại!");
        }
    };

    // Activate service
    const handleActivateService = async (serviceId: number, name: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn kích hoạt dịch vụ này không?")) return;
        try {
            await activateServiceSPA(serviceId);
            toast.success(`Kích hoạt dịch vụ ${name} thành công.`)
            fetchServices();
        } catch (error) {
            console.error(`Lỗi kích hoạt dịch vụ ${name}:`, error);
            toast.error("Ngừng kích hoạt thất bại!");
        }
    };

    // Deactivate service
    const handleDeactivateService = async (serviceId: number, name: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn ngừng kích hoạt dịch vụ này không?")) return;
        try {
            await deactivateServiceSPA(serviceId);
            toast.success(`Ngừng kích hoạt dịch vụ ${name} thành công.`)
            fetchServices();
        } catch (error) {
            console.error(`Lỗi ngừng kích hoạt dịch vụ ${name}:`, error);
            toast.error("Ngừng kích hoạt thất bại!");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="p-6">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Dịch vụ Spa</h2>
            <div className="flex gap-4 mb-10">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    className="border p-4 rounded-full w-full text-[18px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="border p-4 rounded-full"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="ACTIVATE">Hoạt động</option>
                    <option value="DEACTIVATED">Không hoạt động</option>
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {paginatedServices.map((service) => (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        key={service.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                        <img
                            src={service.images[0] || "https://via.placeholder.com/300"}
                            alt={service.name}
                            className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{service.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                            <div className="mt-2 flex justify-between text-sm text-gray-500">
                                <span>Giá: {service.price} VND</span>
                                <span className="flex items-center gap-2"><AlarmClock /> {service.duration} phút</span>
                            </div>
                            <p className={`text-center rounded-full text-sm p-2 m-2 font-bold ${service.status === 'ACTIVATE' ? "bg-green-200 text-green-600" : "bg-orange-200 text-orange-600"}`}>
                                <span className="animate-ping" style={{
                                    width: "8px",
                                    marginRight: "10px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    display: "inline-block",
                                    backgroundColor: service.status === "ACTIVATE" ? "#10B981" : "#EF4444",
                                }}></span>
                                {service.status === "ACTIVATE" ? "Đã kích hoạt" : "Ngừng kích hoạt"}</p>
                            <div className="flex mt-6 gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    title="Xóa dịch vụ"
                                    className="flex items-center justify-center text-red-400 bg-red-100 w-[40px] h-[40px] rounded-full hover:bg-red-500 
                                    hover:text-white"
                                    onClick={() => handleDeleteService(service.id)}
                                >
                                    <Trash2 />
                                </motion.button>
                                {service.status === "ACTIVATE" ? (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        title="Ngừng kích hoạt dịch vụ"
                                        className="flex items-center justify-center text-red-600 w-[40px] h-[40px] bg-orange-100 rounded-full
                                        hover:bg-orange-500 hover:text-white"
                                        onClick={() => handleDeactivateService(service.id, service.name)}
                                    >
                                        <Ban />
                                    </motion.button>

                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        title="Kích hoạt dịch vụ"
                                        className="flex items-center justify-center text-blue-600 w-[40px] h-[40px] bg-blue-100 rounded-full
                                        hover:bg-blue-600 hover:text-white"
                                        onClick={() => handleActivateService(service.id, service.name)}
                                    >
                                        <ShieldCheck />
                                    </motion.button>
                                )}


                            </div>
                            <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" onClick={() => handleOpenDialog(service)}>
                                Xem chi tiết
                            </button>

                        </div>
                    </motion.div>
                ))
                }


            </div>
            {/* Phân trang */}
            {/* {services.length > pageSize && ( */}
                <div className="flex justify-center mt-6">
                    <Pagination
                        count={Math.ceil(services.length / pageSize)}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </div>
            {/* )} */}

            {/* Dialog xem chi tiết */}
            <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth >
                {selectedService && (
                    <>
                        <DialogTitle sx={{
                            fontSize: '30px',
                        }}>{selectedService.name}</DialogTitle>
                        <DialogContent>
                            <img
                                src={selectedService.images[0] || "https://via.placeholder.com/300"}
                                alt={selectedService.name}
                                className="w-full h-60 object-cover mb-4 rounded-md"
                            />


                            <div className="flex w-full max-w-full overflow-x-scroll gap-2">

                                {selectedService.images.length > 0 && selectedService.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image || "https://via.placeholder.com/300"}
                                        alt={`Service Image ${index + 1}`}
                                        className="w-full h-52 object-cover mb-4 rounded-md"
                                    />
                                ))}
                            </div>

                            <p className="text-gray-700 mb-4">Mô tả: {selectedService.description}</p>
                            <p className="text-gray-600">Giá: {selectedService.price} VND</p>
                            <p className="text-gray-600">Thời gian: {selectedService.duration} phút</p>
                            <h4 className="text-lg font-semibold mt-4 mb-2">Các bước thực hiện:</h4>
                            <ul>
                                {selectedService.steps.map((step) => (
                                    <li key={step.stepId} className="mb-2">
                                        {step.stepOrder}. {step.description}
                                    </li>
                                ))}
                            </ul>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                                Đóng
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </motion.div>
    );
}

export default ServiceList;