import { Link } from "react-router-dom";

const SignHeader = () => {
  return (
    <section className="flex flex-col gap-4">
      <Link
        to="/"
        className="flex mb-2 gap-1 items-center text-gray-600 hover:text-gray-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 19-7-7 7-7"></path>
          <path d="M19 12H5"></path>
        </svg>
        <div className="text-sm">Back to Home</div>
      </Link>

      <div className="flex gap-2 items-center">
        <div className="text-[10px] text-white font-bold w-7 h-7 flex items-center justify-center bg-[#5B5EF4] rounded-lg">
          βF
        </div>
        <div className="text-[15px] font-bold ">βFit</div>
      </div>

      <div>
        <div className="text-2xl mb-1 font-semibold">Welcome Back</div>
        <div className="text-[14px] text-gray-600">
          Sign in to continue your fitness journey.
        </div>
      </div>
    </section>
  );
};

export default SignHeader;
