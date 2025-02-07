
import MenuDrawer from '../../components/menu/MenuDrawer';
import Bar from '../../components/taskbar/Bar';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Taskbar */}
      <div className="flex-shrink-0">
        <Bar />
      </div>
      {/* Main content area */}
      <div className="flex flex-grow overflow-hidden">
        {/* Menu Drawer */}       
          <MenuDrawer />

      </div>
    </div>
  );
};

export default Home;
