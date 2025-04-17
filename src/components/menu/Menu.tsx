import { useState, useEffect, useRef } from "react";
import { AccountCircleOutlined, LogoutOutlined, NotificationsActiveOutlined, SettingsOutlined, Visibility, VisibilityOff, Person, Lock, LockOpen, Search, ShoppingCart, Home, AutoAwesome, SelfImprovement, Spa, People, Article, ContactMail, EventNoteOutlined, ChatBubbleOutlineOutlined, ArrowUpwardOutlined, KeyboardArrowDown, Close, ShoppingBag, Schedule } from "@mui/icons-material";
import { Avatar, Badge, IconButton, Box} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hook/AuthContext";
import { loginUser, logout } from "../../service/apiService";
import { motion, AnimatePresence } from "framer-motion";
import NoiDung from "../menu/NoiDung";
import DanhSachKH from "../../page/customer-KhachHang/Danh_sach_KH";
import Footer from "../footer/Footer";
import GioiThieu from "../menu/GioiThieu";
import DichVu from "../menu/DichVu";
import TinTuc from "../menu/TinTuc";
import LienHe from "../menu/LienHe";
import Chatbot from "../google/Chatbot";
import TrangChu from "../home/TrangChu";

import AppointmentList from "../../page/appointment-LichHen/XemLichDatHen";

