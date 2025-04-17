// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../hook/AuthContext";
// import { Container, Card, CardContent, Typography, Button, Box } from "@mui/material";
// import { Spa, Star, Phone, LocationOn } from "@mui/icons-material";
// import { motion } from "framer-motion";


import { useState, useEffect } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Pagination, Container, Box, Typography, Divider, IconButton, Slider  } from "@mui/material";
import { getServiceSPA, deleteServiceSPA, activateServiceSPA, deactivateServiceSPA } from "../../service/apiService";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { AlarmClock, Ban, ShieldCheck, Trash2, CircleDollarSign, X } from "lucide-react";
import { motion } from 'framer-motion'
import { ServiceFull, Category } from "../../interface/ServiceSPA_interface";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const pageSize = 8;

const DichVu: React.FC = () => {
    const [services, setServices] = useState<ServiceFull[]>([]);
    const [currentPage, setCurrentPage] = useState(1); //State currenPage
    const [open, setOpen] = useState(false); // State để kiểm soát việc hiển thị Dialog
    const [selectedService, setSelectedService] = useState<ServiceFull | null>(null); // State để lưu thông tin dịch vụ được chọn
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [activeSort, setActiveSort] = useState('option:noibat');
    const navigate = useNavigate();
    const [mainImage, setMainImage] = useState<string | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    // Fetch categories khi load trang
    useEffect(() => {
        axios.get("/api/categories")
        .then(res => setCategories(res.data))
        .catch(err => console.error("Lỗi khi load categories", err));
    }, []);

    useEffect(() => {
        if (selectedCategoryId !== null) {
          axios.get("/api/service-spa") // Gọi tất cả services
            .then(res => {
              const allServices: ServiceFull[] = res.data;
              const filtered = allServices.filter(service => service.categoryId === selectedCategoryId);
              setServices(filtered);
            })
            .catch(err => 
            console.error("Lỗi khi load services", err));
        }
    }, [selectedCategoryId]);

    const getServiceTypesByCategory = (categoryId: number): string[] => {
        const filteredServices = services.filter(s => s.categoryId === categoryId);
        const types = [...new Set(filteredServices.map(s => s.serviceType))]; // loại bỏ trùng lặp
        return types;
    };
      
    const sortOptions = [
        { value: 'noibat', label: 'Nổi bật' },
        { value: 'moinhat', label: 'Mới nhất' },
        { value: 'banchay', label: 'Bán chạy' },
        { value: 'giamgia', label: 'Giảm giá' },
        { value: 'giathapdencao', label: 'Giá thấp đến cao' },
        { value: 'giacaodenthap', label: 'Giá cao đến thấp' },
    ];

    const [sortType, setSortType] = useState("noibat");

    useEffect(() => {
        let filtered = [...allServices];
    
        // Lọc theo danh mục nếu có
        if  (selectedCategoryId) {
            filtered = filtered.filter(service => service.categoryId === selectedCategoryId);
        }
    
        // Lọc theo khoảng giá nếu đã lọc
        if  (isFilteredByPrice) {
            const [minPrice, maxPrice] = priceRange;
            filtered = filtered.filter(service =>
                Number(service.price) >= minPrice && Number(service.price) <= maxPrice
            );
        }
    
        //  Sắp xếp theo sortType (trừ "nổi bật")
        if  (sortType !== 'noibat') {
            filtered.sort((a: any, b: any) => {
                switch (sortType) {
                    case 'giathapdencao':
                        return a.price - b.price;
                    case 'giacaodenthap':
                        return b.price - a.price;
                    case 'moinhat':
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    default:
                        return 0; // không sắp xếp gì
                }
            });
        }
    
        setServices(filtered); // Cập nhật dịch vụ sau khi lọc và sắp xếp
        setCurrentPage(1); // Quay lại trang đầu tiên
    
    }, [sortType, selectedCategoryId ]);     

    // Yêu cầu đăng nhập để được đặt lịch    
    const handleBookingClick = (service: unknown) => {
        const user = localStorage.getItem("user");
    
        if (!user) {
            alert("Vui lòng đăng nhập để đặt lịch.");
            navigate("/login");
            return;
        }
        const selectedService = service;
    
        navigate("/booking", { state: { selectedService } });
    };

    // Xem lịch đã đặt hẹn của người dùng
    const handleViewBookingsClick = () => {
        const user = localStorage.getItem("user");

        if (!user) {
            alert("Vui lòng đăng nhập để xem lịch hẹn.");
            navigate("/login");
            return;
        }

        navigate("/listbooking"); 
    };

    const [allServices, setAllServices] = useState<ServiceFull[]>([]);

    // State để lưu khoảng giá
    const DEFAULT_PRICE_RANGE = [50000, 1000000];
    const [priceRange, setPriceRange] = useState<number[]>(DEFAULT_PRICE_RANGE);
    useEffect(() => {
        setPriceRange(DEFAULT_PRICE_RANGE);
    }, [selectedCategoryId]);

    const [isFilteredByPrice, setIsFilteredByPrice] = useState(false);

    const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);

    const filteredServices = services.filter((service) => {
        return (
          service.categoryId === selectedCategoryId &&
          (!selectedServiceType || service.serviceType === selectedServiceType)
        );
    });

    // Khi chọn loại dịch vụ
    const handleSelectServiceType = (type: string) => {
        // Nếu nhấn lại cái đang chọn → bỏ chọn
        if (type === selectedServiceType) {
          setSelectedServiceType("");
        } else {
          setSelectedServiceType(type === "ALL" ? "" : type);
        }
    };
      
    // Hàm xử lý khi click nút áp dụng khoảng giá
    const handleApplyPrice = () => {
        const [minPrice, maxPrice] = priceRange;
        console.log("Áp dụng khoảng giá:", minPrice, "-", maxPrice);
    
        let filtered = allServices.filter(service => service.categoryId === selectedCategoryId);
    
        filtered = filtered.filter(service =>
            Number(service.price) >= minPrice && Number(service.price) <= maxPrice
        );
    
        console.log("Filtered services:", filtered);
    
        setServices(filtered);
        setCurrentPage(1);
        setIsFilteredByPrice(true);
    };
    
    useEffect(() => {
        fetchServices();
    }, []);

    // Tải danh sách dịch vụ
    const fetchServices = async () => {
        try {
            const response = await getServiceSPA(); // Thay bằng API thực tế
            setServices(response);         // Hiển thị ban đầu
            setAllServices(response);      // Ghi vào bộ lọc gốc
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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-6">
            <ToastContainer />
            <Container sx={{ mb: 3 }}>
                <img
                src="https://media.hcdn.vn/catalog/category/1320x250-1.jpg"
                alt="Banner Hasaki"
                style={{ width: "100%", borderRadius: 12, objectFit: "cover" }}
                />
            </Container>

            {/* Tiêu đề canh giữa */}
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Dịch vụ Spa</h2>

            {/* Thanh tìm kiếm & lọc */}
            <div className="flex flex-col items-center gap-4 mb-10">
                <div className="flex flex-wrap gap-4 justify-center max-w-xl w-full">
                    <div className="flex items-center gap-2 border px-4 py-2 rounded-full min-w-[300px]">
                        <span className="text-lg">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm dịch vụ..."
                            className="outline-none text-[16px] flex-1"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="border px-4 py-2 rounded-full min-w-[180px] text-[16px]"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}>
                            
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVATE">Hoạt động</option>
                        <option value="DEACTIVATED">Không hoạt động</option>
                    </select>
                </div>
            </div>

            <Container maxWidth={false} disableGutters sx={{ maxWidth: "1500px", mx: "auto", px: 2 }}>
                <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
                    <Box width={{ md: "20%" }}>
                        <Box sx={{ backgroundColor: "#fff", borderRadius: 2 }}>
                            <Typography
                                fontSize={20}
                                onClick={() => {
                                    setSelectedCategoryId(null);
                                    setIsFilteredByPrice(false);
                                    setPriceRange(DEFAULT_PRICE_RANGE);
                                    setServices(allServices); // hiện tất cả dịch vụ
                                }}
                                sx={{
                                    cursor: "pointer",
                                    color: selectedCategoryId === null ? "primary.main" : "text.primary",
                                    fontWeight: selectedCategoryId === null ? 600 : 400,
                                    mb: 0.5,
                                }}>
                                Danh mục Spa
                            </Typography>

                            {/* Danh sách danh mục */}
                            {categories.map((category) => (
                                <Typography
                                    key={category.categoryId}
                                    fontSize={18}
                                    onClick={() => setSelectedCategoryId(category.categoryId)}
                                    sx={{
                                    cursor: "pointer",
                                    color: selectedCategoryId === category.categoryId ? "primary.main" : "text.primary",
                                    fontWeight: selectedCategoryId === category.categoryId ? 600 : 400,
                                    mb: 0.5,
                                    }}
                                >
                                    {category.categoryName}
                                </Typography>
                            ))}

                            <Divider sx={{ my: 2 }} />

                            {selectedCategoryId && (
                                <>
                                    <Typography fontWeight={700} mb={1}>KHOẢNG GIÁ</Typography>
                                    <Slider
                                    value={priceRange}
                                    onChange={(e, newValue) => setPriceRange(newValue as number[])}
                                    valueLabelDisplay="auto"
                                    min={50000}
                                    max={1000000}
                                    step={10000}
                                    />

                                    <Typography variant="body2" mt={1}>
                                    {priceRange[0].toLocaleString('vi-VN')} VND - {priceRange[1].toLocaleString('vi-VN')} VND
                                    </Typography>

                                    <Button
                                    variant="contained"
                                    color="warning"
                                    size="small"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={handleApplyPrice}>
                                    Áp dụng
                                    </Button>
                                </>
                            )}


                            <Divider sx={{ my: 2 }} />

                            <Box mb={2}>
                                <img
                                    src="anh-spa.jpg"
                                    alt="Quảng cáo 1"
                                    style={{ width: "100%", borderRadius: 8 }}
                                />
                                <Typography variant="body2" mt={1} color="text.secondary">
                                    Ưu đãi siêu hot tại Spa - Không thể bỏ lỡ!
                                </Typography>
                                </Box>

                                <Box mb={2}>
                                <img
                                    src="anh-spa-6.jpg"
                                    alt="Quảng cáo 2"
                                    style={{ width: "100%", borderRadius: 8 }}
                                />
                                <Typography variant="body2" mt={1} color="text.secondary">
                                    Trải nghiệm dịch vụ thư giãn đỉnh cao hôm nay.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box flex={1}>
                        <Typography fontWeight={700} fontSize={20} display="flex" alignItems="center" gap={1}>
                            Dịch vụ Spa
                            <Typography component="span" fontWeight={400} color="gray">
                                ({services.length} dịch vụ)
                            </Typography>
                        </Typography>

                        {selectedCategoryId && (
                            <Box
                                mb={2}
                                display="flex"
                                alignItems="center"
                                gap={1}
                                flexWrap="wrap"
                                px={2}
                                py={1}
                                borderRadius={2}
                                sx={{ backgroundColor: '#f3f4f6' }}
                            >
                                <Typography fontSize={16} fontWeight={500}>
                                Các loại dịch vụ:
                                </Typography>

                                {/* Nút "Tất cả" */}
                                <Box px={1.5} py={0.5}
                                    onClick={() => handleSelectServiceType("ALL")}
                                    sx={{
                                        backgroundColor: !selectedServiceType || selectedServiceType === 'ALL' ? '#059669' : '#e5e7eb',
                                        cursor: 'pointer',
                                        color: !selectedServiceType || selectedServiceType === 'ALL' ? '#fff' : '#111827',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        '&:hover': {
                                        backgroundColor: !selectedServiceType || selectedServiceType === 'ALL' ? '#047857' : '#d1d5db',
                                        },
                                    }}>
                                    Tất cả
                                </Box>


                                {/* Các tag serviceType */}
                                {getServiceTypesByCategory(selectedCategoryId).map((type, index) => (
                                <Box
                                    key={index}
                                    px={1.5}
                                    py={0.5}
                                    onClick={() => handleSelectServiceType(type)}
                                    sx={{
                                    backgroundColor: selectedServiceType === type ? '#059669' : '#e5e7eb', // xám nhạt mặc định
                                    cursor: 'pointer',
                                    color: selectedServiceType === type ? '#fff' : '#111827', // đen khi chưa chọn, trắng khi chọn
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    '&:hover': {
                                        backgroundColor: selectedServiceType === type ? '#047857' : '#d1d5db',
                                    },
                                    }}
                                >
                                    {type}
                                </Box>
                                ))}
                            </Box>
                        )}


                        {/* 👉 Phần lọc giá riêng */}
                        {isFilteredByPrice && (
                            <Box mb={2} display="flex" alignItems="center" gap={1} flexWrap="wrap" px={2} py={1} borderRadius={2}
                                sx={{ backgroundColor: '#f3f4f6' }}>
                                <Typography fontSize={14} fontWeight={500}>
                                    Sản phẩm lọc theo:
                                </Typography>
                                <Box
                                    px={1.5}
                                    py={0.5}
                                    sx={{
                                    backgroundColor: '#10B981',
                                    color: '#fff',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    }}
                                >
                                Giá: {priceRange[0].toLocaleString('vi-VN')} - {priceRange[1].toLocaleString('vi-VN')}
                            </Box>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                        const filteredByCategory = allServices.filter(
                                            service => service.categoryId === selectedCategoryId
                                        );
                                        setServices(filteredByCategory);
                                        setIsFilteredByPrice(false);
                                    }}
                                    
                                    sx={{ ml: 1, textTransform: 'none' }}
                                >
                                    Xóa bộ lọc
                                </Button>
                            </Box>
                        )}

                        <Box mb={2} display="flex" alignItems="center" gap={2} flexWrap="wrap"px={2} py={1} borderRadius={2}
                            sx={{ backgroundColor: '#f3f4f6' }}>
                            <Typography fontWeight={600}>Sắp xếp theo:</Typography>

                            {sortOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={activeSort === `option:${option.value}` ? 'contained' : 'outlined'}
                                    size="small"
                                    color={activeSort === `option:${option.value}` ? 'success' : 'inherit'}
                                    onClick={() => {
                                    setSortType(option.value);
                                    setActiveSort(`option:${option.value}`);
                                    }}
                                    sx={{ textTransform: 'none', borderRadius: 2, px: 2 }}
                                >
                                    {option.label}
                                </Button>
                            ))}

                            <Box flexGrow={1} />
                        </Box>

                        {/* 👉 Hiển thị danh sách dịch vụ hoặc thông báo khi không có */}
                        {/* {paginatedServices.length === 0 ? ( */}
                        {(filteredServices.length === 0 ? paginatedServices : filteredServices).length === 0 ? (
                            <Box textAlign="center" mt={6}>
                                <Typography fontSize={64}>🙁</Typography>
                                <Typography mt={2} color="text.secondary" fontSize={14}>
                                    Không có sản phẩm nào phù hợp với điều kiện lọc của bạn.<br />
                                    Bạn thử tắt điều kiện lọc và tìm lại nhé!
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    sx={{ mt: 2 }}
                                    onClick={() => {
                                        const filteredByCategory = allServices.filter(
                                            service => service.categoryId === selectedCategoryId
                                        );
                                        setServices(filteredByCategory);
                                        setIsFilteredByPrice(false);
                                    }}
                                >
                                    Xóa bộ lọc
                                </Button>
                            </Box>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                                {/* {paginatedServices.map((service) => ( */}
                                {(filteredServices.length === 0 ? paginatedServices : filteredServices).map((service) => (
                                    <div key={service.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow flex flex-col cursor-default">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleOpenDialog(service)}
                                            className="group cursor-pointer hover:shadow-lg transition-shadow">

                                            {/* Tên dịch vụ */}
                                            <h3 className="text-lg font-bold text-gray-900 p-4 group-hover:text-green-700 transition-colors duration-200">
                                                {service.name}
                                            </h3>

                                            {/* Hình ảnh */}
                                            <img
                                                src={service.images[0] || "https://media.hcdn.vn/catalog/category/1320x250-1.jpg"}
                                                alt={service.name}
                                                className="w-full h-40 object-cover"
                                            />
                                                
                                            {/* Giá + Thời gian */}
                                            <div className="p-4 flex flex-col gap-2">
                                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                                    <CircleDollarSign className="w-4 h-4 text-gray-700" />
                                                    <span className="text-orange-500">{service.price.toLocaleString("vi-VN")} VND</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                                    <AlarmClock className="w-4 h-4" />
                                                    {service.duration} phút
                                                </div>
                                            </div>

                                            <Typography fontSize={14}>{service.categoryId}</Typography>

                                            <Typography fontSize={14}>{service.serviceType}</Typography>
                                        </motion.div>

                                        {/* Dấu gạch ngăn cách */}
                                        <hr className="my-2 border-gray-200" />

                                        <div className="px-4 pb-4 flex flex-col gap-2 flex-grow">
                                            {/* Mô tả */}
                                            <p className="text-sm text-gray-600 line-clamp-3 h-[72px]">{service.description}
                                                <span className="text-xs text-blue-500 hover:underline cursor-pointer ml-1"
                                                    onClick={() => handleOpenDialog(service)}>
                                                    xem thêm
                                                </span>
                                            </p>

                                            {/* Trạng thái */}
                                            <p className={`text-center rounded-full text-sm py-1 mt-1 font-medium ${
                                                service.status === 'ACTIVATE'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                <span className="inline-block w-2 h-2 rounded-full mr-2 animate-ping"
                                                    style={{ backgroundColor: service.status === 'ACTIVATE' ? '#10B981' : '#EF4444',}}>
                                                </span>
                                                {service.status === 'ACTIVATE' ? 'Đã kích hoạt' : 'Ngừng kích hoạt'}
                                            </p>

                                            {/* Hành động */}
                                            <div className="flex justify-center gap-4 mt-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    title="Xóa dịch vụ"
                                                    className="text-red-400 bg-red-100 w-10 h-10 rounded-full hover:bg-red-500 hover:text-white flex items-center justify-center"
                                                    onClick={() => handleDeleteService(service.id)}>
                                                    <Trash2 />
                                                </motion.button>

                                                {service.status === 'ACTIVATE' ? (
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        title="Ngừng kích hoạt dịch vụ"
                                                        className="text-orange-500 bg-orange-100 w-10 h-10 rounded-full hover:bg-orange-500 hover:text-white flex items-center justify-center"
                                                        onClick={() => handleDeactivateService(service.id, service.name)}>
                                                        <Ban />
                                                    </motion.button>
                                                ) : (
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        title="Kích hoạt dịch vụ"
                                                        className="text-blue-600 bg-blue-100 w-10 h-10 rounded-full hover:bg-blue-600 hover:text-white flex items-center justify-center"
                                                        onClick={() => handleActivateService(service.id, service.name)}>
                                                        <ShieldCheck />
                                                    </motion.button>
                                                )}
                                            </div>

                                            {/* Đặt hẹn */}
                                            <div className="mt-4 space-y-2">
                                                <button
                                                    className="w-full bg-orange-400 text-white py-2 rounded-lg font-semibold"
                                                    // onClick={() => navigate("/booking", { state: { selectedService: service } })}
                                                    onClick={() => handleBookingClick(service)}
                                                >
                                                    Đặt hẹn
                                                </button>
                                            </div>

                                            <div className="mt-4 space-y-2">
                                                <button className="w-full bg-red-400 text-white py-2 rounded-lg font-semibold"
                                                        // onClick={() => navigate("/listbooking")}
                                                        onClick={handleViewBookingsClick}
                                                        >
                                                    Xem lịch đã Đặt hẹn
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        )}

                        {/* Phân trang */}
                        <div className="flex justify-center mt-6">
                            <Pagination
                                count={Math.ceil(services.length / pageSize)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </div>
                    </Box>
                </Box>
            </Container>

            {/* Dialog xem chi tiết */}
            <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth >
                {selectedService && (
                    <>
                        <DialogTitle sx={{ fontSize: '30px', position: 'relative', pr: 6 }}>
                            {selectedService.name}
                            <IconButton
                                onClick={handleCloseDialog}
                                sx={{ position: 'absolute', right: 8, top: 8, color: 'gray', '&:hover': { color: 'red' }, }}>
                                <X className="w-5 h-5" />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent>
                            {/* Hình ảnh chính */}
                            <div className="rounded-lg overflow-hidden shadow mb-6">
                                <img
                                    src={mainImage || selectedService.images[0] || "https://media.hcdn.vn/catalog/category/1320x250-1.jpg"}
                                    alt={selectedService.name}
                                    className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            
                            {/* Bộ ảnh nhỏ */}
                            <div className="flex gap-3 overflow-x-auto mb-6 scrollbar-thin scrollbar-thumb-gray-300">
                                {selectedService.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image || "https://via.placeholder.com/300"}
                                        alt={`Image ${index + 1}`}
                                        onClick={() => setMainImage(image)} // 👈 khi click vào thì gán ảnh chính
                                        className={`w-36 h-24 object-cover rounded-md shadow-sm border cursor-pointer 
                                            ${mainImage === image ? "ring-2 ring-orange-500" : "border-gray-200"} 
                                            hover:opacity-90 transition`}
                                    />
                                ))}
                            </div>

                            <p className="text-gray-700 mb-4 leading-relaxed">
                                <strong className="text-gray-900">Mô tả:</strong> {selectedService.description}
                            </p>

                            <p className="text-gray-600 mb-2">Giá: <span className="text-orange-500 font-semibold">{selectedService.price.toLocaleString("vi-VN")} VND</span></p>

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

                        {/* Đặt hẹn & Chi tiết */}
                        <div className="flex justify-end px-6 pb-6 pt-2 border-t">
                            <button className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white 
                                                px-8 py-2 rounded-full text-lg font-medium shadow-md transition duration-300"
                                    // onClick={() => navigate("/booking", { state: { selectedService: selectedService } })}
                                    onClick={() => handleBookingClick(selectedService)}
                                    >
                                Đặt hẹn ngay
                            </button>
                        </div>
                    </>
                )}
            </Dialog>
        </motion.div>
    );
}

export default DichVu;