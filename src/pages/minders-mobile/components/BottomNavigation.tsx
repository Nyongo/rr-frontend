
import { Home, Route, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BottomNavigationProps {
  currentPage: 'home' | 'trips' | 'profile';
}

const BottomNavigation = ({ currentPage }: BottomNavigationProps) => {
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/minders-mobile/home',
      gradient: 'from-green-500 to-blue-500'
    },
    {
      id: 'trips',
      label: 'Trips',
      icon: Route,
      path: '/minders-mobile/trips',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/minders-mobile/profile',
      gradient: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-100">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                isActive 
                  ? 'transform scale-110' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${item.gradient} shadow-lg`
                  : 'bg-gray-100'
              }`}>
                <Icon 
                  className={`w-6 h-6 transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-gray-600'
                  }`} 
                />
              </div>
              <span className={`text-xs font-medium mt-1 transition-colors duration-300 ${
                isActive ? 'text-gray-800' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
              {isActive && (
                <div className={`w-6 h-1 bg-gradient-to-r ${item.gradient} rounded-full mt-1 animate-scale-in`}></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
