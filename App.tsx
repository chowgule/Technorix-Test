import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import JobListPage from './pages/JobListPage';
import JobDetailsPage from './pages/JobDetailsPage';

/**
 * The main application component defines client-side routes.
 * /             -> JobListPage
 * /jobs/:id     -> JobDetailsPage
 * any other path redirects to the list.
 */
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<JobListPage />} />
      <Route path="/jobs/:id" element={<JobDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;