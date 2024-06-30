import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarker } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useJobs } from '../components/shared/JobsContext';
import { useAuth } from '../components/shared/AuthContext';
import Spinner from '../components/Spinner';

const JobPage = () => {
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();
  const { fetchJobs, deleteJob, error } = useJobs();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();


  useEffect(() => {
    const fetchJob = async () => {
      try {
        const isHome = false;
        const data = await fetchJobs(isHome, id);
        setJob(data);
      } catch (e) {
        console.log('error fetching data:' + error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const onDeleteClick = async (jobId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?');

    if(!isAuthenticated) {
      navigate('/Login');
      return;
    }


    if (!confirmDelete) {
      return;
    }

    try {
      await deleteJob(jobId);
      // Assuming you have a toast notification system like 'react-toastify' or similar
      toast.success('Job deleted successfully');
      navigate('/jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <>
       <section>
        <div className="container m-auto py-6 px-6">
          <Link to="/jobs" className="text-indigo-500 hover:text-indigo-600 flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Job Listings
          </Link>
        </div>
      </section>

      <section className="bg-indigo-50">
        <div className="container m-auto py-10 px-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner loading={loading} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
            <main>
              <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
                <div className="text-gray-500 mb-4">{job.type}</div>
                <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
                <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                  <FaMapMarker className="text-orange-400 mr-2" />
                  <p className="text-orange-400">{job.location}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-indigo-800 text-lg font-bold mb-6">Job description</h3>
                <p className="mb-4">{job.description}</p>

                <h3 className="text-indigo-800 text-lg font-bold mb-2">Salary</h3>
                <p className="mb-4">{job.salary}</p>
              </div>
            </main>

            <aside>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6">Company Info</h3>
                <h2 className="text-2xl">{job.company.name}</h2>
                <p className="my-2">{job.company.description}</p>
                <hr className="my-4" />
                <h3 className="text-xl">Contact Email:</h3>
                <p className="my-2 bg-indigo-100 p-2 font-bold">{job.company.contactEmail}</p>
                <h3 className="text-xl">Contact Phone:</h3>
                <p className="my-2 bg-indigo-100 p-2 font-bold">{job.company.contactPhone}</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-xl font-bold mb-6">Manage Job</h3>
                <Link
                  to={`/edit-job/${job.id}`}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                >
                  Edit Job
                </Link>
                <button
                  onClick={() => onDeleteClick(job.id)}
                  className="bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                >
                  Delete Job
                </button>
              </div>
            </aside>
          </div>
        )}
        </div>
      </section>
         </>
  );
};

export  default JobPage
