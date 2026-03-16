import { Link } from "react-router-dom";

const SignFooter = () => {
  return (
    <section className="pt-8 flex flex-col gap-3 items-center">
      <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-gray-200 font-medium px-4 p-2 rounded-xl transition">
        Sign In
      </button>

      <h3 className="text-[14px] mt-3">
        Don't have an Account?{" "}
        <Link to="/register" className="text-[#5B5EF4]">
          Create an Account
        </Link>
      </h3>
    </section>
  );
};

export default SignFooter;
