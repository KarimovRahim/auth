import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaSignOutAlt, 
  FaGlobe, 
  FaMapMarkerAlt, 
  FaCalendarAlt,
  FaUsers,
  FaHeart,
  FaCompass,
  FaChartLine,
  FaCog,
  FaBars
} from 'react-icons/fa';
import { setCurrentUser } from '../reducers/todoSlice';

const SecondPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.counter);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const savedUser = localStorage.getItem('currentUser');
    if (!currentUser && savedUser) {
      dispatch(setCurrentUser(JSON.parse(savedUser)));
    } else if (!currentUser && !savedUser) {
      navigate('/');
    }
  }, [currentUser, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const travelStats = [
    { label: 'Countries Visited', value: 12, icon: <FaGlobe className="text-2xl 2xs:text-xl" />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Trips Planned', value: 5, icon: <FaCalendarAlt className="text-2xl 2xs:text-xl" />, color: 'from-purple-500 to-pink-500' },
    { label: 'Friends', value: 47, icon: <FaUsers className="text-2xl 2xs:text-xl" />, color: 'from-green-500 to-emerald-500' },
    { label: 'Reviews', value: 23, icon: <FaHeart className="text-2xl 2xs:text-xl" />, color: 'from-red-500 to-orange-500' },
  ];

  const recentActivities = [
    { action: 'Added review for Paris', time: '2 hours ago' },
    { action: 'Connected with Alex', time: '1 day ago' },
    { action: 'Planned trip to Japan', time: '3 days ago' },
    { action: 'Shared photos from Italy', time: '1 week ago' },
  ];

  const upcomingTrips = [
    { destination: 'Tokyo, Japan', date: 'Mar 15-22, 2024', status: 'Confirmed' },
    { destination: 'Bali, Indonesia', date: 'Jun 5-15, 2024', status: 'Planned' },
    { destination: 'Swiss Alps', date: 'Dec 20-30, 2024', status: 'Planning' },
  ];

  // Если пользователь не авторизован, показываем загрузку
  if (!currentUser && !localStorage.getItem('currentUser')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Используем текущего пользователя или из localStorage
  const user = currentUser || JSON.parse(localStorage.getItem('currentUser'));

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 2xs:px-3">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaCompass className="h-8 w-8 text-cyan-600 2xs:h-6 2xs:w-6" />
              <span className="ml-2 text-xl font-bold text-gray-800 2xs:text-lg">TravelConnect</span>
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 2xs:p-1"
            >
              <FaBars className="h-5 w-5" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 2xl:space-x-8">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <FaChartLine className="h-5 w-5" />
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <FaCog className="h-5 w-5" />
              </button>
              
              <div className="relative group">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <img 
                    src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                    alt={user.name}
                    className="h-10 w-10 rounded-full border-2 border-cyan-500 2xl:h-12 2xl:w-12"
                  />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-700 2xl:text-base">{user.name}</p>
                    <p className="text-xs text-gray-500 2xl:text-sm">{user.email}</p>
                  </div>
                </div>
                
                <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block 2xl:w-56">
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left 2xl:text-base">
                    <FaUser className="inline mr-2" /> Profile
                  </button>
                  <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left 2xl:text-base">
                    <FaCog className="inline mr-2" /> Settings
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left 2xl:text-base"
                  >
                    <FaSignOutAlt className="inline mr-2" /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white border-t">
              <div className="py-4 px-3 space-y-3">
                <div className="flex items-center space-x-3 pb-3 border-b">
                  <img 
                    src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                    alt={user.name}
                    className="h-10 w-10 rounded-full border-2 border-cyan-500"
                  />
                  <div>
                    <p className="font-medium text-gray-700">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <button className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  <FaChartLine className="mr-3" />
                  Stats
                </button>
                <button className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  <FaCog className="mr-3" />
                  Settings
                </button>
                <button className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  <FaUser className="mr-3" />
                  Profile
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded mt-2"
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 2xs:px-3 2xs:py-4">
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-cyan-600 to-blue-700 rounded-2xl shadow-xl p-8 mb-8 text-white 2xs:p-4 2xs:mb-4 2xs:rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="2xs:w-full">
              <h1 className="text-3xl font-bold mb-2 2xs:text-xl 2xs:mb-1">Welcome back, {user.name}! 👋</h1>
              <p className="text-cyan-100 2xs:text-sm">Ready for your next adventure? The world is waiting for you.</p>
              <div className="flex items-center mt-4 space-x-4 2xs:mt-2 2xs:space-x-2 2xs:flex-wrap 2xs:gap-2">
                <div className="flex items-center 2xs:text-sm">
                  <FaMapMarkerAlt className="mr-2 2xs:mr-1" />
                  <span>{user.country || 'Global Citizen'}</span>
                </div>
                <div className="flex items-center 2xs:text-sm">
                  <FaUser className="mr-2 2xs:mr-1" />
                  <span>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button className="mt-4 md:mt-0 px-6 py-3 bg-white text-cyan-700 font-semibold rounded-lg hover:bg-cyan-50 transition-all transform hover:scale-105 2xs:mt-3 2xs:px-4 2xs:py-2 2xs:text-sm">
              Plan New Trip
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 2xs:gap-3">
          {travelStats.map((stat, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 2xs:p-4 2xs:rounded-lg ${
                stat.color === 'from-blue-500 to-cyan-500' ? 'border-blue-500' :
                stat.color === 'from-purple-500 to-pink-500' ? 'border-purple-500' :
                stat.color === 'from-green-500 to-emerald-500' ? 'border-green-500' :
                'border-red-500'
              }`}
            >
              <div className="flex items-center justify-between mb-4 2xs:mb-3">
                <div className={`p-3 rounded-lg bg-linear-to-r ${stat.color} text-white 2xs:p-2`}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-800 2xs:text-2xl">{stat.value}</p>
                  <p className="text-sm text-gray-600 2xs:text-xs">{stat.label}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 2xs:text-[10px]">Updated today</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 2xs:gap-4">
          {/* Left Column - Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 2xs:p-4 2xs:mb-4 2xs:rounded-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4 2xs:text-lg 2xs:mb-3">Recent Activities</h2>
              <div className="space-y-4 2xs:space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors 2xs:p-2">
                    <div className="h-10 w-10 rounded-full bg-linear-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white mr-4 2xs:h-8 2xs:w-8 2xs:mr-3">
                      {activity.action.includes('review') ? '📝' : 
                       activity.action.includes('Connected') ? '🤝' : 
                       activity.action.includes('Planned') ? '🗓️' : '📸'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 2xs:text-sm truncate">{activity.action}</p>
                      <p className="text-sm text-gray-500 2xs:text-xs">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Trips */}
            <div className="bg-white rounded-xl shadow-lg p-6 2xs:p-4 2xs:rounded-lg">
              <div className="flex justify-between items-center mb-4 2xs:mb-3">
                <h2 className="text-xl font-bold text-gray-800 2xs:text-lg">Upcoming Trips</h2>
                <button className="text-cyan-600 hover:text-cyan-700 font-medium 2xs:text-sm">
                  View All →
                </button>
              </div>
              <div className="space-y-4 2xs:space-y-3">
                {upcomingTrips.map((trip, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition-colors 2xs:p-3">
                    <div className="flex flex-col 2xs:flex-row 2xs:items-start justify-between 2xs:gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 2xs:text-sm truncate">{trip.destination}</h3>
                        <p className="text-sm text-gray-600 flex items-center mt-1 2xs:text-xs">
                          <FaCalendarAlt className="mr-2 2xs:mr-1 shrink-0" /> 
                          <span className="truncate">{trip.date}</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium mt-2 2xs:mt-0 2xs:px-2 ${
                        trip.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        trip.status === 'Planned' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {trip.status}
                      </span>
                    </div>
                    <div className="mt-3 flex space-x-3 2xs:space-x-2">
                      <button className="flex-1 py-2 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-colors text-sm font-medium 2xs:py-1.5 2xs:text-xs">
                        View Details
                      </button>
                      <button className="flex-1 py-2 border border-cyan-600 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors text-sm font-medium 2xs:py-1.5 2xs:text-xs">
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Profile & Recommendations */}
          <div className="space-y-6 2xs:space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 2xs:p-4 2xs:rounded-lg">
              <div className="text-center">
                <img 
                  src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                  alt={user.name}
                  className="h-24 w-24 rounded-full mx-auto border-4 border-cyan-100 mb-4 2xs:h-20 2xs:w-20 2xs:mb-3"
                />
                <h3 className="text-xl font-bold text-gray-800 2xs:text-lg">{user.name}</h3>
                <p className="text-gray-600 mb-2 2xs:text-sm 2xs:mb-1 truncate">{user.email}</p>
                <div className="flex items-center justify-center space-x-2 mb-4 2xs:space-x-1 2xs:mb-3">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium 2xs:px-2">
                    {user.status ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium 2xs:px-2">
                    {user.age || '25'} years
                  </span>
                </div>
                <button className="w-full py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-all font-medium 2xs:text-sm">
                  Edit Profile
                </button>
              </div>
              
              <div className="mt-6 space-y-3 2xs:mt-4 2xs:space-y-2">
                <div className="flex justify-between 2xs:text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between 2xs:text-sm">
                  <span className="text-gray-600">Travel Level</span>
                  <span className="font-medium text-cyan-600">Explorer</span>
                </div>
                <div className="flex justify-between 2xs:text-sm">
                  <span className="text-gray-600">Preferred Destinations</span>
                  <span className="font-medium">Europe, Asia</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6 2xs:p-4 2xs:rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 2xs:text-base 2xs:mb-3">Travel Recommendations</h3>
              <div className="space-y-3 2xs:space-y-2">
                <div className="p-3 bg-linear-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-100 2xs:p-2">
                  <p className="font-medium text-gray-800 2xs:text-sm">Based on your interests:</p>
                  <p className="text-sm text-gray-600 mt-1 2xs:text-xs">Consider visiting Kyoto this spring for cherry blossoms</p>
                </div>
                <div className="p-3 bg-linear-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 2xs:p-2">
                  <p className="font-medium text-gray-800 2xs:text-sm">Popular with friends:</p>
                  <p className="text-sm text-gray-600 mt-1 2xs:text-xs">5 of your friends loved Santorini, Greece</p>
                </div>
                <div className="p-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 2xs:p-2">
                  <p className="font-medium text-gray-800 2xs:text-sm">Budget-friendly:</p>
                  <p className="text-sm text-gray-600 mt-1 2xs:text-xs">Vietnam offers amazing value this season</p>
                </div>
              </div>
              <button className="w-full mt-4 py-2 border-2 border-cyan-600 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors font-medium 2xs:mt-3 2xs:text-sm">
                Explore More
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6 2xs:p-4 2xs:rounded-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4 2xs:text-base 2xs:mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3 2xs:gap-2">
                <button className="p-3 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition-colors 2xs:p-2 2xs:text-sm">
                  ✈️ Book Flight
                </button>
                <button className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors 2xs:p-2 2xs:text-sm">
                  🏨 Find Hotel
                </button>
                <button className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors 2xs:p-2 2xs:text-sm">
                  📝 Write Review
                </button>
                <button className="p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors 2xs:p-2 2xs:text-sm">
                  👥 Add Friend
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 2xs:mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6 2xs:px-3 2xs:py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left 2xs:mb-3">
              <div className="flex items-center justify-center md:justify-start">
                <FaCompass className="h-6 w-6 text-cyan-600 mr-2 2xs:h-5 2xs:w-5" />
                <span className="text-lg font-bold text-gray-800 2xs:text-base">TravelConnect</span>
              </div>
              <p className="text-gray-600 text-sm mt-1 2xs:text-xs">Connecting travelers worldwide since 2024</p>
            </div>
            <div className="flex space-x-6 2xs:space-x-4 2xs:flex-wrap 2xs:justify-center 2xs:gap-2">
              <a href="#" className="text-gray-600 hover:text-cyan-600 2xs:text-sm">About</a>
              <a href="#" className="text-gray-600 hover:text-cyan-600 2xs:text-sm">Help Center</a>
              <a href="#" className="text-gray-600 hover:text-cyan-600 2xs:text-sm">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-cyan-600 2xs:text-sm">Terms</a>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-500 text-sm 2xs:mt-4 2xs:text-xs">
            © 2024 TravelConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SecondPage;