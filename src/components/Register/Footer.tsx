import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const RegFooter = ({ onSubmit }: { onSubmit: () => void }) => {
  return (
    <section className="pt-6 flex flex-col gap-3 items-center">
      <button
        type="submit"
        onClick={onSubmit}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-gray-200 font-medium px-4 p-2 rounded-xl transition"
      >
        Create Account
        <ChevronRight className="w-5 h-5" />
      </button>

      <h3 className="mt-4 text-[14px]">
        By creating an account you agree to our{" "}
        <u className="text-[14px]">Terms</u> and{" "}
        <u className="text-[14px]">Privacy Policy</u>.
      </h3>

      <h3 className="text-[14px]">
        Already have an account?{" "}
        <Link to="/signin" className="text-[#5B5EF4]">
          Sign In
        </Link>
      </h3>
    </section>
  );
};

export default RegFooter;
