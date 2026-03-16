import SignFooter from "../../components/SignIn/Footer";
import SignHeader from "../../components/SignIn/Header";
import SignInputs from "../../components/SignIn/Input";

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <section className="full min-w-sm">
        <SignHeader />
        <SignInputs />
        <SignFooter />
      </section>
    </div>
  );
};

export default SignIn;
