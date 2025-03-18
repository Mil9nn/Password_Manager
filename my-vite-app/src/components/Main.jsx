import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
function Main() {
    const [formData, setFormData] = useState({
        siteText: "",
        userText: "",
        passwordText: ""
    });
    const [savedEntries, setSavedEntries] = useState([]);
    const [editId, setEditId] = useState(null);
    const [showPassword, setShowPassword] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const fetchEntries = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/entries`);
            const data = await response.json();
            setSavedEntries(data);
        } catch (error) {
            console.error("Error fetching entries:", error);
        }
    }
    useEffect(() => {
        fetchEntries();
    }, []);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevValues) => ({
            ...prevValues,
            [name]: value
        }));
    }
    const handleAdd = async (event) => {
        event.preventDefault();

        if (!formData.siteText || !formData.userText || !formData.passwordText) {
            toast.error("Please fill all fields!", {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }
        const entryData = {
            siteText: formData.siteText,
            userText: formData.userText,
            passwordText: formData.passwordText
        };
        try {
            if (editId) {
                const response = await fetch(`http://localhost:3000/api/entries/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(entryData)
                });
                if (response.ok) {
                    toast.success("Entry updated successfully!", {
                        position: "top-right",
                        autoClose: 2000
                    });
                    setEditId(null);
                }
            } else {
                entryData.id = uuidv4();
                const response = await fetch(`http://localhost:3000/api/entries`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(entryData)
                });
                if (response.ok) {
                    toast.success("Entry added successfully!", {
                        position: "top-right",
                        autoClose: 2000
                    });
                }
            }
            fetchEntries();
            setFormData({ siteText: "", userText: "", passwordText: "" });
        } catch (error) {
            console.error("Error saving entry:", error);
            toast.error("Failed to save entry!", {
                position: "top-right",
                autoClose: 2000
            });
        }
    }
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/entries/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                toast.success("Entry deleted successfully!", {
                    position: "top-right",
                    autoClose: 2000
                });
                fetchEntries();
            }
        } catch (error) {
            console.error("Error deleting entry:", error);
            toast.error("Failed to delete entry!", {
                position: "top-right",
                autoClose: 2000
            });
        }
    }
    const handleEdit = (id) => {
        const entryToEdit = savedEntries.find((entry) => entry.id === id);
        if (entryToEdit) {
            setFormData({
                siteText: entryToEdit.siteText,
                userText: entryToEdit.userText,
                passwordText: entryToEdit.passwordText
            });
            setEditId(id);

            // Scroll to the form
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    const togglePasswordVisibility = (id) => {
        setShowPassword(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }
    const copyToClipBoard = (text) => {
        navigator.clipboard.writeText(text);
        toast.info('Copied to clipboard!', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const filteredEntries = savedEntries.filter(entry =>
        entry.siteText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.userText.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const copyIcon = (
        <div className="inline-block hover:scale-[1.1] active:scale-[0.9] transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer />
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-indigo-600 py-8 shadow-lg">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-white tracking-wide">
                        Pass<span className="text-amber-400">Hush</span>
                    </h1>
                    <p className="text-lg font-medium mt-2 text-gray-100">
                        Your Secure Password Vault
                    </p>
                </div>
            </header>

            {/* Form Card */}
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-xl p-6 mb-8 max-w-2xl mx-auto transform transition-all">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                        {editId ? "Update Password" : "Add New Password"}
                    </h2>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <input
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                onChange={handleChange}
                                type="text"
                                name="siteText"
                                value={formData.siteText}
                                placeholder="Enter website name or URL"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                    onChange={handleChange}
                                    type="text"
                                    name="userText"
                                    value={formData.userText}
                                    placeholder="Enter username or email"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                    onChange={handleChange}
                                    type="password"
                                    name="passwordText"
                                    value={formData.passwordText}
                                    placeholder="Enter password"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            {editId && (
                                <button
                                    onClick={() => {
                                        setEditId(null);
                                        setFormData({ siteText: "", userText: "", passwordText: "" });
                                    }}
                                    className="mr-2 bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                onClick={handleAdd}
                                className={`flex items-center gap-1.5 px-6 py-2 rounded-lg font-medium shadow-md transition-all cursor-pointer ${editId
                                    ? "bg-indigo-600 text-white hover:bg-purple-600"
                                    : "bg-purple-600 text-white hover:bg-indigo-700"
                                    }`}
                            >
                                <lord-icon
                                    src="https://cdn.lordicon.com/hqymfzvj.json"
                                    trigger="hover"
                                    colors="primary:#fff,secondary:#ee66aa"
                                    style={{ width: "30px", height: "30px" }}>
                                </lord-icon>
                                {editId ? "Update" : "Add Password"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Search Bar */}
                <div className="max-w-lg mx-auto mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search passwords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                        />
                        <div className="absolute left-3 top-3 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Passwords Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Website</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Username</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Password</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredEntries.length > 0 ? (
                                    filteredEntries.map((entry) => {
                                        const entryId = entry.id || entry._id;

                                        return (
                                            <tr key={entryId} className="hover:bg-gray-50 transition-all">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <span className="text-lg font-medium text-indigo-600">
                                                                {entry.siteText.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{entry.siteText}</div>
                                                            <div
                                                                className="text-xs text-indigo-600 cursor-pointer hover:text-indigo-800"
                                                                onClick={() => copyToClipBoard(entry.siteText)}
                                                            >
                                                                {copyIcon}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">{entry.userText}</div>
                                                        <div
                                                            className="ml-2 text-indigo-600 cursor-pointer hover:text-indigo-800"
                                                            onClick={() => copyToClipBoard(entry.userText)}
                                                        >
                                                            {copyIcon}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {showPassword[entryId] ? entry.passwordText : '••••••••'}
                                                        </div>
                                                        <div
                                                            className="ml-2 text-gray-500 cursor-pointer hover:text-gray-700"
                                                            onClick={() => togglePasswordVisibility(entryId)}
                                                        >
                                                            {showPassword[entryId] ? (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                                                </svg>
                                                            ) : (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                                    <circle cx="12" cy="12" r="3"></circle>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div
                                                            className="ml-2 text-indigo-600 cursor-pointer hover:text-indigo-800"
                                                            onClick={() => copyToClipBoard(entry.passwordText)}
                                                        >
                                                            {copyIcon}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex space-x-3 justify-end">
                                                        <button
                                                            onClick={() => handleEdit(entryId)}
                                                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer hover:scale-[1.1] active:scale-[0.9] transition-transform"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(entryId)}
                                                            className="text-red-600 hover:text-red-900 cursor-pointer hover:scale-[1.1] active:scale-[0.9] transition-transform"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                            {searchTerm ?
                                                "No matching passwords found. Try a different search term." :
                                                "No passwords saved yet. Add your first password above."
                                            }
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center text-gray-500 text-sm py-4">
                    <p>PassHush - Your Secure Password Manager</p>
                </footer>
            </div>
        </div>
    );
}
export default Main;