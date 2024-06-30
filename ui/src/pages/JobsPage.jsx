import JobListings from "../components/JobListings"
import { JobsProvider } from "../components/shared/JobsContext"

const JobsPage = () => {
  return (
    <section className="bg-blue-50 px-4 py-6"><JobsProvider><JobListings/></JobsProvider></section>
  )
}

export default JobsPage