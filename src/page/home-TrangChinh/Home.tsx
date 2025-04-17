import TrangChu from '../../components/home/TrangChu';
import NoiDung from '../../components/menu/NoiDung';
import MenuDrawer from '../../components/menu/MenuDrawer';
import Menu from '../../components/menu/Menu';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* TrangChu - Luôn hiển thị khi cuộn */}
      {/* <div className="sticky top-0 z-50 bg-white shadow-md">
        <TrangChu />
      </div> */}

      <div className="sticky top-0 z-50 bg-white shadow-md">
        <Menu />
      </div>

      {/* Main content area */}
      {/* <div className="flex flex-grow overflow-hidden">
        Menu Drawer
          <MenuDrawer />
      </div> */}

      {/* NoiDung */}
      {/* <div className="flex-1 overflow-y-auto">
        <NoiDung />
      </div> */}
    </div>
  );
};

export default Home;
