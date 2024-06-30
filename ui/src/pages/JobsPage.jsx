import JobListings from "../components/JobListings"
import { JobsProvider } from "../components/shared/JobsContext"
import { useAuth } from "../components/shared/AuthContext"

const JobsPage = () => {
  const {checkAuth} = useAuth();

  checkAuth();
  return (
    <section className="bg-blue-50 px-4 py-6"><JobsProvider><JobListings/></JobsProvider></section>
  )
}

export default JobsPage