import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/payments'; 

// Tạo giao dịch VNPay
export const createVNPayPayment = async (userId: number, amount: number): Promise<string> => {
    try {
        // Gửi yêu cầu POST để tạo giao dịch VNPay
        const response = await axios.post(`${API_BASE_URL}/vnpay`, { userId, amount });
        
        // Kiểm tra nếu API trả về paymentUrl
        if (response.data && response.data.paymentUrl) {
            return response.data.paymentUrl; // Trả về URL thanh toán
        } else {
            throw new Error('Payment URL not found in response');
        }
    } catch (error) {
        console.error('Error creating VNPay payment:', error);
        throw new Error('Failed to create VNPay payment');
    }
};
