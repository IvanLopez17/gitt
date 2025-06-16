import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserProvider, { UserContext } from './src/context/UserContext.jsx';
import Login from './src/pages/Login.jsx';
import Register from './src/pages/Register.jsx';
import Dashboard from './src/pages/Dashboard.jsx';
import './src/styles/global.css';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

function RequireAuth({ children }) {
  const { user } = React.useContext(UserContext);
  if (!user) return <Navigate to="/login" />;
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);