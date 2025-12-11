import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaArrowDown, FaArrowUp } from "react-icons/fa";
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a2e] p-4 text-white font-[Poppins]">
      {/* Desktop/Tablet View (оригинальный дизайн) */}
      <div className="hidden lg:block w-full">
        <div
          className={`relative w-full max-w-[800px] h-[500px] border-2 border-cyan-400 shadow-[0_0_25px_#00d4ff] overflow-hidden transition-all duration-700 mx-auto ${
            toggle ? "toggled" : ""
          }`}
        >
          {/* ----------- SHAPES ----------- */}
          <div
            className={`absolute right-0 -top-1 h-[600px] w-[850px] bg-linear-to-br from-[#1a1a2e] to-cyan-400 rotate-10 skew-y-40 origin-bottom-right transition-all duration-1500 ${
              toggle && "rotate-0! skew-y-0! delay-500"
            }`}
          />
          <div
            className={`absolute left-[250px] top-full h-[700px] w-[850px] bg-[#1a1a2e] border-t-4 border-cyan-400 transition-all duration-1500 origin-bottom-left ${
              toggle && "-rotate-11 -skew-y-41 delay-1200"
            }`}
          />

          {/* ----------- LOGIN PANEL ----------- */}
          <div
            className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-10 transition-all duration-700 ${
              toggle ? "-translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"
            }`}
          >
            <h2 className="text-3xl text-center mb-4">Login</h2>

            {/* USERNAME */}
            <div className="relative mt-6">
              <input
                type="text"
                name="loginUsername"
                required
                value={authData.username}
                onChange={handleLoginChange}
                className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6"
              />
              <label className="
                absolute left-0 top-1/2 -translate-y-1/2 text-white/60 
                transition-all duration-300
                peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
                peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              ">
                Username
              </label>
              <FaUser className="absolute right-0 top-1/2 -translate-y-1/2" />
            </div>

            {/* PASSWORD */}
            <div className="relative mt-6">
              <input
                type="password"
                name="loginPassword"
                required
                value={authData.password}
                onChange={handleLoginChange}
                className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6"
              />
              <label className="
                absolute left-0 top-1/2 -translate-y-1/2 text-white/60
                transition-all duration-300
                peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
                peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              ">
                Password
              </label>
              <FaLock className="absolute right-0 top-1/2 -translate-y-1/2" />
            </div>

            <button 
              onClick={handleLogin}
              className="mt-8 w-full py-2 border-2 border-cyan-400 rounded-full relative overflow-hidden group hover:cursor-pointer"
              disabled={isLoading}
            >
              <span className="relative z-10">
                {isLoading ? "Loading..." : "Login"}
              </span>
              <div className="absolute inset-0 -top-full group-hover:-bottom-full group-hover:top-0 transition-all duration-500 bg-linear-to-b from-[#1a1a2e] via-cyan-400 to-[#1a1a2e]"/>
            </button>

            <p className="text-center mt-4 text-sm">
              Don't have an account? <br />
              <button onClick={handleToggleSignup} className="text-cyan-400 underline">
                Sign Up
              </button>
            </p>
          </div>

          {/* ----------- LOGIN WELCOME ----------- */}
          <div
            className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center px-20 text-right transition-all duration-700 ${
              toggle ? "translate-x-[120%] opacity-0" : "translate-x-0 opacity-100"
            }`}
          >
            <h2 className="text-4xl">WELCOME BACK!</h2>
          </div>

          {/* ----------- SIGNUP PANEL ----------- */}
          <div
            className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center px-16 transition-all duration-700 ${
              toggle ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
            }`}
          >
            <h2 className="text-3xl text-center mb-4">Register</h2>

            {/* USERNAME */}
            <div className="relative mt-6">
              <input
                type="text"
                name="username"
                required
                value={authData.username}
                onChange={handleSignupChange}
                className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6"
              />
              <label className="
                absolute left-0 top-1/2 -translate-y-1/2 text-white/60 
                transition-all duration-300
                peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
                peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              ">
                Username
              </label>
              <FaUser className="absolute right-0 top-1/2 -translate-y-1/2" />
            </div>

            {/* EMAIL */}
            <div className="relative mt-6">
              <input
                type="email"
                name="email"
                required
                value={authData.email}
                onChange={handleSignupChange}
                className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6"
              />
              <label className="
                absolute left-0 top-1/2 -translate-y-1/2 text-white/60 
                transition-all duration-300
                peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
                peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              ">
                Email
              </label>
              <FaEnvelope className="absolute right-0 top-1/2 -translate-y-1/2" />
            </div>

            {/* PASSWORD */}
            <div className="relative mt-6">
              <input
                type="password"
                name="password"
                required
                value={authData.password}
                onChange={handleSignupChange}
                className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6"
              />
              <label className="
                absolute left-0 top-1/2 -translate-y-1/2 text-white/60 
                transition-all duration-300
                peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
                peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              ">
                Password
              </label>
              <FaLock className="absolute right-0 top-1/2 -translate-y-1/2" />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative mt-6">
              <input
                type="password"
                name="confirmPassword"
                required
                value={authData.confirmPassword}
                onChange={handleSignupChange}
                className="peer w-full bg-transparent border-b-2 border-white focus:border-cyan-400 outline-none py-2 pr-6"
              />
              <label className="
                absolute left-0 top-1/2 -translate-y-1/2 text-white/60 
                transition-all duration-300
                peer-focus:-top-[1.5px] peer-focus:text-cyan-400 peer-focus:text-sm
                peer-valid:-top-[1.5px] peer-valid:text-cyan-400 peer-valid:text-sm
              ">
                Confirm password
              </label>
              <FaLock className="absolute right-0 top-1/2 -translate-y-1/2" />
            </div>

            <button 
              onClick={handleRegister}
              className="mt-8 w-full py-2 border-2 border-cyan-400 rounded-full relative overflow-hidden group hover:cursor-pointer"
              disabled={isLoading}
            >
              <span className="relative z-10">
                {isLoading ? "Registering..." : "Register"}
              </span>
              <div className="absolute inset-0 -top-full group-hover:top-0 transition-all duration-500 bg-linear-to-b from-[#1a1a2e] via-cyan-400 to-[#1a1a2e]" />
            </button>

            <p className="text-center mt-4 text-sm">
              Already have an account? <br />
              <button onClick={handleToggleLogin} className="text-cyan-400 underline">
                Sign In
              </button>
            </p>
          </div>

          {/* ----------- SIGNUP WELCOME ----------- */}
          <div
            className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center px-20 transition-all duration-700 ${
              toggle ? "translate-x-0 opacity-100" : "-translate-x-[120%] opacity-0"
            }`}
          >
            <h2 className="text-4xl">WELCOME!</h2>
          </div>
        </div>
      </div>

      {/* Mobile View (новый дизайн для телефонов) */}
      <div className="lg:hidden w-full max-w-[400px]">
        {/* Индикатор текущей формы */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleToggleLogin}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${!toggle ? 'bg-cyan-400 text-[#1a1a2e] font-bold' : 'bg-gray-700 text-gray-300'}`}
            >
              Login
            </button>
            <button 
              onClick={handleToggleSignup}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${toggle ? 'bg-cyan-400 text-[#1a1a2e] font-bold' : 'bg-gray-700 text-gray-300'}`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Анимированный контейнер с 3D эффектом */}
        <div className="relative perspective-1000">
          {/* 3D контейнер */}
          <div 
            className={`relative w-full transform-style-3d transition-all duration-700 ${
              toggle ? 'rotate-y-180' : ''
            }`}
          >
            {/* Лицевая сторона (Login) */}
            <div className={`absolute inset-0 backface-hidden ${!toggle ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="bg-[#1a1a2e] border-2 border-cyan-400 rounded-2xl shadow-[0_0_25px_#00d4ff] p-8">
                <div className="text-center mb-8">
                  <div className="inline-block p-4 rounded-full bg-cyan-400/10 border border-cyan-400/30 mb-4">
                    <FaUser className="text-3xl text-cyan-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                  <p className="text-cyan-300">Sign in to continue your journey</p>
                </div>

                {/* USERNAME */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    name="loginUsername"
                    required
                    value={authData.username}
                    onChange={handleLoginChange}
                    className="peer w-full bg-[#0f0f1a] border-2 border-cyan-400/30 focus:border-cyan-400 outline-none py-3 px-4 rounded-xl transition-all"
                    placeholder=" "
                  />
                  <label className="
                    absolute left-4 top-1/2 -translate-y-1/2 text-white/60 
                    transition-all duration-300 pointer-events-none
                    peer-focus:-top-3 peer-focus:text-cyan-400 peer-focus:text-sm peer-focus:bg-[#1a1a2e] peer-focus:px-2
                    peer-valid:-top-3 peer-valid:text-cyan-400 peer-valid:text-sm peer-valid:bg-[#1a1a2e] peer-valid:px-2
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
                  ">
                    Username
                  </label>
                </div>

                {/* PASSWORD */}
                <div className="relative mb-8">
                  <input
                    type="password"
                    name="loginPassword"
                    required
                    value={authData.password}
                    onChange={handleLoginChange}
                    className="peer w-full bg-[#0f0f1a] border-2 border-cyan-400/30 focus:border-cyan-400 outline-none py-3 px-4 rounded-xl transition-all"
                    placeholder=" "
                  />
                  <label className="
                    absolute left-4 top-1/2 -translate-y-1/2 text-white/60 
                    transition-all duration-300 pointer-events-none
                    peer-focus:-top-3 peer-focus:text-cyan-400 peer-focus:text-sm peer-focus:bg-[#1a1a2e] peer-focus:px-2
                    peer-valid:-top-3 peer-valid:text-cyan-400 peer-valid:text-sm peer-valid:bg-[#1a1a2e] peer-valid:px-2
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
                  ">
                    Password
                  </label>
                </div>

                <button 
                  onClick={handleLogin}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all duration-300"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : null}
                    {isLoading ? "Loading..." : "Sign In"}
                    {!isLoading && <FaArrowDown className="ml-2" />}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300"/>
                </button>

                <div className="text-center mt-6">
                  <button 
                    onClick={handleToggleSignup}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                  >
                    Create new account →
                  </button>
                </div>
              </div>
            </div>

            {/* Обратная сторона (Register) */}
            <div className={`absolute inset-0 backface-hidden rotate-y-180 ${toggle ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="bg-[#1a1a2e] border-2 border-cyan-400 rounded-2xl shadow-[0_0_25px_#00d4ff] p-8">
                <div className="text-center mb-6">
                  <div className="inline-block p-4 rounded-full bg-cyan-400/10 border border-cyan-400/30 mb-4">
                    <FaEnvelope className="text-3xl text-cyan-400" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Join Us!</h2>
                  <p className="text-cyan-300">Create your account today</p>
                </div>

                {/* USERNAME */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    name="username"
                    required
                    value={authData.username}
                    onChange={handleSignupChange}
                    className="peer w-full bg-[#0f0f1a] border-2 border-cyan-400/30 focus:border-cyan-400 outline-none py-3 px-4 rounded-xl transition-all"
                    placeholder=" "
                  />
                  <label className="
                    absolute left-4 top-1/2 -translate-y-1/2 text-white/60 
                    transition-all duration-300 pointer-events-none
                    peer-focus:-top-3 peer-focus:text-cyan-400 peer-focus:text-sm peer-focus:bg-[#1a1a2e] peer-focus:px-2
                    peer-valid:-top-3 peer-valid:text-cyan-400 peer-valid:text-sm peer-valid:bg-[#1a1a2e] peer-valid:px-2
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
                  ">
                    Username
                  </label>
                </div>

                {/* EMAIL */}
                <div className="relative mb-4">
                  <input
                    type="email"
                    name="email"
                    required
                    value={authData.email}
                    onChange={handleSignupChange}
                    className="peer w-full bg-[#0f0f1a] border-2 border-cyan-400/30 focus:border-cyan-400 outline-none py-3 px-4 rounded-xl transition-all"
                    placeholder=" "
                  />
                  <label className="
                    absolute left-4 top-1/2 -translate-y-1/2 text-white/60 
                    transition-all duration-300 pointer-events-none
                    peer-focus:-top-3 peer-focus:text-cyan-400 peer-focus:text-sm peer-focus:bg-[#1a1a2e] peer-focus:px-2
                    peer-valid:-top-3 peer-valid:text-cyan-400 peer-valid:text-sm peer-valid:bg-[#1a1a2e] peer-valid:px-2
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
                  ">
                    Email
                  </label>
                </div>

                {/* PASSWORD */}
                <div className="relative mb-4">
                  <input
                    type="password"
                    name="password"
                    required
                    value={authData.password}
                    onChange={handleSignupChange}
                    className="peer w-full bg-[#0f0f1a] border-2 border-cyan-400/30 focus:border-cyan-400 outline-none py-3 px-4 rounded-xl transition-all"
                    placeholder=" "
                  />
                  <label className="
                    absolute left-4 top-1/2 -translate-y-1/2 text-white/60 
                    transition-all duration-300 pointer-events-none
                    peer-focus:-top-3 peer-focus:text-cyan-400 peer-focus:text-sm peer-focus:bg-[#1a1a2e] peer-focus:px-2
                    peer-valid:-top-3 peer-valid:text-cyan-400 peer-valid:text-sm peer-valid:bg-[#1a1a2e] peer-valid:px-2
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
                  ">
                    Password
                  </label>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="relative mb-6">
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={authData.confirmPassword}
                    onChange={handleSignupChange}
                    className="peer w-full bg-[#0f0f1a] border-2 border-cyan-400/30 focus:border-cyan-400 outline-none py-3 px-4 rounded-xl transition-all"
                    placeholder=" "
                  />
                  <label className="
                    absolute left-4 top-1/2 -translate-y-1/2 text-white/60 
                    transition-all duration-300 pointer-events-none
                    peer-focus:-top-3 peer-focus:text-cyan-400 peer-focus:text-sm peer-focus:bg-[#1a1a2e] peer-focus:px-2
                    peer-valid:-top-3 peer-valid:text-cyan-400 peer-valid:text-sm peer-valid:bg-[#1a1a2e] peer-valid:px-2
                    peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base
                  ">
                    Confirm Password
                  </label>
                </div>

                <button 
                  onClick={handleRegister}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] transition-all duration-300"
                  disabled={isLoading}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : null}
                    {isLoading ? "Creating..." : "Create Account"}
                    {!isLoading && <FaArrowUp className="ml-2" />}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300"/>
                </button>

                <div className="text-center mt-6">
                  <button 
                    onClick={handleToggleLogin}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                  >
                    ← Already have an account?
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Анимированные элементы фона для мобильных */}
        <div className="fixed inset-0 pointer-events-none -z-10 lg:hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-400/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Добавляем CSS для 3D эффектов */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}