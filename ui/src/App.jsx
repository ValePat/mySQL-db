import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './components/shared/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import AddJobs from './pages/AddJobPage';
import EditJobPage from './pages/EditJobPage';
import NotFoundPage from './pages/NotFoundPage';
import JobsPage from './pages/JobsPage';
import JobPage, {jobLoader} from './pages/JobPage';

import { addJob, deleteJob, updateJob } from './components/shared/ApiService';
import { HistoryProvider } from './components/shared/HistoryProvider';


const App = () => (
  
  <AuthProvider>
  <Router>
    <HistoryProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/jobs" index element={<JobsPage/>} />
          <Route path="/add-job" index element={<ProtectedRoute><AddJobs addJobSubmit={addJob} /></ProtectedRoute>} />
          <Route path="/jobs/:id" index element={<JobPage deleteJob={deleteJob} />} loader={jobLoader} />
          <Route path="/edit-job/:id" index element={<ProtectedRoute><EditJobPage updateJob={updateJob} /></ProtectedRoute>} loader={jobLoader} />
          <Route path="*" index element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HistoryProvider>
  </Router>
</AuthProvider>
);

export default App;

