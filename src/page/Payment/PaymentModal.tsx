import { XIcon } from 'lucide-react';
import { AppointmentResponse } from '../../interface/AppointmentForm_interface';
import { useState } from 'react';
import { createPayment, saveGooglePayPaymentInfo } from '../../service/apiPayment'; // Import hàm createPayment
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import { Payment } from '@mui/icons-material';
import GooglePayButton from '@google-pay/button-react';

interface Props {
    open: boolean;
    onClose: () => void;
    appointment: AppointmentResponse | null;
    onUpdateSuccess?: () => void;
}
const PaymentModal: React.FC<Props> = ({ open, onClose, appointment, onUpdateSuccess }) => {
    const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
    const [discountError, setDiscountError] = useState("");
    const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
    const [discountCode, setDiscountCode] = useState("");
    const [isProcessingPayment, setIsProcessingPayment] = useState(false); // State để theo dõi trạng thái thanh toán
    const navigation = useNavigate();


    if (!open || !appointment) return null;

    const handleApplyDiscount = async () => {
        setIsApplyingDiscount(true);
        setDiscountError("");
        // **PLACEHOLDER: Gọi API kiểm tra mã giảm giá ở đây**
        setTimeout(() => {
            if (discountCode === "GIAMGIA10") {
                const discountAmount = appointment.totalPrice * 0.1; // Giảm 10%
                setDiscountedPrice(appointment.totalPrice - discountAmount);
            } else if (discountCode !== "") {
                setDiscountError("Mã giảm giá không hợp lệ.");
                setDiscountedPrice(null);
            } else {
                setDiscountedPrice(null); // Không có mã hoặc mã không hợp lệ, giữ nguyên giá gốc
            }
            setIsApplyingDiscount(false);
        }, 500);
    };

    const handleProceedPayment = async () => {
        setIsProcessingPayment(true);
        try {
            const amountToPay = discountedPrice !== null ? discountedPrice : appointment.totalPrice;
            const paymentData = {
                appointmentId: appointment.id,
                amount: amountToPay,
                // Bạn có thể cần truyền thêm thông tin khác tùy thuộc vào API của bạn
            };
            const paymentResponse = await createPayment(paymentData);

            // Nếu API trả về URL thanh toán, chuyển hướng người dùng
            if (paymentResponse && paymentResponse.paymentUrl) {
                window.location.href = paymentResponse.paymentUrl;
                onClose(); // Đóng modal sau khi chuyển hướng
            } else {
                // Xử lý trường hợp không có URL thanh toán trong response
                console.error("Không nhận được URL thanh toán từ server:", paymentResponse);
                // Hiển thị thông báo lỗi cho người dùng
            }
        } catch (error: unknown) {
            console.error("Lỗi khi tạo yêu cầu thanh toán:", error);
            // Hiển thị thông báo lỗi cho người dùng (ví dụ: dùng toast)
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const handleGooglePaySuccess = async (paymentData: any) => {
        setIsProcessingPayment(true);
        try {
          const payload = {
            appointmentId: appointment?.id,
            amount: discountedPrice !== null ? discountedPrice : appointment?.totalPrice,
            paymentMethodToken: paymentData.paymentMethodData.tokenizationData.token, // Lấy token từ paymentData
            transactionId: paymentData.paymentMethodData.transactionId, // Lấy transactionId (nếu có)
            // ... có thể cần thêm thông tin khác từ paymentData
          };
    
          const response = await saveGooglePayPaymentInfo(payload);
    
          if (response.status === 200) {
            console.log('Thanh toán Google Pay thành công và thông tin đã được lưu.');
            onClose();
            if (onUpdateSuccess) {
              onUpdateSuccess();
            }
          } else {
            console.error('Lỗi khi lưu thông tin thanh toán Google Pay:', response);
            // Xử lý lỗi
          }
        } catch (error: any) {
          console.error('Lỗi trong quá trình xử lý thanh toán Google Pay:', error);
          // Xử lý lỗi
        } finally {
          setIsProcessingPayment(false);
        }
      };
    
      const handleGooglePayError = (error: any) => {
        console.error('Lỗi thanh toán Google Pay:', error);
        setIsProcessingPayment(false);
        // Hiển thị thông báo lỗi cho người dùng
      };
    
      if (!open || !appointment) return null;
    
      const totalPriceToPay = discountedPrice !== null ? discountedPrice : appointment.totalPrice;
    // const handlePaymentGoogle = () => {
    //     navigation('/google-pay');
    // }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-xl shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
                >
                    <XIcon className="h-6 w-6" />
                </button>

                <h2 className="text-xl font-bold mb-4 text-center">Chi tiết thanh toán</h2>

                <div className="space-y-3">
                    <div>
                        <span className="font-medium">Khách hàng:</span> {appointment.userId?.name || appointment.gustName}
                    </div>
                    <div>
                        <span className="font-medium">Email:</span> {appointment.userId?.email || "Không có"}
                    </div>
                    <div>
                        <span className="font-medium">Số điện thoại:</span> {appointment.userId?.phone || "Không có"}
                    </div>
                    <div>
                        <span className="font-medium">Ngày hẹn:</span>{" "}
                        {new Date(appointment.appointmentDateTime).toLocaleString("vi-VN")}
                    </div>
                    <div>
                        <span className="font-medium">Tổng tiền:</span> {appointment.totalPrice.toLocaleString("vi-VN")}đ
                    </div>
                </div>

                <div>
                    <span className="font-medium">Dịch vụ đã chọn:</span>
                    <ul className="list-disc list-inside ml-4 mt-1 flex flex-col gap-y-2">
                        {appointment.serviceIds.map((service) => (
                            <li key={service.id} className="flex items-center gap-5 p-2 bg-green-200/50 rounded-lg">
                                <motion.img whileInView={{
                                    x: 0,
                                    y: 0,
                                    transition: { duration: 0.3 },
                                    scale: 1.1

                                }} src={service.images[0]} alt={service.name} className="w-16 h-16 object-cover rounded" />
                                <div className="flex flex-col ">
                                    <span className="font-medium text-[16px">{service.name}</span>
                                    <span className='text-gray-600'>Thời gian thực hiện: {service.duration} phút</span>
                                    <span className='text-gray-600'>Tag: {service.serviceType}</span>
                                </div>

                            </li>
                        ))}
                    </ul>
                </div>
                {appointment.notes && (
                    <div className='mt-4'>
                        <span className="font-medium">Ghi chú:</span> {appointment.notes}
                    </div>
                )}

                {/* Thêm input mã giảm giá */}
                <div className="mb-4 mt-4">
                    <label htmlFor="discountCode" className="block text-gray-700 text-sm font-bold mb-2">
                        Mã giảm giá (nếu có):
                    </label>
                    <input
                        type="text"
                        id="discountCode"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                    />
                    <button
                        onClick={handleApplyDiscount}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2 disabled:bg-gray-400"
                        disabled={isApplyingDiscount}
                    >
                        {isApplyingDiscount ? "Đang áp dụng..." : "Áp dụng"}
                    </button>
                    {discountError && <p className="text-red-500 text-xs italic mt-1">{discountError}</p>}
                    {discountedPrice !== null && (
                        <p className="text-green-500 font-semibold mt-2">
                            Tổng tiền sau giảm giá: {discountedPrice.toLocaleString("vi-VN")}đ
                        </p>
                    )}
                </div>

                <div className="">
                    <label htmlFor="">Chọn phương thức thanh toán:</label>
                    <div className="mb-4 mt-4 flex flex-col gap-2">
                        <GooglePayButton
                            className="w-full"
                            environment="TEST" // Chuyển sang "PRODUCTION" khi triển khai thực tế
                            buttonSizeMode="fill"
                            buttonColor="white"
                            paymentRequest={{
                                apiVersion: 2,
                                apiVersionMinor: 0,
                                allowedPaymentMethods: [
                                    {
                                        type: 'CARD',
                                        parameters: {
                                            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                            allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA'],
                                        },
                                        tokenizationSpecification: {
                                            type: 'PAYMENT_GATEWAY',
                                            parameters: {
                                                gateway: 'example', // Thay thế bằng tên gateway thực tế của bạn
                                                gatewayMerchantId: 'exampleGatewayMerchantId', // Thay thế bằng ID người bán gateway của bạn
                                            },
                                        },
                                    },
                                ],
                                merchantInfo: {
                                    merchantId: 'YOUR_GOOGLE_MERCHANT_ID', // **Quan trọng: Thay thế bằng Google Merchant ID thực tế của bạn**
                                    merchantName: 'NGUYEN HIEP - SPA ROYAL',
                                },
                                transactionInfo: {
                                    totalPriceStatus: 'FINAL',
                                    totalPrice: totalPriceToPay.toString(),
                                    currencyCode: 'VND',
                                    countryCode: 'VN',
                                },
                            }}
                            onLoadPaymentData={handleGooglePaySuccess}
                        
                            onError={handleGooglePayError}
                        />
                        <button
                            onClick={handleProceedPayment}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                            disabled={isProcessingPayment}
                        >
                            {isProcessingPayment ? "Đang tiến hành..." :
                                <div className='flex items-center gap-2'>
                                    <Payment />
                                    <p>Thanh toán VNPay</p>
                                </div>
                            }
                        </button>
                    </div>
                </div>


                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Đóng
                    </button>
                </div>

            </div>
        </div>
    );
}

export default PaymentModal