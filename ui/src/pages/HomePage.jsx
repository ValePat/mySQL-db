import Hero from '../components/Hero';
import HomeCards from '../components/HomeCards';
import JobListings from '../components/JobListings';
import ViewAllJobs from '../components/ViewAllJobs';
import { useAuth } from '../components/shared/AuthContext';

const HomePage = () => {
  const {checkAuth} = useAuth();
  checkAuth();

  return (
    <>
      <Hero/>
      <HomeCards/>
      <JobListings isHome={true} />
      <ViewAllJobs/>
    </>
  )
}

export default HomePage;