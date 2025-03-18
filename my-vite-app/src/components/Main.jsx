import React from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import Header from "../components/Header";

function Main() {
    const [formData, setFormData] = useState({
        siteText: "",
        userText: "",
        passwordText: ""
    });

    const [savedEntries, setSavedEntries] = useState([]);

    const [editId, setEditId] = useState(null);

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
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevValues) => {
            return { ...prevValues, [name]: value }
        })
    }

    const handleAdd = async (event) => {
        event.preventDefault();

        // Create the entry data
        const entryData = {
            siteText: formData.siteText,
            userText: formData.userText,
            passwordText: formData.passwordText
        };

        try {
            if (editId) {
                // Update existing entry
                const response = await fetch(`http://localhost:3000/api/entries/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(entryData)
                });

                if (response.ok) {
                    toast("Entry updated!", { position: "top-right", autoClose: 1000 });
                    setEditId(null); // Clear edit mode
                }
            } else {
                // Add UUID for new entries
                entryData.id = uuidv4();

                // Create new entry
                const response = await fetch(`http://localhost:3000/api/entries`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(entryData)
                });
            }

            // Refresh entries and reset form regardless of operation
            fetchEntries();
            setFormData({ siteText: "", userText: "", passwordText: "" });
        } catch (error) {
            console.error("Error saving entry:", error);
            toast("Error saving entry!", { position: "top-right", autoClose: 1000, type: "error" });
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/entries/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                fetchEntries();
            }
        } catch (error) {
            console.error("Error deleting entry:", error);
            toast("Error deleting entry!", { position: "top-right", autoClose: 1000, type: "error" });
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
        }
    }

    const copyToClipBoard = (text) => {
        navigator.clipboard.writeText(text);
        toast('Copied to Clipboard', {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const copyIcon = (
        <div className="svg inline-block cursor-pointer hover:scale-[1.1] active:scale-[0.9] transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        </div>
    )

    return <>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />

        <Header />
        <form className="flex flex-col max-w-[600px] mx-auto gap-2 p-10 mb-5">
            <input className="bg-white p-1 pl-3 rounded-full outline-0 max-w-xl border border-gray-300" onChange={handleChange} type="text" name="siteText" value={formData.siteText} placeholder="Website URL" />
            <div className="flex flex-col sm:flex-row gap-1.5">
                <input className="bg-white p-1 pl-3 rounded-full outline-0 max-w-sm border border-gray-300" onChange={handleChange} type="text" name="userText" value={formData.userText} placeholder="Username" />
                <input className="bg-white p-1 pl-3 rounded-full outline-0 max-w-sm border border-gray-300" onChange={handleChange} type="password" name="passwordText" value={formData.passwordText} placeholder="Password" />
            </div>
            <button onClick={handleAdd} className="bg-amber-300 w-20 cursor-pointer p-2 rounded-full font-semibold shadow-md transition-transform duration-500 ease-in-out hover:scale-110 active:scale-95" >{editId ? "Update" : "Add"}</button>
        </form>
        <div className="container mx-auto p-6">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
                    <thead className="bg-gray-200 sticky top-0">
                        <tr className="text-left text-gray-700">
                            <th className="p-3 border border-gray-300">Website url</th>
                            <th className="p-3 border border-gray-300">Username</th>
                            <th className="p-3 border border-gray-300">Password</th>
                            <th className="p-3 border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {savedEntries.map((entry) => {
                            // Make sure each entry has an id
                            const entryId = entry.id || entry._id;

                            return (
                                <tr key={entryId}
                                    className="border border-gray-300 text-gray-800 hover:bg-gray-100 transition duration-300"
                                >
                                    <td className="p-3">
                                        <div className="flex items-center gap-1.5">
                                            {entry.siteText}
                                            <div onClick={() => copyToClipBoard(entry.siteText)}>
                                                {copyIcon}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-1.5">
                                            {entry.userText}
                                            <div onClick={() => copyToClipBoard(entry.userText)}>
                                                {copyIcon}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-1.5">
                                            {entry.passwordText}
                                            <div onClick={() => copyToClipBoard(entry.passwordText)}>
                                                {copyIcon}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="action-btns flex gap-5">
                                            {/* Delete Icon */}
                                            <lord-icon
                                                onClick={() => handleDelete(entryId)}
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                colors="primary:#e83a30"
                                                style={{ width: "30px", height: "30px", cursor: "pointer" }}>
                                            </lord-icon>
                                            {/* Edit Icon */}
                                            <lord-icon
                                                onClick={() => handleEdit(entryId)}
                                                src="https://cdn.lordicon.com/exymduqj.json"
                                                trigger="hover"
                                                colors="primary:#ee66aa,secondary:#ee66aa"
                                                style={{ width: "30px", height: "30px", cursor: "pointer" }}>
                                            </lord-icon>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    </>
}

export default Main;