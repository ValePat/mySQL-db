import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  var apiUrl = '';
    
  //add axios with authentication
  const fetchJobs = async (isHome, id) => {

    if(id !== '' && id !== undefined  && id !== null){
      apiUrl = `/api/jobs/getJobs/${id}`
    } else {
      apiUrl = isHome ? '/api/jobs/getJobs/?_limit=3' : '/api/jobs/getJobs';
    }

    try {
      const res = await axios.get(apiUrl, { withCredentials: true });
      //const res = await fetch(apiUrl);
      const data = await res.data;
      //setJobs(data);
      return data;
    } catch (e) {
      console.log('error fetching data:' + e);
      setError(e)
    } finally {
      setLoading(false);
    }
  };

  const addJob = async (newJob) => {
    try {
        const res = await axios.post('/api/jobs/addJob', newJob, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true  // Ensure credentials are sent
        });
        console.log(res);
        return res; // Handle JSON response as needed
    } catch (e) {
        console.log("Error while posting new job:", e);
    }
  };

  const deleteJob = async (id) => {
    try {
        const res = await axios.delete(`/api/jobs/deleteJob/${id}`, {
            withCredentials: true  // Ensure credentials are sent
        });
        console.log(res);
        return res; // Handle JSON response as needed
    } catch (e) {
        console.log("Error on delete job request:", e);
    }
  };

  const updateJob = async (updatedJob) => {
    try {
        const res = await axios.put(`/api/jobs/updateJob/${updatedJob.id}`, updatedJob, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true  // Ensure credentials are sent
        });
        return res.data; // Handle JSON response as needed
    } catch (e) {
        console.log("Error while updating job:", e);
    }
  };



    return (
        <JobsContext.Provider value={{ fetchJobs, addJob, updateJob, deleteJob, loading, error }}>
          {children}
        </JobsContext.Provider>
      );
  
};

export const useJobs = () => useContext(JobsContext);
