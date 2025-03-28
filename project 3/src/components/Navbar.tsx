import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Leaf, Briefcase, Users, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">UD-1</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/courses" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
              <Book className="h-5 w-5 mr-1" />
              <span>Courses</span>
            </Link>
            
            <Link to="/jobs" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
              <Briefcase className="h-5 w-5 mr-1" />
              <span>Jobs</span>
            </Link>
            
            <Link to="/community" className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
              <Users className="h-5 w-5 mr-1" />
              <span>Community</span>
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <LogIn className="h-5 w-5 mr-1" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};