const Menu: React.FC = () => {
    const location = useLocation(); // Lấy đường dẫn hiện tại
    const navigation = useNavigate();
    const isActive = (path: string) => location.pathname === path;  // Kiểm tra mục đang chọn
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { login, user, logoutContext } = useAuth();
    
    // State for login form
    const [formData, setFormData] = useState({ email: "", password: "" });

    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState({ email: false, password: false });

    const [showChat, setShowChat] = useState(false);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const toggleLoginForm = () => setIsLoginOpen(prev => !prev);

    const handleNavigation = (path: string) => navigation(path);

    const [activePage, setActivePage] = useState("home");

    const [hoveredMenu, setHoveredMenu] = useState(null);
    let timeoutId = null;

    const handleMouseEnter = (id) => {
        clearTimeout(timeoutId); // Xóa timeout để submenu không bị ẩn ngay lập tức
        setHoveredMenu(id);
    };

    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => setHoveredMenu(null), 300); // Delay 300ms trước khi ẩn submenu
    }; 
    
    // Danh sách menu
    const menuItems = [
        { id: "home", label: "Trang chủ", path: "/trangchu" },
        { id: "about", label: "Giới thiệu", path: "/gioithieu" },
        { id: "services", label: "Dịch vụ", path: "/dichvu",},
        { id: "product", label: "Sản phẩm", path: "/sanpham" },
        // { id: "schedule", label: "Lịch hẹn", path: "/lichhen" },
        { id: "news", label: "Tin tức", path: "/tintuc" },
        { id: "contact", label: "Liên hệ", path: "/lienhe" }
    ];
    

    const iconMap = {
        home: <Home fontSize="medium" className="text-green-500 relative mb-1" />, 
        about: <AutoAwesome fontSize="medium" className="text-green-500 relative mb-1" />,
        services: <Spa fontSize="medium" className="text-green-500 relative mb-1" />, 
        // schedule: <Schedule fontSize="medium" className="text-green-500 relative mb-1" />, 
        product: <ShoppingBag fontSize="medium" className="text-green-500 relative mb-1" />, 
        news: <Article fontSize="medium" className="text-green-500 relative mb-1" />, 
        contact: <ContactMail fontSize="medium" className="text-green-500 relative mb-1" />
    };

    // Xử lý chọn menu (Cập nhật state và URL mà không tải lại trang)
    const handleMenuClick = (id: string, path: string) => {
        setActivePage(id);
        if (id === "home") {
            window.history.pushState({}, "", "/"); // Trang chủ không có "/trangchu"
        } else {
            window.history.pushState({}, "", path); // Cập nhật URL mà không reload. Các trang khác có "/gioithieu", "/dichvu"...
        }
        window.scrollTo(0, 0); // Cuộn về đầu trang
    };
    
    // Khi tải trang, kiểm tra URL để đặt trang phù hợp
    useEffect(() => {
        const foundItem = menuItems.find(item => item.path === location.pathname);
        if (foundItem) {
            setActivePage(foundItem.id);
        }
    }, [location.pathname]); // Chạy lại khi đường dẫn thay đổi

    useEffect(() => {
        const currentPath = window.location.pathname; // Đọc URL hiện tại
        const foundItem = menuItems.find(item => item.path === currentPath);
        if (foundItem) {
            setActivePage(foundItem.id);
        }
    }, []);

    // Xử lý sự kiện "Back" hoặc "Forward"
    useEffect(() => {
        const handlePopState = () => {
            const currentPath = window.location.pathname;
            const foundItem = menuItems.find(item => item.path === currentPath);
            if (foundItem) {
                setActivePage(foundItem.id);
            } else {
                setActivePage("home"); // Nếu không tìm thấy, mặc định về Trang chủ
            }
        };
    
        // Lắng nghe sự kiện "Back" hoặc "Forward"
        window.addEventListener("popstate", handlePopState);
    
        // Gọi ngay khi component mount để đảm bảo state đúng khi load trang
        handlePopState();
    
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);    

    // Hiển thị thanh border khi cuộn lên xuống
    const [isScrolled, setIsScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            logoutContext();
            setIsMenuOpen(false);
        } catch (error: any) {
            console.log("Error:", error.response?.data?.message || error.message);
        }
    };

    const searchRef = useRef(null);
    const [showShop, setShowShop] = useState(false);
    
    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                login(JSON.parse(storedUser));  // Khôi phục user từ localStorage
            }
        }
    }, [user, login]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFocus = (field: "email" | "password") => {
        setFocused(prev => ({ ...prev, [field]: true }));
    };
    
    const handleBlur = (field: "email" | "password") => {
        setFocused(prev => ({ ...prev, [field]: formData[field] !== "" }));
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); // Hiện trạng thái đang tải
        try {
            const response = await loginUser(formData);
            login(response.data.user);
            setMessage(""); // Xóa thông báo lỗi nếu đăng nhập thành công

            // Reset form và trạng thái focus
            setFormData({ email: "", password: "" });
            setFocused({ email: false, password: false }); // Reset trạng thái focus
            setIsLoginOpen(false); // Đóng form đăng nhập

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            if (errorMessage.includes("Invalid email or password")) {
                setMessage("Email hoặc mật khẩu không đúng!");
            } else {
                setMessage(`Đăng nhập thất bại: ${errorMessage}`);
            }
        } finally {
            setIsLoading(false); // Tắt trạng thái đang tải
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Icon chat */}
            {/* <div className="fixed bottom-6 right-[65px] z-50">
                <div className="relative">
                    <button
                        className="p-5 bg-blue-600 text-white rounded-full shadow-lg transition-all hover:bg-blue-700 hover:scale-110"
                        title={showChat ? "Đóng Chat" : "Mở Chat"}
                        onClick={() => setShowChat((prev) => !prev)}
                    >
                        {showChat ? (
                            <Close className="w-8 h-8" />
                        ) : (
                            <ChatBubbleOutlineOutlined className="w-8 h-8" />
                        )}
                    </button>

                    <AnimatePresence>
                        {showChat && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="absolute bottom-[70px] right-0 w-[800px] h-[700px] bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden"
                            >
                                <Chatbot />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div> */}

            {/* Nút icon chat */}
            {!showChat && (
                <div className="fixed bottom-6 right-[65px] z-50">
                    <button
                        className="p-5 bg-blue-600 text-white rounded-full shadow-lg transition-all hover:bg-blue-700 hover:scale-110"
                        title="Mở Chat"
                        onClick={() => setShowChat(true)}
                    >
                        <ChatBubbleOutlineOutlined className="w-8 h-8" />
                    </button>
                </div>
            )}

            {/* Popup bảng chat */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed bottom-0 right-16 w-[800px] h-[700px] bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden z-50"
                    >
                        {/* Nút đóng */}
                        <button
                            className="absolute top-3 right-3 text-white hover:text-red-500 z-10"
                            title="Đóng Chat"
                            onClick={() => setShowChat(false)}
                        >
                            <Close className="w-6 h-6" />
                        </button>

                        {/* Nội dung chatbot */}
                        <Chatbot />
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Nút mũi tên lên đầu trang */}
            {isScrolled && (
                <div className="fixed bottom-8 right-3 z-50">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        className="p-2 bg-gray-500 text-white rounded-full shadow-lg transition-all hover:bg-pink-300 hover:scale-110"
                        title="Lên đầu trang"
                    >
                        <ArrowUpwardOutlined className="w-5 h-5" />
                    </button>
                </div>
            )}


            <div
                className={`fixed top-0 w-full p-4 z-20 flex flex-wrap justify-between items-center transition-all duration-500  ${
                    isScrolled 
                        ? "bg-white border-b border-gray-300 dark:border-gray-700 shadow-2xl" // Khi cuộn xuống
                        : "translate-y-0 animate-[bounce_0.4s_ease-in-out]" // Khi cuộn lên đầu trang, giựt nhẹ và có shadow xám
                        // : "" // Ban đầu trong suốt
                }`}>

                {/* Menu điều hướng */}
                <div className="flex-grow flex flex-wrap justify-center space-x-24 items-center">
                    <button onClick={() => navigation('/')} className="flex items-center space-x-4 hover:text-blue-500 uppercase">
                        <img 
                            src="/credit-card.png"
                            alt="Logo"
                            className="h-10 w-auto cursor-pointer mr-10"
                            onClick={() => navigation('/')}
                        />
                    </button>

                    {menuItems.map(({ id, label, path, subItems }) => (
                        <div
                            key={id}
                            onMouseEnter={() => handleMouseEnter(id)}
                            onMouseLeave={handleMouseLeave}
                            className="relative"
                        >

                        {/* Nút chính của menu */}
                        <motion.button
                            key={id}
                            onClick={() => handleMenuClick(id, path)}
                            className="relative flex flex-col items-center uppercase text-xl font-bold transition-all duration-300 group"
                            whileHover={{
                                scale: 1.1, // phóng to nhẹ 10%
                                textShadow: "0px 0px 12px rgba(34, 197, 94, 1)",
                            }}
                            whileTap={{ scale: 0.95 }} // thu nhỏ nhẹ 5%, tạo cảm giác nhấn
                        >
                            {/* Nhóm icon + chữ chung để áp dụng hover */}
                            <div className="relative flex items-center space-x-1">
                                <div className={`relative ${activePage === id ? 'text-green-500' : 'text-gray-700 group-hover:text-green-400'}`}>
                                    {iconMap[id as keyof typeof iconMap]}
                                </div>

                                <span className={`relative px-2 ${activePage === id ? 'text-green-500' : 'text-gray-700 group-hover:text-green-400'}`}>
                                    {label}

                                    {/* Mũi tên ngay bên phải chữ */}
                                    {subItems && (
                                        <motion.span
                                            className="ml-2 text-gray-700 group-hover:text-green-400"
                                            animate={{ rotate: hoveredMenu === id ? 180 : 0 }} // Xoay khi mở submenu
                                            transition={{ duration: 0.2 }}
                                        >
                                            <KeyboardArrowDown style={{ fontSize: "28px" }} />
                                        </motion.span>
                                    )}
                                </span>
                            </div>                            

                            {/* Gạch chân khi active */}
                            {activePage === id && (
                                <motion.div 
                                    className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-green-500" 
                                    layoutId="underline" 
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>

                        {/* Submenu */}
                        {subItems && hoveredMenu === id && (
                            <motion.ul
                                className="absolute top-full bg-transparent shadow-lg rounded-md mt-6 w-80 overflow-hidden"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                onMouseEnter={() => handleMouseEnter(id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {subItems.map(sub => (
                                    <motion.div
                                        key={sub.id}
                                        className="bg-gray-100 hover:bg-gray-300 transition"
                                    >
                                        <a
                                            href={sub.path}
                                            className="block text-gray-800 hover:text-red-600 transition"
                                        >
                                            <motion.div
                                                className="flex items-center px-4 py-2"
                                                whileHover={{ x: 6 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                            >
                                                {sub.icon}
                                                <span className="ml-2">{sub.label}</span>
                                            </motion.div>
                                        </a>
                                    </motion.div>
                                ))}
                            </motion.ul>
                        )}

                        </div>
                    ))}

                    {/* Ô Search và Giỏ hàng */}
                    <div className="flex items-center space-x-10">
                        {/* Search Box */}
                        <div className="relative w-full max-w-[500px]">
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm..." 
                                className="w-full border border-gray-300 rounded-md py-3 pr-12 pl-4 outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            {/* Icon nằm bên trong input */}
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Giỏ hàng */}
                        <div 
                            className="relative p-2" 
                            ref={searchRef}
                            onMouseEnter={() => setShowShop(true)} // Hover vào icon mở khung tìm kiếm
                            onMouseLeave={() => setShowShop(false)} // Rời chuột khỏi vùng tìm kiếm thì tắt
                        >
                            {/* Icon Search */}
                            <ShoppingCart className="cursor-pointer hover:scale-110 transition-all duration-300" />

                            {/* Khung nhỏ chứa input và button tìm kiếm */}
                            {showShop && (
                                <div className="absolute top-10 left-0 bg-white p-3 rounded-md shadow-lg flex items-center space-x-2 transition-all duration-300
                                    min-w-[250px]    
                                    before:content-[''] before:absolute before:-top-2 before:right-6 before:border-8 
                                    before:border-transparent before:border-b-white">
                                    
                                    <text className="text-lg">Chưa có sản phẩm trong giỏ hàng.</text>
                                </div>
                            )}
                        </div>
                    </div>
                    
                </div>

                {/* Khu vực đăng nhập / đăng ký */}
                <div className="flex space-x-4">
                    {!user ? (
                        <div>
                            <button onClick={toggleLoginForm} className="w-[120px] px-4 py-2 text-blue-500 border border-blue-500 bg-white rounded-full hover:bg-blue-500 hover:text-white transition duration-300 ml-4">Đăng nhập</button>
                            <button onClick={() => handleNavigation('/register')} className="w-[120px] px-4 py-2 text-blue-500 border border-blue-500 bg-white rounded-full hover:bg-blue-500 hover:text-white transition duration-300 ml-2">Đăng ký</button>
                        </div>
                    ) : (
                        <div className="relative">
                            <button className="flex items-center space-x-2 hover:bg-gray-100 rounded-full px-3 py-2 transition"
                                onClick={toggleMenu}>
                                
                                <Avatar alt="User Avatar" src={user?.imageUrl} className="w-10 h-10 border-2 border-pink-400 shadow-sm"/>
                                <span className="text-sm font-medium text-gray-800">
                                    {user?.name || 'Guest'}
                                </span>
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border z-50 overflow-hidden animate-fade-in">
                                    <ul className="divide-y text-sm text-gray-700">
                                        <li>
                                            <button
                                                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
                                                onClick={() => handleNavigation('/profile')}
                                            >
                                                <AccountCircleOutlined className="text-blue-500" />
                                                Thông tin cá nhân
                                            </button>
                                        </li>

                                        <li>
                                            <button
                                                className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50"
                                                onClick={() => handleNavigation('/settings')}
                                            >
                                                <SettingsOutlined className="text-yellow-500" />
                                                Cài đặt
                                            </button>
                                        </li>

                                        <li>
                                            <button
                                                className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50"
                                                onClick={handleLogout}
                                            >
                                                <LogoutOutlined />
                                                Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Login Form Modal */}
                {isLoginOpen && (
                    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-black bg-opacity-50 z-50">
                        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg animate-fade-in relative">
                            {/* Nút đóng */}
                            <button onClick={toggleLoginForm} className="absolute text-2xl top-4 right-4 text-gray-500 hover:text-gray-800">
                                ✖
                            </button>

                            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Đăng nhập</h2>

                            {/* Form đăng nhập */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="relative">
                                    <label 
                                        className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ml-8 
                                            ${focused.email 
                                            ? "-top-3 left-3 text-blue-500 text-sm" 
                                            : "top-5 text-gray-500 text-lg"}`}>
                                        Email
                                    </label>
                                    <Person className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl" />
                                    <input 
                                        name="email" 
                                        placeholder="Email" 
                                        onFocus={() => handleFocus("email")} 
                                        onBlur={() => handleBlur("email")} 
                                        onChange={handleChange} 
                                        className="w-full pt-5 pl-12 pr-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg" 
                                    />
                                </div>

                                <div className="relative">
                                    <label 
                                        className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ml-8 
                                            ${focused.password 
                                            ? "-top-3 left-3 text-blue-500 text-sm" 
                                            : "top-5 text-gray-500 text-lg"}`}>
                                        Mật khẩu
                                    </label>
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl">
                                        {formData.password ? <LockOpen /> : <Lock />}
                                    </div>
                                    <input 
                                        name="password" 
                                        placeholder="Mật khẩu" 
                                        type={showPassword ? "text" : "password"} 
                                        onFocus={() => handleFocus("password")} 
                                        onBlur={() => handleBlur("password")} 
                                        onChange={handleChange} 
                                        className="w-full pt-5 pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg" 
                                        required 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute inset-y-0 right-4 flex items-center text-gray-500 text-2xl">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </button>
                                </div>

                                {/* Quên mật khẩu */}
                                <div className="flex items-center justify-between">
                                    <a
                                        onClick={() => navigation("/forgot-password")}
                                        className="text-blue-500 hover:underline cursor-pointer text-lg">
                                        Quên mật khẩu?
                                    </a>
                                </div>

                                {/* Nút đăng nhập */}
                                <button 
                                    type="submit" 
                                    disabled={isLoading || !formData.email || !formData.password} 
                                    className={`w-full py-3 font-bold rounded-lg transition duration-300 text-lg
                                    ${isLoading || !formData.email || !formData.password
                                        ? "bg-gray-400 cursor-not-allowed" 
                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                                    }`}>
                                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                                </button>

                            </form>

                            {/* Thông báo lỗi */}
                            {message && <p className="text-red-500 text-center mt-4">{message}</p>}

                            {/* Chuyển hướng qua trang đăng ký */}
                            <p className="text-center text-gray-600 mt-6 text-lg">
                                Chưa có tài khoản?{" "}
                                <span 
                                    onClick={() => navigation("/register")}
                                    className="text-blue-500 font-semibold cursor-pointer hover:underline">
                                    Đăng ký ngay
                                </span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Nội dung hiển thị bên dưới menu */}
            <div className={`text-lg ${activePage !== "home" ? "mt-20" : ""}`}>
                {activePage === "home" ? (
                    // <NoiDung />
                    <TrangChu />
                ) : (
                    <div className="mt-2">
                        {activePage === "about" && <GioiThieu />}
                        {activePage === "services" && <DichVu />}
                        {/* {activePage === "schedule" && <AppointmentList />} */}
                        {activePage === "product" && <DanhSachKH />}
                        {activePage === "news" && <TinTuc />}
                        {activePage === "contact" && <LienHe />}
                    </div>
                )}
            </div>

            <Box sx={{ bottom: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <Footer />
            </Box> 
        </div>

    );
};

export default Menu;