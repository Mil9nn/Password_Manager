import React from "react";

function Header() {
    return (
        <header className="text-green-400 py-6">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-wide break-all">PassHush</h1>
                <p className="text-lg font-medium mt-2 opacity-90">
                    Secure & Simple Password Manager
                </p>
            </div>
        </header>
    );
}

export default Header;
