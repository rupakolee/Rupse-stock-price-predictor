import React from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo1.png";

interface NavLink {
    name: string;
    path: string;
}

const navLinks: NavLink[] = [
    { name: "Home", path: "/" },
    { name: "Stock Prediction", path: "/dashboard/Overview" },
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
];

const Navbar: React.FC = () => {
    return (
        <nav className="bg-background shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img
                        src={logo}
                        alt="Company Logo"
                        className="w-20 h-20 object-contain hover:opacity-80 transition-opacity"
                    />
                </Link>

                {/* Nav Links */}
                <div className="flex gap-6 items-center">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="group text-foreground font-medium relative transition-colors duration-200"
                        >
                            <span className="hover:text-primary transition-colors">{link.name}</span>

                            {/* Underline */}
                            <span
                                className="absolute bottom-[-2px] left-0 h-0.5 bg-primary w-0 
                                           group-hover:w-full transition-all duration-300 ease-in-out"
                            ></span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
