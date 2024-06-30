import React, { createContext, useState, useContext, useEffect } from 'react';

const JobsContext = createContext();

export const JobsProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  var apiUrl = '';
    
    //add axios with authentication
    const fetchJobs = async (isHome, id) => {

      if(id !== '' && id !== undefined  && id !== null){
        apiUrl = `/api/jobs/${id}`
      } else {
        apiUrl = isHome ? '/api/jobs?_limit=3' : '/api/jobs';
      }

      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
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
      console.log(newJob);
      try {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newJob),
        });
        return res.json(); // Puoi gestire la risposta JSON a seconda delle tue esigenze
      } catch (e) {
        console.log("Error while posting new job:", e);
        throw e; // Opzionale: puoi anche gestire l'errore in modo diverso
      }
    };

    const deleteJob = async (id) => {
      console.log(id);
      try {
        const res = await fetch(`/api/jobs/${id}`, {
          method: 'DELETE',
        });
        return res.json(); // Gestisci la risposta JSON
      } catch (e) {
        console.log("Error on delete job request:", e);
        throw e; // Opzionale: gestire l'errore in modo diverso
      }
    };

    const updateJob = async (updatedJob) => {
      console.log(updatedJob.id);
      try {
        const res = await fetch(`/api/jobs/${updatedJob.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedJob),
        });
        return res.json(); // Gestisci la risposta JSON
      } catch (e) {
        console.log("Error while updating job:", e);
        throw e; // Opzionale: gestire l'errore in modo diverso
      }
    };
  
    return (
        <JobsContext.Provider value={{ fetchJobs, addJob, updateJob, deleteJob, loading, error }}>
          {children}
        </JobsContext.Provider>
      );
  
  };

export const useJobs = () => useContext(JobsContext);
