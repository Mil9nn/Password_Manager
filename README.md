# PassHush - Your Secure Password Manager

![PassHush Screenshot](./public/screenshot.png)

## Overview

PassHush is a simple yet secure password management application that allows users to safely store and organize their login credentials. Built with a modern React frontend and Express/MongoDB backend, this application provides a user-friendly interface for managing passwords while maintaining security.

## Features

- **Secure Password Storage**: Safely store website credentials in a MongoDB database
- **Add/Edit/Delete Functionality**: Full CRUD operations for managing your password entries
- **Search Capability**: Quickly find credentials by searching for website names or usernames
- **Password Visibility Toggle**: Show/hide passwords with a simple click
- **Copy to Clipboard**: One-click copying of website URLs, usernames, and passwords
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with visual feedback

## Tech Stack

### Frontend
- React.js with Hooks
- Tailwind CSS for styling
- UUID for generating unique identifiers
- React Toastify for notifications

### Backend
- Express.js server
- MongoDB database
- Mongoose for database modeling
- CORS support for cross-origin requests

## Project Structure

```
/
├── backend/
│   └── server.js           # Express server and MongoDB connection
│
└── my-vite-app/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx  # Application header component
    │   │   └── Main.jsx    # Main application component with CRUD operations
    │   ├── App.jsx         # Root React component
    │   ├── App.css         # Global styles
    │   ├── index.css       # CSS imports
    │   └── main.jsx        # React entry point
    └── ...                 # Vite and React configuration files
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed and running locally)

### Setup Steps

1. **Clone the repository**
   ```
   git clone https://github.com/Mil9nn/Password_Manager.git
   cd passhush
   ```

2. **Set up the backend**
   ```
   cd backend
   npm install
   npm start
   ```
   The server will start on http://localhost:3000

3. **Set up the frontend**
   ```
   cd ../my-vite-app
   npm install
   npm run dev
   ```
   The React application will start on http://localhost:5173

## Usage

1. **Adding a Password**
   - Fill in the website, username, and password fields
   - Click "Add Password" to save the entry

2. **Finding Credentials**
   - Use the search bar to filter by website name or username
   - Entries are displayed in a table format below

3. **Managing Entries**
   - Click the eye icon to show/hide passwords
   - Use the copy icon to copy information to clipboard
   - Click the edit icon to modify an entry
   - Click the delete icon to remove an entry

## Security Considerations

- This application is intended for local use or deployment in a secure environment
- Consider implementing encryption for password storage in a production setting
- Add user authentication for multi-user support
- Implement HTTPS for secure data transmission

## Future Enhancements

- Password strength indicator
- Password generator
- Browser extension integration
- End-to-end encryption
- Multi-device synchronization
- Categories and tags for better organization
- Import/export functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.