import { Link } from "react-router-dom";

export const ViewAllJobs = () => {
  return (
    <section className="m-auto max-w-lg my-10 px-6">
    <Link
      to="/jobs"
      className="block bg-orange-400 text-white text-center py-4 px-6 rounded-full hover:bg-gray-700"
    >
      View All Jobs
    </Link>
  </section>
  )
}

export default ViewAllJobs;
