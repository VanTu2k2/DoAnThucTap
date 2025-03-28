import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from "lucide-react"; // Biểu tượng mũi tên
import { ChatBubbleOutlineOutlined  } from "@mui/icons-material";

const NoiDung = () => {
    // const navigation = useNavigate();
    const images = ["/trilieu1.png", "/trilieu2.jpg"]; // Danh sách ảnh
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true); // Hiệu ứng fade-in

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [endX, setEndX] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            nextImage();
        }, 3000); // Chuyển ảnh mỗi 3 giây

        return () => clearInterval(interval);
    }, [currentIndex]);

    // Chuyển ảnh tiếp theo
    const nextImage = () => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
            setFade(true);
        }, 400);
    };

    // Chuyển ảnh trước đó
    const prevImage = () => {
        setFade(false);
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
            setFade(true);
        }, 400);
    };

    // Khi bắt đầu kéo chuột
    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.clientX || e.touches[0].clientX);
    };

    // Khi đang kéo
    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setEndX(e.clientX || e.touches[0].clientX);
    };

    // Khi thả chuột
    const handleMouseUp = () => {
        setIsDragging(false);
        const diff = startX - endX;
        if (diff > 50) nextImage(); // Kéo trái → ảnh tiếp theo
        if (diff < -50) prevImage(); // Kéo phải → ảnh trước đó
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hình ảnh chạy tự động + nút bấm */}
            {/* <div className="relative w-full max-w-[1000px] mx-auto">
                <img 
                    src={images[currentIndex]} 
                    alt="Giới thiệu" 
                    className={`w-full h-auto max-h-[400px] rounded-lg shadow-lg transition-opacity duration-700 ${
                        fade ? "opacity-100" : "opacity-0"}`} 
                />
                <button className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-400 transition-all" onClick={prevImage}>
                    <ChevronLeft size={40} />
                </button>

                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-400 transition-all"onClick={nextImage}>
                    <ChevronRight size={40} />
                </button>
            </div> */}

            {/* Ảnh */}
            <div
                className="relative w-full h-screen overflow-hidden cursor-grab active:cursor-grabbing"
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                <img
                    src={images[currentIndex]}
                    alt="Giới thiệu"
                    className={`absolute w-full h-full object-cover transition-opacity duration-700 ${
                        fade ? "opacity-100" : "opacity-0"
                    }`}
                />

                {/* Nút bấm chuyển ảnh */}
                <button className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-400 transition-all z-10" onClick={prevImage}>
                    <ChevronLeft size={50} />
                </button>
                <button className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-400 transition-all z-10" onClick={nextImage}>
                    <ChevronRight size={50} />
                </button>
            </div>
            

            {/* Đăng ký nhận tin & Đánh giá sao */}
            <div className="mx-auto px-4 py-4 mt-6 flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Đăng ký nhận tin */}
                <div className="w-full md:w-[60%] bg-blue-900 p-6 rounded-lg shadow-lg text-white">
                    <h3 className="text-lg font-semibold uppercase">Đăng ký nhận ưu đãi</h3>
                    <p className="text-sm opacity-80 mb-3">Nhận thông tin khuyến mãi và ưu đãi đặc biệt!</p>
                    <div className="flex justify-center gap-2">
                        <input type="email" placeholder="Nhập email của bạn..." className="px-4 py-2 w-64 rounded-lg text-gray-800 focus:outline-none" />
                        <button className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 uppercase">Đăng ký</button>
                    </div>
                </div>

                {/* Đánh giá sao */}
                <div className="w-full md:w-[40%] bg-white p-6 rounded-lg border shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 uppercase">Đánh giá dịch vụ</h3>
                    <p className="text-gray-600 text-sm mb-3">Hãy để lại đánh giá của bạn!</p>
                    <div className="flex justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, index) => (
                            <button key={index} className="text-gray-400 hover:text-yellow-400 text-2xl transition">★</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nội dung giới thiệu */}
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Văn bản bên trái */}
                <div className="flex justify-center text-left">
                    <div>
                        <h2 className="text-xl uppercase">About us</h2>
                        <h2 className="text-2xl font-semibold mb-2 uppercase">Chào mừng đến với chúng tôi</h2>
                        <p className="text-gray-700 max-w-xl">
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                        </p>
                    </div>
                </div>
                {/* Hình ảnh bên phải */}
                <div className="h-full flex justify-center items-center">
                    <img 
                        src="/massage-tri-lieu.jpg" 
                        alt="Giới thiệu" 
                        className="w-full max-w-[450px] rounded-lg shadow-lg"
                    />
                </div>
            </div>
            
            {/* Nội dung giới thiệu */}
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Hình ảnh bên phải */}
                <div className="h-full flex justify-center items-center">
                    <img 
                        src="/massage-tri-lieu.jpg" 
                        alt="Giới thiệu" 
                        className="w-full max-w-[450px] rounded-lg shadow-lg"
                    />
                </div>

                {/* Văn bản bên trái */}
                <div className="flex justify-center text-left">
                    <div>
                        {/* <h2 className="text-xl uppercase">About us</h2> */}
                        <h2 className="text-2xl font-semibold mb-2 uppercase">Công dụng</h2>
                        <p className="text-gray-700 max-w-xl">
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                        </p>
                    </div>
                </div>
            </div>

            {/* Nội dung giới thiệu */}
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Văn bản bên trái */}
                <div className="flex justify-center text-left">
                    <div>
                        <h2 className="text-xl uppercase">About us</h2>
                        <h2 className="text-2xl font-semibold mb-2 uppercase">Chào mừng đến với chúng tôi</h2>
                        <p className="text-gray-700 max-w-xl">
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                        </p>
                    </div>
                </div>
                {/* Hình ảnh bên phải */}
                <div className="h-full flex justify-center items-center">
                    <img 
                        src="/massage-tri-lieu.jpg" 
                        alt="Giới thiệu" 
                        className="w-full max-w-[450px] rounded-lg shadow-lg"
                    />
                </div>
            </div>
            
            {/* Nội dung giới thiệu */}
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Hình ảnh bên phải */}
                <div className="h-full flex justify-center items-center">
                    <img 
                        src="/massage-tri-lieu.jpg" 
                        alt="Giới thiệu" 
                        className="w-full max-w-[450px] rounded-lg shadow-lg"
                    />
                </div>

                {/* Văn bản bên trái */}
                <div className="flex justify-center text-left">
                    <div>
                        {/* <h2 className="text-xl uppercase">About us</h2> */}
                        <h2 className="text-2xl font-semibold mb-2 uppercase">Công dụng</h2>
                        <p className="text-gray-700 max-w-xl">
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                            Chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao nhằm mang lại sự hài lòng tuyệt đối cho khách hàng.
                            Với đội ngũ chuyên gia giàu kinh nghiệm, chúng tôi cam kết đem đến giá trị tốt nhất cho bạn.
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default NoiDung;
