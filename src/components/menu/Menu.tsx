// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const Menu: React.FC = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [activePage, setActivePage] = useState("");


//     // Danh sách menu
//     const menuItems = [
//         { id: "home", label: "Trang chủ", path: "/trangchu" },
//         { id: "about", label: "Giới thiệu", path: "/gioithieu" },
//         { id: "services", label: "Dịch vụ", path: "/dichvu" },
//         { id: "training", label: "Đào tạo", path: "/daotao" },
//         { id: "customer", label: "Khách hàng", path: "/khachhang" },
//         { id: "news", label: "Tin tức", path: "/tintuc" },
//         { id: "contact", label: "Liên hệ", path: "/lienhe" }
//     ];

//     // Xử lý chọn menu (Cập nhật state và URL mà không tải lại trang)
//     const handleMenuClick = (id: string, path: string) => {
//         setActivePage(id);
//         if (id === "home") {
//             window.history.pushState({}, "", "/"); // Trang chủ không có "/trangchu"
//         } else {
//             window.history.pushState({}, "", path); // Cập nhật URL mà không reload. Các trang khác có "/gioithieu", "/dichvu"...
//         }
//     };
    
//     // Khi tải trang, kiểm tra URL để đặt trang phù hợp
//     useEffect(() => {
//         const foundItem = menuItems.find(item => item.path === location.pathname);
//         if (foundItem) {
//             setActivePage(foundItem.id);
//         }
//     }, [location.pathname]); // Chạy lại khi đường dẫn thay đổi

//     useEffect(() => {
//         const currentPath = window.location.pathname; // Đọc URL hiện tại
//         const foundItem = menuItems.find(item => item.path === currentPath);
//         if (foundItem) {
//             setActivePage(foundItem.id);
//         }
//     }, []);

//     return (
//         <nav>
//             <ul>
//                 {menuItems.map(({ id, label, path }) => (
//                     <button
//                         key={id}
//                         onClick={() => handleMenuClick(id, path)}
//                         className={`relative uppercase text-xl font-bold transition-all duration-300
//                             ${activePage === id ? 'text-blue-500' : 'text-gray-700 hover:text-blue-400'}
//                             after:absolute after:bottom-[-4px] after:left-0 after:w-0 
//                             hover:after:w-full after:h-[2px] after:bg-blue-400 
//                             after:transition-all after:duration-300 
//                             ${activePage === id ? 'after:w-full after:bg-blue-500' : 'after:w-0'}`}
//                     >
//                         {label}
//                     </button>
//                 ))}
//             </ul>
//         </nav>
//     );
// };

// export default Menu;



import { useState, useEffect, useRef } from "react";
import { AccountCircleOutlined, LogoutOutlined, NotificationsActiveOutlined, SettingsOutlined, Visibility, VisibilityOff, Person, Lock, LockOpen, Search, ShoppingCart, Home, Info, Spa, School, People, Article, ContactMail, EventNoteOutlined, ChatBubbleOutlineOutlined, ArrowUpwardOutlined } from "@mui/icons-material";
import { Avatar, Badge, IconButton, Box} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hook/AuthContext";
import { loginUser, logout } from "../../service/apiService";
import { motion } from "framer-motion";
import NoiDung from "../menu/NoiDung";
import DanhSachKH from "../../page/customer-KhachHang/Danh_sach_KH";
import Footer from "../footer/Footer";
import GioiThieu from "../menu/GioiThieu";
import DichVu from "../menu/DichVu";
import DaoTao from "../menu/DaoTao";
import TinTuc from "../menu/TinTuc";
import LienHe from "../menu/LienHe";

