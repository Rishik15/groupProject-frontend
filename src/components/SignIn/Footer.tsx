import { Button } from "@heroui/react";
import { Link } from "react-router-dom";

const SignFooter = ({ onSubmit }: { onSubmit: () => void }) => {
  return (
    <section className="pt-8 flex flex-col gap-3 items-center">
      <Button
        fullWidth
        onClick={onSubmit}
        className="bg-indigo-600 hover:bg-indigo-700 text-gray-200 font-semibold rounded-xl"
      >
        Sign In
      </Button>

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
