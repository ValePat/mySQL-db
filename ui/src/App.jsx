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
import JobPage from './pages/JobPage';
import Register from './components/Register';
import { HistoryProvider } from './components/shared/HistoryProvider';
import { JobsProvider } from './components/shared/JobsContext';

const App = () => (
  
<AuthProvider>
    <Router>
      <HistoryProvider>
        <JobsProvider>
        <Routes>
          <Route path="/">
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Register" element={<Register />} />
          </Route>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/jobs" index element={<JobsPage/>} />
            <Route path="/add-job" index element={<ProtectedRoute><AddJobs/></ProtectedRoute>} />
            <Route path="/jobs/:id" index element={<JobPage />}/>
            <Route path="/edit-job/:id" index element={<ProtectedRoute><EditJobPage /></ProtectedRoute>}/>
            <Route path="*" index element={<NotFoundPage />} />
          </Route>
        </Routes>
        </JobsProvider>
      </HistoryProvider>
    </Router>
</AuthProvider>
);

export default App;

