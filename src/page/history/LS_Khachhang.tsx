import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';

const LichSuKhachHang: React.FC = () => {
  // Dữ liệu mẫu lịch sử khách hàng và thanh toán
  const customerHistory = [
    { date: '2025-01-01', customer: 'Nguyễn Văn A', service: 'Massage toàn thân', amount: 500000 },
    { date: '2025-01-02', customer: 'Lê Thị B', service: 'Chăm sóc da mặt', amount: 300000 },
    { date: '2025-01-03', customer: 'Trần Văn C', service: 'Xông hơi', amount: 200000 },
    { date: '2025-01-04', customer: 'Hoàng Thị D', service: 'Trị liệu cổ vai gáy', amount: 250000 },
  ];

  return (
    <div className="flex flex-col p-6 gap-8">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        className="text-gray-700 font-semibold"
      >
        Lịch Sử Khách Hàng - Thanh Toán Dịch Vụ
      </Typography>

      {/* Row 1: Bảng lịch sử thanh toán */}
      <Card className="shadow-md">
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            className="text-gray-800 font-medium"
          >
            Lịch sử thanh toán dịch vụ
          </Typography>
          <Box className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold text-gray-600">Ngày sử dụng</TableCell>
                  <TableCell className="font-bold text-gray-600">Khách hàng</TableCell>
                  <TableCell className="font-bold text-gray-600">Dịch vụ</TableCell>
                  <TableCell className="font-bold text-gray-600">Số tiền thanh toán</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customerHistory.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-100">
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.service}</TableCell>
                    <TableCell>{row.amount.toLocaleString()} VNĐ</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default LichSuKhachHang;
