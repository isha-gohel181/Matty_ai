import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import logo from "@/assets/Mattty_ai_logo.png";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Templates', href: '#templates' },
      { name: 'How It Works', href: '#how-it-works' },
    ],
    Company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Disclaimer', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Github size={20} />, href: '#', label: 'Github' },
    { icon: <Linkedin size={20} />, href: '#', label: 'LinkedIn' },
    { icon: <Mail size={20} />, href: '#', label: 'Email' },
  ];

  return (
    <footer className="border-t border-border bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold font-display uppercase tracking-wider mb-4 inline-flex text-foreground">
              <img src={logo} alt="Matty AI Logo" className="h-11 w-auto object-contain" />
              <span>Matty AI</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 max-w-sm font-editorial">
              Transform your ideas into stunning designs with AI-powered tools. 
              Create professional graphics in minutes, not hours.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="flex items-center justify-center h-10 w-10 rounded-full border border-border hover:border-primary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-foreground mb-4 font-display uppercase tracking-widest text-xs">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors font-utility uppercase tracking-widest"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground font-utility uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Matty AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-utility uppercase tracking-widest">
                Privacy
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-utility uppercase tracking-widest">
                Terms
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-utility uppercase tracking-widest">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;