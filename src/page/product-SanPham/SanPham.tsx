import React, { useEffect, useState } from 'react';
import { deleteProduct, getProducts, updateProduct } from '../../service/apiProduct';
import { ProductForm, ProductResponse } from '../../interface/Product_interface';
import ProductDetailModal from '../../components/products/ProductDetailModal'; // Import modal
import { Button, Dialog, DialogContent, DialogTitle, Pagination, Container, Box, Typography, Divider, IconButton, Slider } from '@mui/material';
import { motion } from 'framer-motion'
import { toast, ToastContainer } from 'react-toastify';
import { getCategories } from '../../service/apiService';
import { Category } from '../../interface/ServiceSPA_interface';
import axios from 'axios';
import { Package, CircleDollarSign, X, ShoppingCart } from 'lucide-react';
import CartProductModal from '../../components/products/CartProductModal';
// import { useNavigate } from "react-router-dom";


// import { getProducts, createOrder } from "../../service/apiProduct";
// import { ProductResponse, OrderRequest } from "../../interface/Product_interface";

const pageSize = 8

const SanPham: React.FC = () => {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCartModalOpen, setIsCartModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [open, setOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [activeSort, setActiveSort] = useState('option:noibat');
    // const navigate = useNavigate();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [, setQuantityToAdd] = useState(1);

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

    // Cách 2
    // const handleCategory = (e: number) => {
    //     console.log("e", e);
    //     const filtered = [...allProducts].filter((product) => product.category.id === e);
    //     setProducts(filtered);
    // };

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
    // const handleBookingClick = (product: unknown) => {
    //     const user = localStorage.getItem("user");
    
    //     if (!user) {
    //         alert("Vui lòng đăng nhập để đặt lịch.");
    //         navigate("/login");
    //         return;
    //     }
    //     const selectedProduct = product;
    
    //     navigate("/booking", { state: { selectedProduct } });
    // };

    const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);

    // State để lưu khoảng giá
    const DEFAULT_PRICE_RANGE = [50000, 1000000];
    const [priceRange, setPriceRange] = useState<number[]>(DEFAULT_PRICE_RANGE);
    useEffect(() => {
        setPriceRange(DEFAULT_PRICE_RANGE);
    }, [selectedCategoryId]);

    const [isFilteredByPrice, setIsFilteredByPrice] = useState(false);

    // Lọc danh sách sản phẩm
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
        fetchCategory();
    }, []);

    // Tải danh sách sản phẩm
    const fetchProducts = async () => {
        try {
            const response = await getProducts(); // Thay bằng API thực tế
            setProducts(response);         // Hiển thị ban đầu
            setAllProducts(response);      // Ghi vào bộ lọc gốc
            
            // const now = new Date();
            // const sortedProducts = response.sort((a: ProductResponse, b: ProductResponse) => {
            //     const dateA = new Date(a.createdAt);
            //     const dateB = new Date(b.createdAt);
            //     return dateB.getTime() - dateA.getTime();
            // })
            // setProducts(sortedProducts.map((product: ProductResponse) => ({
            //     ...product,
            //     isNew: (now.getTime() - new Date(product.createdAt).getTime()) / 1000 < 60,
            // })));
        } catch (error: unknown) {
            console.error('Lỗi tải danh sách sản phẩm:', error);
        }
    };

    const fetchCategory = async () => {
        try {
            const response = await getCategories();
            setCategories(response);
        } catch (error) {
            console.error('Error fetching category:', error);
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

    const handleViewCart = (product: ProductResponse) => {
        setSelectedProduct(products.find(p => p.id === product.id) || null);
        setIsCartModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false); // Đóng modal
    };

    const handleCloseCartModal = () => {
        setSelectedProduct(null);
        setIsCartModalOpen(false); // Đóng modal
    };

    // Xóa sản phẩm
    const handleDeleteProduct = async (productId: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm không?")) return;

        try {
            await deleteProduct(productId);
            setProducts(products.filter((product) => product.id !== productId));
            toast.success('Xóa sản phẩm thành công!');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.code === 1006) {
                toast.warn("Không thể xóa do sản phẩm này đã được bán!");
                console.log(error.response?.data?.message);
                
              }
              else {
                toast.error("Có lỗi xảy ra khi gửi yêu cầu.");
                console.error("Lỗi không xác định:", error);
              }
        }
    }

    // Cập nhật sản phẩm
    const handleUpdateProduct = async (productId: number, formData: FormData) => {
        try {
            const productForm: ProductForm = {
                nameProduct: formData.get('nameProduct') as string,
                description: formData.get('description') as string,
                price: Number(formData.get('price')),
                categoryId: Number(formData.get('categoryId')),
                quantity: Number(formData.get('quantity')),
            };
            const response = await updateProduct(productId, productForm);
            // Cập nhật state products với dữ liệu mới từ response
            setProducts(products.map(product =>
                product.id === productId ? response : product
            ));
            toast.success('Cập nhật sản phẩm thành công!');
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
            toast.error('Cập nhật sản phẩm thất bại!');
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
                                    // onClick={() => handleCategory(category.categoryId)}
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

                                            {/* <Typography fontSize={14}>{product.category.id}</Typography> */}

                                            {/* <Typography fontSize={14}>Xếp ds sp mới nhất: {product.id}</Typography> */}
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

                                            <div className="py-2 border-t border-gray-200 flex justify-between items-center">
                                                <button
                                                    onClick={() => handleViewCart(product)}
                                                    title="Thêm vào giỏ hàng"
                                                    className="flex items-center gap-1 bg-blue-100 hover:bg-blue-400 hover:text-white text-gray-700 font-medium py-1.5 px-4 rounded-md text-sm transition-colors"
                                                >
                                                    <Package className="w-4 h-4" />
                                                    Thêm
                                                </button>

                                                <button
                                                    // onClick={() => handleBuyNow(product)}
                                                    className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-1.5 px-4 rounded-md text-sm transition-colors"
                                                >
                                                    Mua ngay
                                                </button>
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

                            <p className="text-gray-700 mb-4 leading-relaxed">
                                <strong className="text-gray-900">Mô tả:</strong> {selectedProduct.description}
                            </p>

                            <p className="text-gray-600 mb-2">Giá: <span className="text-orange-500 font-semibold">{selectedProduct.price.toLocaleString("vi-VN")} VND</span></p>

                            <p className="text-gray-600">Còn: {selectedProduct.quantity}</p>

                        </DialogContent>
                    </>
                )}
            </Dialog>

            {/* Gọi component Modal và truyền props */}
            {isModalOpen && (
                <ProductDetailModal
                    product={selectedProduct}
                    categories={categories}
                    onClose={handleCloseModal}
                    handleDeleteProduct={handleDeleteProduct}
                    onUpdate={handleUpdateProduct}
                />
            )}

            {isCartModalOpen && (
                <CartProductModal
                    product={selectedProduct}
                    onClose={handleCloseCartModal}
                />
            )}            
        </motion.div>
    );
};

export default SanPham;