import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PostTodo } from '../api/api';
import {
  handleChangeAuthUsername,
  handleChangeAuthEmail,
  handleChangeAuthPassword,
  handleChangeAuthConfirmPassword,
  clearAuthForm,
  setCurrentUser
} from '../reducers/todoSlice';

export default function LoginSignup() {
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Получаем данные из Redux store
  const { authData, currentUser, isLoading, error } = useSelector(state => state.counter);
  
  // Если пользователь уже авторизован, перенаправляем на dashboard
  useEffect(() => {
    if (currentUser) {
      navigate('/Second_Page');
    }
  }, [currentUser, navigate]);
  
  // Обработчики для формы регистрации
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    
    switch(name) {
      case 'username':
        dispatch(handleChangeAuthUsername(value));
        break;
      case 'email':
        dispatch(handleChangeAuthEmail(value));
        break;
      case 'password':
        dispatch(handleChangeAuthPassword(value));
        break;
      case 'confirmPassword':
        dispatch(handleChangeAuthConfirmPassword(value));
        break;
      default:
        break;
    }
  };
  
  // Обработчики для формы логина
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    
    switch(name) {
      case 'loginUsername':
        dispatch(handleChangeAuthUsername(value));
        break;
      case 'loginPassword':
        dispatch(handleChangeAuthPassword(value));
        break;
      default:
        break;
    }
  };
  
  // Функция для обработки логина
  const handleLogin = async () => {
    // Проверка на заполненность полей
    if (!authData.username || !authData.password) {
      alert("Please fill in all required fields!");
      return;
    }
    
    try {
      // Получаем всех пользователей
      const response = await fetch('https://68f7ae53f7fb897c6616c7c0.mockapi.io/Auth');
      const users = await response.json();
      
      // Ищем пользователя по username и паролю
      const foundUser = users.find(user => 
        user.name === authData.username && 
        user.password === authData.password
      );
      
      if (foundUser) {
        // Сохраняем пользователя в Redux и localStorage
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password; // Удаляем пароль из объекта
        
        dispatch(setCurrentUser(userWithoutPassword));
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        alert('Login successful!');
        navigate('/Second_Page');
      } else {
        alert('Invalid username or password!');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };
  
  // Функция для обработки регистрации
  const handleRegister = () => {
    // Проверка на совпадение паролей
    if (authData.password !== authData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    // Проверка на заполненность полей
    if (!authData.username || !authData.email || !authData.password) {
      alert("Please fill in all required fields!");
      return;
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authData.email)) {
      alert("Please enter a valid email address!");
      return;
    }
    
    // Создаем объект пользователя для отправки на API
    const newUser = {
      name: authData.username,
      email: authData.email,
      password: authData.password,
      image: 'https://via.placeholder.com/100',
      contact: '', 
      country: '',
      status: true,
      age: Math.floor(Math.random() * 50) + 20
    };
    
    // Отправляем данные на API
    dispatch(PostTodo(newUser))
      .then((response) => {
        if (response.type === 'counter/PostTodo/fulfilled') {
          alert('Registration successful! You can now login.');
          // Сбрасываем форму
          dispatch(clearAuthForm());
          // Переключаем обратно на логин
          setToggle(false);
        } else {
          throw new Error('Registration failed');
        }
      })
      .catch((error) => {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
      });
  };

  // Очищаем поля при переключении между формами
  const handleToggleSignup = () => {
    dispatch(clearAuthForm());
    setToggle(true);
  };

  const handleToggleLogin = () => {
    dispatch(clearAuthForm());
    setToggle(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] p-4 text-white font-[Poppins] 2xs:p-2">
      <div
        className={`relative w-full max-w-[800px] h-[500px] border-2 border-cyan-400 shadow-[0_0_25px_#00d4ff] overflow-hidden transition-all duration-700 2xs:h-[400px] 2xs:max-w-[95%] ${
          toggle ? "toggled" : ""
        }`}
      >
        {/* ----------- SHAPES ----------- */}
        <div
          className={`absolute right-0 -top-1 h-[600px] w-[850px] bg-linear-to-br from-[#1a1a2e] to-cyan-400 rotate-10 skew-y-40 origin-bottom-right transition-all duration-1500 2xs:h-[500px] 2xs:w-[700px] ${
            toggle && "rotate-0! skew-y-0! delay-500"
          }`}
        />
        <div
          className={`absolute left-[250px] top-full h-[700px] w-[850px] bg-[#1a1a2e] border-t-4 border-cyan-400 transition-all duration-1500 origin-bottom-left 2xs:h-[600px] 2xs:w-[700px] 2xs:left-[200px] ${
            toggle && "-rotate-11 -skew-y-41 delay-1200"
          }`}
        />

        {/* ----------- LOGIN PANEL ----------- */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-10 transition-all duration-700 2xs:px-6 ${
            toggle ? "-translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"
          }`}
        >
          <h2 className="text-3xl text-center mb-4 2xs:text-2xl">Login</h2>

          {/* USERNAME */}
          <div className="relative mt-6 2xs:mt-4">
            <input
              type="text"
              name="loginUsername"
              required
              value={authData.username}
              onChange={handleLoginChange}
              className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6 2xs:py-1.5"
            />
            <label className="
              absolute left-0 top-1/2 -translate-y-1/2 text-white/60 
              transition-all duration-300
              peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
              peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              2xs:peer-focus:text-xs 2xs:peer-valid:text-xs
            ">
              Username
            </label>
            <FaUser className="absolute right-0 top-1/2 -translate-y-1/2 2xs:text-sm" />
          </div>

          {/* PASSWORD */}
          <div className="relative mt-6 2xs:mt-4">
            <input
              type="password"
              name="loginPassword"
              required
              value={authData.password}
              onChange={handleLoginChange}
              className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6 2xs:py-1.5"
            />
            <label className="
              absolute left-0 top-1/2 -translate-y-1/2 text-white/60
              transition-all duration-300
              peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
              peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              2xs:peer-focus:text-xs 2xs:peer-valid:text-xs
            ">
              Password
            </label>
            <FaLock className="absolute right-0 top-1/2 -translate-y-1/2 2xs:text-sm" />
          </div>

          <button 
            onClick={handleLogin}
            className="mt-8 w-full py-2 border-2 border-cyan-400 rounded-full relative overflow-hidden group hover:cursor-pointer 2xs:mt-6 2xs:py-1.5 2xs:text-sm"
            disabled={isLoading}
          >
            <span className="relative z-10">
              {isLoading ? "Loading..." : "Login"}
            </span>
            <div className="absolute inset-0 -top-full group-hover:-bottom-full group-hover:top-0 transition-all duration-500 bg-linear-to-b from-[#1a1a2e] via-cyan-400 to-[#1a1a2e]"/>
          </button>

          <p className="text-center mt-4 text-sm 2xs:mt-3 2xs:text-xs">
            Don't have an account? <br />
            <button onClick={handleToggleSignup} className="text-cyan-400 underline 2xs:text-sm">
              Sign Up
            </button>
          </p>
        </div>

        {/* ----------- LOGIN WELCOME ----------- */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center px-20 text-right transition-all duration-700 2xs:px-10 ${
            toggle ? "translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"
          }`}
        >
          <h2 className="text-4xl 2xs:text-2xl">WELCOME BACK!</h2>
        </div>

        {/* ----------- SIGNUP PANEL ----------- */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center px-16 transition-all duration-700 2xs:px-8 ${
            toggle ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
          }`}
        >
          <h2 className="text-3xl text-center mb-4 2xs:text-2xl">Register</h2>

          {/* USERNAME */}
          <div className="relative mt-6 2xs:mt-4">
            <input
              type="text"
              name="username"
              required
              value={authData.username}
              onChange={handleSignupChange}
              className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6 2xs:py-1.5"
            />
            <label className="
              absolute left-0 top-1/2 -translate-y-1/2 text-white/60 
              transition-all duration-300
              peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
              peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              2xs:peer-focus:text-xs 2xs:peer-valid:text-xs
            ">
              Username
            </label>
            <FaUser className="absolute right-0 top-1/2 -translate-y-1/2 2xs:text-sm" />
          </div>

          {/* EMAIL */}
          <div className="relative mt-6 2xs:mt-4">
            <input
              type="email"
              name="email"
              required
              value={authData.email}
              onChange={handleSignupChange}
              className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6 2xs:py-1.5"
            />
            <label className="
              absolute left-0 top-1/2 -translate-y-1/2 text-white/60 
              transition-all duration-300
              peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
              peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              2xs:peer-focus:text-xs 2xs:peer-valid:text-xs
            ">
              Email
            </label>
            <FaEnvelope className="absolute right-0 top-1/2 -translate-y-1/2 2xs:text-sm" />
          </div>

          {/* PASSWORD */}
          <div className="relative mt-6 2xs:mt-4">
            <input
              type="password"
              name="password"
              required
              value={authData.password}
              onChange={handleSignupChange}
              className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6 2xs:py-1.5"
            />
            <label className="
              absolute left-0 top-1/2 -translate-y-1/2 text-white/60 
              transition-all duration-300
              peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
              peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              2xs:peer-focus:text-xs 2xs:peer-valid:text-xs
            ">
              Password
            </label>
            <FaLock className="absolute right-0 top-1/2 -translate-y-1/2 2xs:text-sm" />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative mt-6 2xs:mt-4">
            <input
              type="password"
              name="confirmPassword"
              required
              value={authData.confirmPassword}
              onChange={handleSignupChange}
              className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6 2xs:py-1.5"
            />
            <label className="
              absolute left-0 top-1/2 -translate-y-1/2 text-white/60 
              transition-all duration-300
              peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
              peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              2xs:peer-focus:text-xs 2xs:peer-valid:text-xs
            ">
              Confirm password
            </label>
            <FaLock className="absolute right-0 top-1/2 -translate-y-1/2 2xs:text-sm" />
          </div>

          <button 
            onClick={handleRegister}
            className="mt-8 w-full py-2 border-2 border-cyan-400 rounded-full relative overflow-hidden group hover:cursor-pointer 2xs:mt-6 2xs:py-1.5 2xs:text-sm"
            disabled={isLoading}
          >
            <span className="relative z-10">
              {isLoading ? "Registering..." : "Register"}
            </span>
            <div className="absolute inset-0 -top-full group-hover:top-0 transition-all duration-500 bg-linear-to-b from-[#1a1a2e] via-cyan-400 to-[#1a1a2e]" />
          </button>

          <p className="text-center mt-4 text-sm 2xs:mt-3 2xs:text-xs">
            Already have an account? <br />
            <button onClick={handleToggleLogin} className="text-cyan-400 underline 2xs:text-sm">
              Sign In
            </button>
          </p>
        </div>

        {/* ----------- SIGNUP WELCOME ----------- */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-20 transition-all duration-700 2xs:px-10 ${
            toggle ? "translate-x-0 opacity-100" : "-translate-x-[120%] opacity-0"
          }`}
        >
          <h2 className="text-4xl 2xs:text-2xl">WELCOME!</h2>
        </div>
      </div>
    </div>
  );
}