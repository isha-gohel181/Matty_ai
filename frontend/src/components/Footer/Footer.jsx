import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 bg-background text-foreground">
      <div className="mx-auto max-w-screen-xl px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Matty. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;