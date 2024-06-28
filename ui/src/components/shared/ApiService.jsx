// apiFunctions.js (o apiFunctions.ts)
export const addJob = async (newJob) => {
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
  
  export const deleteJob = async (id) => {
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
  
  export const updateJob = async (updatedJob) => {
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
  