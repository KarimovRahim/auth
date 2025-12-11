import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentUser } from '../reducers/todoSlice';
import { FaUser, FaSignOutAlt, FaHome, FaCompass } from 'react-icons/fa';

const Layout = () => {
  const { currentUser } = useSelector(state => state.counter);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  // Если на странице логина и пользователь уже авторизован, перенаправляем на dashboard
  React.useEffect(() => {
    if (currentUser && location.pathname === '/') {
      navigate('/Second_Page');
    }
  }, [currentUser, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Показываем навигацию только если пользователь авторизован ИЛИ если не на странице логина */}
      {(currentUser || location.pathname !== '/') && (
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center space-x-2">
                  <FaCompass className="h-8 w-8 text-cyan-600" />
                  <span className="text-xl font-bold text-gray-800">TravelApp</span>
                </Link>
                
                {/* Навигационные ссылки */}
                <div className="hidden md:ml-10 md:flex md:space-x-8">
                  {currentUser ? (
                    <>
                      <Link 
                        to="/" 
                        className="text-gray-700 hover:text-cyan-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        <FaHome className="inline mr-1" /> Home
                      </Link>
                      <Link 
                        to="/Second_Page" 
                        className="text-gray-700 hover:text-cyan-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    <Link 
                      to="/" 
                      className="text-gray-700 hover:text-cyan-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <FaHome className="inline mr-1" /> Login
                    </Link>
                  )}
                </div>
              </div>

              {/* Правая часть навигации */}
              <div className="flex items-center space-x-4">
                {currentUser ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={currentUser.image || `https://ui-avatars.com/api/?name=${currentUser.name}&background=random`}
                        alt={currentUser.name}
                        className="h-8 w-8 rounded-full border border-cyan-500"
                      />
                      <span className="hidden md:inline text-sm font-medium text-gray-700">
                        {currentUser.name}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      <FaSignOutAlt />
                      <span className="hidden md:inline">Logout</span>
                    </button>
                  </>
                ) : (
                  location.pathname !== '/' && (
                    <Link
                      to="/"
                      className="flex items-center space-x-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                    >
                      <FaUser />
                      <span>Login</span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Основной контент */}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;