const Menu: React.FC = () => {
    const location = useLocation(); // Lấy đường dẫn hiện tại
    const navigation = useNavigate();
    const isActive = (path: string) => location.pathname === path;  // Kiểm tra mục đang chọn
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { login, user, logoutContext } = useAuth();
    
    // State for login form
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState({ username: false, password: false });


    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const toggleLoginForm = () => setIsLoginOpen(prev => !prev);

    const handleNavigation = (path: string) => navigation(path);

    const [activePage, setActivePage] = useState("home");

    // Danh sách menu
    // const menuItems = [
    //     { id: "home", label: "Trang chủ", path: "/trangchu" },
    //     { id: "about", label: "Giới thiệu", path: "/gioithieu" },
    //     { id: "services", label: "Dịch vụ", path: "/dichvu" },
    //     { id: "training", label: "Đào tạo", path: "/daotao" },
    //     { id: "customer", label: "Khách hàng", path: "/khachhang" },
    //     { id: "news", label: "Tin tức", path: "/tintuc" },
    //     { id: "contact", label: "Liên hệ", path: "/lienhe" }
    // ];

    const [hoveredMenu, setHoveredMenu] = useState(null);
    let timeoutId = null;

    const handleMouseEnter = (id) => {
        clearTimeout(timeoutId); // Xóa timeout để submenu không bị ẩn ngay lập tức
        setHoveredMenu(id);
    };

    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => setHoveredMenu(null), 300); // Delay 300ms trước khi ẩn submenu
    }; 
    
    const menuItems = [
        { id: "home", label: "Trang chủ", path: "/trangchu" },
        { id: "about", label: "Giới thiệu", path: "/gioithieu" },
        { 
            id: "services", label: "Dịch vụ", path: "/dichvu",
            subItems: [
                { id: "web-design", label: "Thiết kế web", path: "/dichvu/thietkeweb" },
                { id: "seo", label: "SEO Marketing", path: "/dichvu/seo" },
                { id: "branding", label: "Xây dựng thương hiệu", path: "/dichvu/branding" }
            ]
        },
        { id: "training", label: "Đào tạo", path: "/daotao" },
        { id: "customer", label: "Khách hàng", path: "/khachhang" },
        { id: "news", label: "Tin tức", path: "/tintuc" },
        { id: "contact", label: "Liên hệ", path: "/lienhe" }
    ];
    

    const iconMap = {
        home: <Home fontSize="medium" className="text-green-500 relative z-10" />, 
        // about: <Info fontSize="medium" className="text-green-500 relative z-10" />,
        services: <Spa fontSize="medium" className="text-green-500 relative z-10" />, 
        training: <School fontSize="medium" className="text-green-500 relative z-10" />, 
        customer: <People fontSize="medium" className="text-green-500 relative z-10" />, 
        news: <Article fontSize="medium" className="text-green-500 relative z-10" />, 
        contact: <ContactMail fontSize="medium" className="text-green-500 relative z-10" />
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
    const [showSearch, setShowSearch] = useState(false);
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

    const handleFocus = (field: "username" | "password") => {
        setFocused(prev => ({ ...prev, [field]: true }));
    };
    
    const handleBlur = (field: "username" | "password") => {
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
            setFormData({ username: "", password: "" });
            setFocused({ username: false, password: false }); // Reset trạng thái focus
            setIsLoginOpen(false); // Đóng form đăng nhập

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            if (errorMessage.includes("Invalid username or password")) {
                setMessage("Tên đăng nhập hoặc mật khẩu không đúng!");
            } else {
                setMessage(`Đăng nhập thất bại: ${errorMessage}`);
            }
        } finally {
            setIsLoading(false); // Tắt trạng thái đang tải
        }
    };

    return (
        // <div className="relative flex justify-between items-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-8 border-b border-gray-300 dark:border-gray-700 shadow-md">
        <div className="flex flex-col min-h-screen">
            {/* Nút mũi tên lên đầu trang */}
            {isScrolled && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-6 p-3 bg-black text-white rounded-full shadow-lg transition-all hover:bg-pink-300 hover:scale-110"
                    title="Lên đầu trang"
                >
                    <ArrowUpwardOutlined className="w-5 h-5" />
                </button>
            )}           
            <div
                className={`fixed top-0 w-full p-4 z-20 flex justify-between items-center transition-all duration-500  ${
                    isScrolled 
                        ? "bg-white border-b border-gray-300 dark:border-gray-700 shadow-2xl" // Khi cuộn xuống
                        : "translate-y-0 animate-[bounce_0.4s_ease-in-out]" // Khi cuộn lên đầu trang, giựt nhẹ và có shadow xám
                        // : "" // Ban đầu trong suốt
                }`}>

                {/* Menu điều hướng */}
                <div className="flex-grow flex justify-center space-x-24 items-center">
                    <button onClick={() => navigation('/')} className="flex items-center space-x-4 hover:text-blue-500 uppercase">
                        <img 
                            src="/credit-card.png"
                            alt="Logo"
                            className="h-10 w-auto cursor-pointer mr-10"
                            onClick={() => navigation('/')}
                        />
                    </button>

                    {/* {menuItems.map(({ id, label, path }) => (
                        <button
                            key={id}
                            onClick={() => handleMenuClick(id, path)}
                            className={`relative uppercase text-xl font-bold transition-all duration-300
                                ${activePage === id ? 'text-blue-500' : 'text-gray-700 hover:text-blue-400'}
                                after:absolute after:bottom-[-4px] after:left-0 after:w-0 
                                hover:after:w-full after:h-[2px] after:bg-blue-400 
                                after:transition-all after:duration-300 
                                ${activePage === id ? 'after:w-full after:bg-blue-500' : 'after:w-0'}`}
                        >
                            {label}
                        </button>
                    ))} */}

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
                                </span>
                            </div>

                            {/* <div className={activePage === id ? 'text-green-500' : 'text-gray-700 group-hover:text-green-400'}>
                                {iconMap[id as keyof typeof iconMap]}
                            </div>
                            <span className={activePage === id ? 'text-green-500' : 'text-gray-700 group-hover:text-green-400'}>
                                {label}
                            </span> */}

                            {/* Hiệu ứng bóng phát sáng khi active */}
                            {activePage === id && (
                                <motion.div
                                    className="absolute inset-0 flex justify-center items-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {[...Array(6)].map((_, i) => (
                                        <motion.span
                                            key={i}
                                            className="absolute w-2 h-2 bg-green-400 rounded-full blur-md"
                                            style={{ filter: "brightness(1.5)" }}
                                            animate={{
                                                scale: [1, 1.8, 1], // Phồng lên rồi co lại
                                                opacity: [0.9, 0.5, 0.9], // Nhấp nháy nhẹ
                                                x: [0, (Math.random() - 0.5) * 50, 0], // Di chuyển ngẫu nhiên theo trục X
                                                y: [0, (Math.random() - 0.5) * 50, 0], // Di chuyển ngẫu nhiên theo trục Y
                                                // y: [0, -(Math.random() * 50 + 5), 0], // Bay lên trên nhiều hơn
                                            }}
                                            transition={{
                                                duration: 1.5, // Chạy trong 1.5 giây
                                                ease: "easeInOut", // Hiệu ứng mượt mà
                                                repeat: Infinity, // Lặp vô hạn
                                                repeatType: "reverse", // Lặp theo kiểu qua lại
                                                delay: i * 0.2, // Mỗi bong bóng xuất hiện lệch nhau 0.2s
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            )}

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
                                className="absolute top-full bg-white shadow-lg rounded-md mt-10 py-2 w-60"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                onMouseEnter={() => handleMouseEnter(id)} // Giữ submenu khi di chuột vào
                                onMouseLeave={handleMouseLeave} // Ẩn submenu khi rời chuột
                            >
                                {subItems.map(sub => (
                                    <div key={sub.id}>
                                        <a
                                            href={sub.path}
                                            className="block px-4 py-2 text-gray-800 hover:bg-green-500 hover:text-white transition"
                                        >
                                            {sub.label}
                                        </a>
                                    </div>
                                ))}
                            </motion.ul>
                        )}

                        </div>
                    ))}

                    {/* Ô Search và Giỏ hàng */}
                    <div className="flex items-center space-x-10">
                        {/* Search Box */}
                        <div 
                            className="relative p-2" 
                            ref={searchRef}
                            onMouseEnter={() => setShowSearch(true)} // Hover vào icon mở khung tìm kiếm
                            onMouseLeave={() => setShowSearch(false)} // Rời chuột khỏi vùng tìm kiếm thì tắt
                        >
                            {/* Icon Search */}
                            <Search className="cursor-pointer hover:scale-110 transition-all duration-300" />

                            {/* Khung nhỏ chứa input và button tìm kiếm */}
                            {showSearch && (
                                <div className="absolute top-10 left-0 bg-white p-3 rounded-md shadow-lg flex items-center space-x-2 transition-all duration-300
                                    min-w-[250px]    
                                    before:content-[''] before:absolute before:-top-2 before:right-6 before:border-8 
                                    before:border-transparent before:border-b-white">
                                    
                                    {/* Input tìm kiếm */}
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm..." 
                                        // className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                                        className="border p-3 rounded-md outline-none focus:ring-2 focus:ring-blue-400 w-full min-w-[250px] h-12 resize-y"
                                        autoFocus // Tự động focus khi mở
                                    />

                                    {/* Button tìm kiếm */}
                                    <button className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-all duration-300">
                                        🔍
                                    </button>
                                </div>
                            )}
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
                        <div className="flex">
                            <IconButton size="large" color="inherit">
                                <Badge badgeContent={17} color="error">
                                    <NotificationsActiveOutlined style={{ color: 'gray', fontSize: '28px' }} />
                                </Badge>
                            </IconButton>
                            <div className="relative">
                                <div className="flex flex-col items-center cursor-pointer" onClick={toggleMenu}>
                                    <Avatar alt="User Avatar" src={user?.imageUrl}/>
                                    <p className="mt-1 text-sm font-medium">{user?.name || 'Guest'}!</p>
                                </div>
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border z-50">
                                        <ul className="py-2">
                                            <li><button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full" onClick={() => handleNavigation('/profile')}><AccountCircleOutlined /> Thông tin cá nhân</button></li>
                                            <li><button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full" onClick={() => handleNavigation('/settings')}><SettingsOutlined /> Cài đặt</button></li>
                                            <li><button className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full" onClick={handleLogout}><LogoutOutlined /> Đăng xuất</button></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Khu vực chứa cả hộp thông tin và icon Messenger */}
                    <div className="absolute right-3 mt-20">
                        {/* Hộp thông tin */}
                        <div className="w-80 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-2xl border-2 border-white/30 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-3xl">
                            <div>
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-white bg-opacity-20 rounded-full">
                                        <EventNoteOutlined className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold tracking-wide">Thông tin & Ưu đãi</h3>
                                </div>

                                <p className="mt-4 text-sm text-white/80 leading-relaxed">
                                    Đặt lịch ngay để nhận ưu đãi độc quyền! Trải nghiệm dịch vụ chất lượng cao với nhiều chương trình hấp dẫn.
                                </p>

                                <button className="mt-5 w-full py-3 text-lg font-semibold bg-white text-blue-600 rounded-xl shadow-md hover:bg-gray-200 transition-all">
                                    Book lịch ngay 🚀
                                </button>
                            </div>
                        </div>

                        {/* Nút chat Messenger */}
                        <div className="absolute right-2 mt-10"> 
                            <button
                                className="p-5 bg-blue-600 text-white rounded-full shadow-lg transition-all hover:bg-blue-700 hover:scale-110"
                                title="Opens Chat"
                            >
                                <ChatBubbleOutlineOutlined className="w-10 h-10" />
                            </button>
                        </div>
                    </div>

                </div>

                {/* Login Form Modal */}
                {isLoginOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
                                            ${focused.username 
                                            ? "-top-3 left-3 text-blue-500 text-sm" 
                                            : "top-5 text-gray-500 text-lg"}`}>
                                        Tên đăng nhập
                                    </label>
                                    <Person className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl" />
                                    <input 
                                        name="username" 
                                        placeholder="Tên đăng nhập" 
                                        onFocus={() => handleFocus("username")} 
                                        onBlur={() => handleBlur("username")} 
                                        onChange={handleChange} 
                                        className="w-full pt-5 pl-12 pr-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg" 
                                    />
                                </div>

                                <div className="relative">
                                    <label 
                                        className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ml-8 
                                            ${focused.password 
                                            ? "-top-3 left-3 text-gray-500 text-sm" 
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
                                    disabled={isLoading || !formData.username || !formData.password} 
                                    className={`w-full py-3 font-bold rounded-lg transition duration-300 text-lg
                                    ${isLoading || !formData.username || !formData.password
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
            {/* <div className="text-lg">
                {activePage === "home" && <NoiDung />}
                {activePage === "about" && <GioiThieu />}
                {activePage === "services" && <DichVu />}
                {activePage === "training" && <DaoTao />}
                {activePage === "customer" && <DanhSachKH />}
                {activePage === "news" && <TinTuc />}
                {activePage === "contact" && <LienHe />}
            </div> */}

            {/* Nội dung hiển thị bên dưới menu */}
            <div className={`text-lg ${activePage !== "home" ? "mt-20" : ""}`}>
                {activePage === "home" ? (
                    <NoiDung />
                ) : (
                    <div className="mt-2">
                        {activePage === "about" && <GioiThieu />}
                        {activePage === "services" && <DichVu />}
                        {activePage === "training" && <DaoTao />}
                        {activePage === "customer" && <DanhSachKH />}
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