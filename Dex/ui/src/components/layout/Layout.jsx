import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useBlockchain } from "../../hooks/useBlockchain";

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { account, connectWallet, disconnect } = useBlockchain();

  const navigationItems = [
    { path: "/", label: "Dashboard" },
    { path: "/coins", label: "Top Coins" },
    { path: "/trading", label: "Trading" },
    { path: "/transfer", label: "Transfer" },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Modern Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 to-purple-600 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="flex items-center"
                onClick={closeMobileMenu}
              >
                <h1 className="text-2xl font-bold text-white font-poppins">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                    CRYPTO LEDGER
                  </span>
                  <span className="text-white ml-2">EXCHANGE</span>
                </h1>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition duration-300 ${
                    isActive(item.path)
                      ? "text-white bg-black bg-opacity-20"
                      : "text-gray-200 hover:text-white hover:bg-black hover:bg-opacity-10"
                  } px-3 py-2 rounded-md`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Wallet Section */}
            <div className="flex items-center space-x-4">
              {account ? (
                <div className="flex items-center space-x-3">
                  <div
                    onClick={disconnect}
                    className="hidden sm:flex items-center bg-black bg-opacity-20 px-4 py-2 rounded-full hover:bg-opacity-30 transition duration-200 cursor-pointer group"
                  >
                    <svg
                      className="w-5 h-5 text-green-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-white">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                    <span className="ml-2 text-xs text-green-400 bg-green-900 bg-opacity-50 px-2 py-1 rounded-full">
                      Connected
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "text-white bg-black bg-opacity-20"
                    : "text-gray-200 hover:text-white hover:bg-black hover:bg-opacity-10"
                }`}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold mb-4">About Us</h3>
              <p className="text-sm">
                CryptoLedger Exchange is a secure and efficient platform for
                trading digital assets.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm hover:text-white transition duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Contact</h3>
              <p className="text-sm">
                Email: support@cryptoledger.com
                <br />
                Support: 24/7
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>© 2025 CryptoLedger Exchange. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
