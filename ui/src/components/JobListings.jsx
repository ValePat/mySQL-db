import { useState, useEffect, useContext } from 'react';
import { useJobs } from './shared/JobsContext';
import JobListing from './JobListing';
import Spinner from './Spinner';

const JobListings = ({ isHome = false }) => {
  const { fetchJobs, error } = useJobs();
  const [jobs, setJobs] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs(isHome);
        setJobs(data);
      } catch (e) {
        console.log('error fetching data:' + error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs(); 
  }, [isHome]);

  return (
    <section className="bg-indigo-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? 'Recent jobs' : 'Browse jobs'}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner loading={loading} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobListing key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default JobListings;
