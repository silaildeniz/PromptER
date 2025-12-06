import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PromptDetail from './pages/PromptDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminUpload from './pages/AdminUpload';
import Library from './pages/Library';
import Settings from './pages/Settings';

function App() {
  const [aiFilter, setAiFilter] = useState({ tool: null, type: null });

  const handleFilterChange = (filter) => {
    setAiFilter(filter);
  };

  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen" style={{ backgroundColor: '#F5E6D3' }}>
          {/* Navbar with AI Filter */}
          <Navbar onFilterChange={handleFilterChange} />

          {/* Routes */}
          <Routes>
            <Route path="/" element={<Home aiFilter={aiFilter} />} />
            <Route path="/prompt/:id" element={<PromptDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/library" element={<Library />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin/upload" 
              element={
                <ProtectedRoute requiredRole="admin" redirectTo="/">
                  <AdminUpload />
                </ProtectedRoute>
              } 
            />
          </Routes>

          {/* Footer */}
          <Footer />

          {/* Toast Notifications */}
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

