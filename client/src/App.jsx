import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import DashboardPage from './components/DashboardPage';
import UpdateClientForm from './components/UpdateClientForm';
import './App.css';

import { UserProvider } from './contexts/UserContext'; 

function App() {
  return (
    <UserProvider>
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={< DashboardPage/>} />
          <Route path="/dashboard/update/:id" element={<UpdateClientForm />} />
        </Routes>
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;