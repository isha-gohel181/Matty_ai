import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-8 bg-[#111111] text-white">
      <div className="mx-auto max-w-screen-xl px-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Matty. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;