import { useEffect, useState } from "react";
import { Button, Dialog, DialogContent, DialogTitle, Pagination, Container, Box, Typography, Divider, IconButton, Slider } from "@mui/material";
import { getProducts, createOrder } from "../../service/apiProduct";
import { ProductResponse, OrderRequest } from "../../interface/Product_interface";
import { toast, ToastContainer } from "react-toastify";
import { CircleDollarSign, X, ShoppingCart } from "lucide-react";
import { Category } from "../../interface/ServiceSPA_interface";
import { motion } from 'framer-motion';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const pageSize = 8;

// import { useRef } from "react";

const SanPham = () => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [activeSort, setActiveSort] = useState('option:noibat');
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    // const [, setShowQuantityModal] = useState(false);
    // const [quantityToAdd, setQuantityToAdd] = useState(1);

    const [, setQuantityToAdd] = useState(1);

    // const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    // const imageRef = useRef<HTMLDivElement>(null);
    // const handleMouseMove = (e: React.MouseEvent) => {
    //   const { left, top, width, height } = imageRef.current!.getBoundingClientRect();
    //   const x = ((e.clientX - left) / width) * 100;
    //   const y = ((e.clientY - top) / height) * 100;
    //   setZoomPosition({ x, y });
    // };
    // const handleMouseLeave = () => {
    //   setZoomPosition({ x: 50, y: 50 }); // Reset zoom
    // };
      
    // Fetch categories khi load trang
    useEffect(() => {
        axios.get("/api/categories")
        .then(res => setCategories(res.data))
        .catch(err => console.error("Lỗi khi load categories", err));
    }, []);

    useEffect(() => {
        if (selectedCategoryId !== null) {
            axios.get("/api/products") // Gọi tất cả products
            .then(res => {
                const allProducts: ProductResponse[] = res.data;
                const filtered = allProducts.filter(product => product.category.id === selectedCategoryId);
                setProducts(filtered);
            })
            .catch(err => 
            console.error("Lỗi khi load products", err));
        }
    }, [selectedCategoryId]);

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
        let filtered = [...allProducts];
    
        // Lọc theo danh mục nếu có
        if  (selectedCategoryId) {
            filtered = filtered.filter(product => product.category.id === selectedCategoryId);
        }
    
        // Lọc theo khoảng giá nếu đã lọc
        if  (isFilteredByPrice) {
            const [minPrice, maxPrice] = priceRange;
            filtered = filtered.filter(product =>
                Number(product.price) >= minPrice && Number(product.price) <= maxPrice
            );
        }

        //  Sắp xếp theo sortType (trừ "nổi bật")
        if (sortType !== 'noibat') {
            filtered.sort((a, b) => {
                switch (sortType) {
                    case 'giathapdencao':
                        return a.price - b.price;
                    case 'giacaodenthap':
                        return b.price - a.price;
                    case 'moinhat': {
                        return b.id - a.id; // Sắp xếp id giảm dần
                    }
                    default:
                        return 0;
                }
            });
        }

        setProducts(filtered); // Cập nhật sản phẩm sau khi lọc và sắp xếp
        setCurrentPage(1); // Quay lại trang đầu tiên
    
    }, [sortType, selectedCategoryId ]); 

    // Yêu cầu đăng nhập để được đặt lịch    
    const handleBookingClick = (product: unknown) => {
        const user = localStorage.getItem("user");
    
        if (!user) {
            alert("Vui lòng đăng nhập để đặt lịch.");
            navigate("/login");
            return;
        }
        const selectedProduct = product;
    
        navigate("/booking", { state: { selectedProduct } });
    };

    const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);

    // State để lưu khoảng giá
    const DEFAULT_PRICE_RANGE = [50000, 1000000];
    const [priceRange, setPriceRange] = useState<number[]>(DEFAULT_PRICE_RANGE);
    useEffect(() => {
        setPriceRange(DEFAULT_PRICE_RANGE);
    }, [selectedCategoryId]);

    const [isFilteredByPrice, setIsFilteredByPrice] = useState(false);

    const filteredProducts = products.filter((product) =>
        product.nameProduct.toLowerCase().includes(searchTerm.toLowerCase())
    );
        
    // Hàm xử lý khi click nút áp dụng khoảng giá
    const handleApplyPrice = () => {
        const [minPrice, maxPrice] = priceRange;
        console.log("Áp dụng khoảng giá:", minPrice, "-", maxPrice);
    
        let filtered = allProducts.filter(product => product.category.id === selectedCategoryId);
    
        filtered = filtered.filter(product =>
            Number(product.price) >= minPrice && Number(product.price) <= maxPrice
        );
    
        console.log("Filtered products:", filtered);
    
        setProducts(filtered);
        setCurrentPage(1);
        setIsFilteredByPrice(true);
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);

    // Tải danh sách sản phẩm
    const fetchProducts = async () => {
        try {
            const response = await getProducts(); // Thay bằng API thực tế
            setProducts(response);         // Hiển thị ban đầu
            setAllProducts(response);      // Ghi vào bộ lọc gốc
        } catch (error) {
            console.error("Lỗi tải danh sách sản phẩm:", error);
        }
    };

    const filteredPro = products.filter((pro) => {
        return pro.nameProduct.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (statusFilter === "" || pro.productStatus === statusFilter);
    });

    // Render danh sách sản phẩm theo Page
    const paginatedProducts = filteredPro.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    // Hiển thị Dialog
    const handleOpenDialog = (product: ProductResponse) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    // Đóng Dialog
    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedProduct(null); // Reset thông tin sản phẩm
        setQuantityToAdd(1);      // Reset lại số lượng khi đóng dialog
    };

    // Hàm thêm sản phẩm vào giỏ hàng   
    // const handleAddToCart = async () => {
    //     if (!selectedProduct) return;
        
    //     const currentUserString = localStorage.getItem("user");
    //     const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    
    //     if (!currentUser || !currentUser.id) {
    //         toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
    //         return;
    //     }
    
    //     // Cung cấp giá trị mặc định cho shippingAddress nếu không có
    //     const shippingAddress = currentUser?.address || "Địa chỉ giao hàng mặc định";  // Ví dụ địa chỉ mặc định
    
    //     const orderPayload: OrderRequest = {
    //         userId: currentUser.id,
    //         shippingAddress: shippingAddress,  // Sử dụng địa chỉ mặc định nếu không có
    //         shippingPhone: currentUser.phone || null,
    //         orderDate: new Date().toISOString(),
    //         notes: null,
    //         orderItems: [
    //             {
    //                 productId: selectedProduct.id,
    //                 quantity: quantityToAdd
    //             }
    //         ]
    //     };
    
    //     try {
    //         await createOrder(orderPayload);
    //         toast.success("Đã thêm vào giỏ hàng!");
    //         setQuantityToAdd(1);
    //         setOpen(false);
    //     } catch {
    //         toast.error("Thêm vào giỏ hàng thất bại!");
    //     }
    // };


    const handleAddToCart = async () => {
        if (!selectedProduct) return;
    
        const currentUserString = localStorage.getItem("user");
        const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    
        if (!currentUser || !currentUser.id) {
            toast.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return;
        }
    
        // Cung cấp giá trị mặc định cho shippingAddress nếu không có
        const shippingAddress = currentUser?.address || "Địa chỉ giao hàng mặc định";  // Ví dụ địa chỉ mặc định
    
        // Giỏ hàng chỉ cần thêm sản phẩm mà không cần quan tâm đến số lượng, số lượng sẽ được chọn sau.
        const orderPayload: OrderRequest = {
            userId: currentUser.id,
            shippingAddress: shippingAddress,  // Sử dụng địa chỉ mặc định nếu không có
            shippingPhone: currentUser.phone || null,
            orderDate: new Date().toISOString(),
            notes: null,
            orderItems: [
                {
                    productId: selectedProduct.id,
                    quantity: 1 // Mặc định thêm 1 sản phẩm vào giỏ hàng
                }
            ]
        };
    
        try {
            await createOrder(orderPayload);
            toast.success("Đã thêm vào giỏ hàng!");
            setOpen(false);  // Đóng modal giỏ hàng hoặc xác nhận đã thêm vào giỏ
        } catch {
            toast.error("Thêm vào giỏ hàng thất bại!");
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
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sản phẩm Spa</h2>

            {/* Thanh tìm kiếm & lọc */}
            <div className="flex flex-col items-center gap-4 mb-10">
                <div className="flex flex-wrap gap-4 justify-center max-w-xl w-full">
                    <div className="flex items-center gap-2 border px-4 py-2 rounded-full min-w-[300px]">
                        <span className="text-lg">🔍</span>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
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
                                    setProducts(allProducts); // hiện tất cả sản phẩm
                                }}
                                sx={{
                                    cursor: "pointer",
                                    color: selectedCategoryId === null ? "primary.main" : "text.primary",
                                    fontWeight: selectedCategoryId === null ? 600 : 400,
                                    mb: 0.5,
                                }}>
                                Danh mục Sản phẩm
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
                                    Trải nghiệm sản phẩm thư giãn đỉnh cao hôm nay.
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box flex={1}>
                        <Typography fontWeight={700} fontSize={20} display="flex" alignItems="center" gap={1}>
                            Sản phẩm Spa
                            <Typography component="span" fontWeight={400} color="gray">
                                ({products.length} sản phẩm)
                            </Typography>
                        </Typography>

                        {/* Phần lọc giá riêng */}
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
                                        const filteredByCategory = allProducts.filter(
                                            product => product.category.id === selectedCategoryId
                                        );
                                        setProducts(filteredByCategory);
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

                        {/* 👉 Hiển thị danh sách sản phẩm hoặc thông báo khi không có */}
                        {(filteredProducts.length === 0 ? paginatedProducts : filteredProducts).length === 0 ? (
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
                                        const filteredByCategory = allProducts.filter(
                                            product => product.category.id === selectedCategoryId
                                        );
                                        setProducts(filteredByCategory);
                                        setIsFilteredByPrice(false);
                                    }}
                                >
                                    Xóa bộ lọc
                                </Button>
                            </Box>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                                {(filteredProducts.length === 0 ? paginatedProducts : filteredProducts).map((product) => (
                                    <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow flex flex-col cursor-default">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => handleOpenDialog(product)}
                                            className="group cursor-pointer hover:shadow-lg transition-shadow">

                                            <h3 
                                                className="text-lg font-bold text-gray-900 p-4 group-hover:text-green-700 transition-colors duration-200 
                                                            line-clamp-2 h-[4rem] leading-snug overflow-hidden">
                                                {product.nameProduct}
                                            </h3>

                                            {/* Hình ảnh */}
                                            <img
                                                src={product.imageUrl || "https://media.hcdn.vn/catalog/category/1320x250-1.jpg"}
                                                alt={product.nameProduct}
                                                className="w-full h-40 object-cover"
                                            />
                                                
                                            {/* Giá + Số lượng*/}
                                            <div className="p-4 flex flex-col gap-2">
                                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                                    <CircleDollarSign className="w-4 h-4 text-gray-700" />
                                                    <span className="text-orange-500">{product.price.toLocaleString("vi-VN")} VND</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                                    <ShoppingCart className="w-4 h-4" />
                                                    {product.quantity} cái
                                                </div>
                                            </div>
                                            {/* <div className="p-4 flex items-center justify-between text-sm text-gray-700">
                                                <div className="flex items-center gap-1">
                                                    <CircleDollarSign className="w-4 h-4 text-gray-700" />
                                                    <span className="text-orange-500">{product.price.toLocaleString("vi-VN")} VND</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <ShoppingCart className="w-4 h-4" />
                                                    {product.quantity} cái
                                                </div>
                                            </div> */}

                                            <Typography fontSize={14}>{product.category.id}</Typography>

                                            <Typography fontSize={14}>Xếp ds sp mới nhất: {product.id}</Typography>
                                        </motion.div>

                                        {/* Dấu gạch ngăn cách */}
                                        <hr className="my-2 border-gray-200" />

                                        <div className="px-4 pb-4 flex flex-col gap-2 flex-grow">
                                            {/* Mô tả */}
                                            <div className="relative h-[60px]">
                                                <p className="text-sm text-gray-600 line-clamp-3 pr-[60px]">
                                                    {product.description}
                                                </p>
                                                <span
                                                    className="absolute bottom-0 right-0 text-xs text-blue-500 hover:underline cursor-pointer bg-white pl-1"
                                                    onClick={() => handleOpenDialog(product)}
                                                >
                                                    xem thêm
                                                </span>
                                            </div>
                                            
                                            {/* <div className="mt-4 space-y-2">
                                                <button
                                                    className="w-full bg-orange-400 text-white py-2 rounded-lg font-semibold"
                                                    // onClick={() => navigate("/booking", { state: { selectedService: service } })}
                                                    onClick={() => handleBookingClick(product)}
                                                >
                                                    Mua ngay
                                                </button>
                                            </div> */}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        )}

                        {/* Phân trang */}
                        <div className="flex justify-center mt-6">
                            <Pagination
                                count={Math.ceil(products.length / pageSize)}
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
                {selectedProduct && (
                    <>
                        <DialogTitle sx={{ fontSize: '30px', fontWeight: 'bold', position: 'relative', pr: 6 }}>
                            {selectedProduct.nameProduct}
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
                                    src={selectedProduct.imageUrl || "https://media.hcdn.vn/catalog/category/1320x250-1.jpg"}
                                    alt={selectedProduct.nameProduct}
                                    className="w-full h-auto max-h-80 object-contain transition-transform duration-300 hover:scale-105"
                                />
                            </div>

                            {/* <div
                                className="relative rounded-lg overflow-hidden shadow mb-6 group"
                                ref={imageRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                                >
                                <img
                                    src={selectedProduct.imageUrl || "https://media.hcdn.vn/catalog/category/1320x250-1.jpg"}
                                    alt={selectedProduct.nameProduct}
                                    className="w-full h-auto max-h-80 object-contain transition duration-300"
                                    style={{
                                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                                    transform: "scale(1.5)",
                                    }}
                                />
                                <div className="absolute inset-0 bg-transparent group-hover:bg-white/10" />
                            </div> */}

                            <p className="text-gray-700 mb-4 leading-relaxed">
                                <strong className="text-gray-900">Mô tả:</strong> {selectedProduct.description}
                            </p>

                            <p className="text-gray-600 mb-2">Giá: <span className="text-orange-500 font-semibold">{selectedProduct.price.toLocaleString("vi-VN")} VND</span></p>

                            <p className="text-gray-600">Còn: {selectedProduct.quantity}</p>

                            {/* <div className="flex items-center mt-3">
                                <button
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
                                    onClick={() => setQuantityToAdd(prev => Math.max(1, prev - 1))}
                                >-</button>

                                <span className="mx-4 text-lg">{quantityToAdd}</span>

                                <button
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
                                    onClick={() =>
                                    setQuantityToAdd(prev => Math.min(selectedProduct.quantity, prev + 1))
                                    }
                                >+</button>
                            </div> */}

                        </DialogContent>

                        {/* Thêm sp vào giỏ hàng & Mua ngay */}
                        <div className="flex justify-end px-6 pb-2 pt-2 border-t">
                            <button
                                className="bg-gradient-to-r from-gray-300 to-gray-400 hover:from-pink-400 hover:to-pink-300 text-white 
                                            px-8 py-2 rounded-full text-lg font-medium shadow-md transition duration-300 mr-4"
                                onClick={handleAddToCart}
                            >
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Thêm vào giỏ hàng</span>
                                </div>
                            </button>

                            <button className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white 
                                                px-8 py-2 rounded-full text-lg font-medium shadow-md transition duration-300"
                                    onClick={() => handleBookingClick(selectedProduct)}
                                    >
                                Mua ngay
                            </button>
                        </div>
                    </>
                )}
            </Dialog>
        </motion.div>
    );
};

export default SanPham;