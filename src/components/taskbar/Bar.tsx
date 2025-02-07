import { AccountCircleOutlined, LogoutOutlined, NotificationsActiveOutlined, SettingsOutlined } from '@mui/icons-material';
import { Avatar, Badge, IconButton, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hook/AuthContext';
import { logout } from '../../service/apiService';

const Bar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { login, user, logoutContext } = useAuth();
    const navigation = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const handleLogin = () => {
        navigation('/login');
    };

    const handleRegister = () => {
        navigation('/register');
    };

    const handleProfile = () => {
        navigation('/profile');
    }
    const handleSettings = () => {
        navigation('/settings');
    }
    const handleLogout = async () => {
        try {
            await logout();
            logoutContext();
            setIsMenuOpen(false);

        } catch (error: any) {
            console.log('====================================');
            console.log('Error:', error.response?.data?.message || error.message);
            console.log('====================================');
        }
    };

    useEffect(() => {
        if (!user) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                login(JSON.parse(storedUser)); // Khôi phục user từ localStorage
            }
        }
    }, [user, login]);

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: 'ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }));

    return (
        <div className=" flex justify-end items-center  bg-white dark:bg-gray-800  text-gray-900 dark:text-white p-4" style={{
            borderBottom: '1px solid #e5e7eb',
        }}>
            {!user ? (
                <div className="flex space-x-4">
                    <button
                        onClick={handleLogin}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={handleRegister}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Đăng ký
                    </button>
                </div>
            ) : (
                <>
                    <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                        style={{ marginRight: '10px' }}
                    >
                        <Badge badgeContent={17} color="error">
                            <NotificationsActiveOutlined
                                style={{ color: 'gray', fontSize: '28px' }}
                            />
                        </Badge>
                    </IconButton>

                    <div className="relative">
                        <div
                            className="flex flex-col items-center cursor-pointer"
                            onClick={toggleMenu}
                        >
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar alt="Remy Sharp" src={user?.imageUrl} />
                            </StyledBadge>
                            <p className="mt-1 text-sm font-medium">{user?.name || 'Guest'}!</p>
                        </div>

                        {isMenuOpen && (
                            <div
                                className="absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg border"
                                style={{
                                    zIndex: 1000, // Đảm bảo dropdown nằm trên các phần tử khác
                                }}
                            >
                                <ul className="py-2">
                                    <li>
                                        <button className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full" onClick={handleProfile}>
                                            <AccountCircleOutlined /> Thông tin cá nhân
                                        </button>
                                    </li>
                                    <li>
                                        <button className="block px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 w-full" onClick={handleSettings}>
                                            <SettingsOutlined /> Cài đặt
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className="block px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100 w-full"
                                            onClick={handleLogout}
                                        >
                                            <LogoutOutlined /> Đăng xuất
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                </>
            )}
        </div>
    );
};

export default Bar;
