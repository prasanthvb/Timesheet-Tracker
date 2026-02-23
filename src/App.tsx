import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Clock, Settings } from 'lucide-react';
import Home from './pages/Home';
import TimeSheet from './pages/TimeSheet';
import ClientTracker from './pages/ClientTracker';

function Navigation() {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
        <Clock className="logo-icon" size={28} />
        Time Sheet Management
      </div>
      <div className="flex gap-4">
        <button className="btn btn-secondary text-sm">
          <Settings size={16} /> Settings
        </button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="main-content">
        <Navigation />
        <main className="container animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/timesheet/:type" element={<TimeSheet />} />
            <Route path="/tracker" element={<ClientTracker />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
