import { ChevronRight } from "lucide-react";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

const RegFooter = ({ onSubmit }: { onSubmit: () => void }) => {
  return (
    <section className="pt-6 flex flex-col gap-3 items-center">
      <Button
        fullWidth
        onClick={onSubmit}
        className="bg-indigo-600 hover:bg-indigo-700 text-gray-200 font-semibold rounded-xl"
      >
        Create Account
        <ChevronRight className="w-5 h-5" />
      </Button>

      <h3 className="mt-4 text-[14px]">
        By creating an account you agree to our <u>Terms</u> and{" "}
        <u>Privacy Policy</u>.
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
