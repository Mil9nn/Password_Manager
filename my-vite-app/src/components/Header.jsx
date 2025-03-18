import React from "react";

function Header() {
    return (
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg py-8">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold text-white tracking-wide break-all">Pass<span className="text-amber-400">Hush</span></h1>
                <p className="text-lg text-gray-100 font-medium mt-2 opacity-90">
                    Secure & Simple Password Manager
                </p>
            </div>
        </header>
    );
}

export default Header;
