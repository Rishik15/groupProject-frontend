import RegFooter from "../../components/Register/Footer";
import RegHeader from "../../components/Register/Header";
import RegInput from "../../components/Register/Input";
import RoleSelector from "../../components/Register/RoleSelection";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <section className="w-auto">
        <RegHeader />
        <RoleSelector />
        <RegInput />
        <RegFooter />
      </section>
    </div>
  );
};

export default Register;
