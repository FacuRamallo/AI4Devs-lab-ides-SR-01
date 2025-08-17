import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddCandidateForm from './pages/AddCandidateForm';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/candidates/new" element={<AddCandidateForm />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
