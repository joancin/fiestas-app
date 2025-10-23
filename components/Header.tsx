
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFestero = user?.role === Role.FESTERO || user?.role === Role.ORGANIZER;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const NavLink: React.FC<{ to: string, children: React.ReactNode, onClick?: () => void }> = ({ to, children, onClick }) => (
      <Link to={to} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white" onClick={onClick}>{children}</Link>
  );

  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center text-2xl font-bold text-white hover:text-cyan-400 transition duration-300"
            >
              Fiestas Pantano
              <svg className={`ml-2 h-5 w-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-20 border border-gray-700">
                <div className="py-1">
                  <NavLink to="/" onClick={() => setDropdownOpen(false)}>Eventos</NavLink>
                  <NavLink to="/raffle" onClick={() => setDropdownOpen(false)}>La Última Rifa</NavLink>
                  {isFestero && <NavLink to="/dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</NavLink>}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center space-x-2 text-gray-300 hover:text-cyan-400">
                <UserCircleIcon />
                <span>{user.username}</span>
              </Link>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-cyan-400 transition duration-300">Login</Link>
              <Link to="/register" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const UserCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export default Header;