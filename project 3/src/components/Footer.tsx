import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-000" />
              <span className="ml-2 text-xl font-bold">UD-1</span>
            </div>
            <p className="mt-4 text-gray-800">
              Empowering underprivileged communities through digital skills education.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-800 hover:text-white">Courses</Link></li>
              <li><Link to="/jobs" className="text-gray-800 hover:text-white">Jobs</Link></li>
              <li><Link to="/community" className="text-gray-800 hover:text-white">Community</Link></li>
              <li><Link to="/about" className="text-gray-800 hover:text-white">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-800 hover:text-white">Help Center</Link></li>
              <li><Link to="/faq" className="text-gray-800 hover:text-white">FAQs</Link></li>
              <li><Link to="/contact" className="text-gray-800 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-800">
                <Mail className="h-5 w-5 mr-2" />
                <span>support@ud1.com</span>
              </li>
              <li className="flex items-center text-gray-800">
                <Phone className="h-5 w-5 mr-2" />
                <span>+1 234 567 890</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-800">
          <p>&copy; {new Date().getFullYear()} UD-1. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}