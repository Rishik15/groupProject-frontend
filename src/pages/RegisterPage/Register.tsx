import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegFooter from "../../components/Register/Footer";
import RegHeader from "../../components/Register/Header";
import RegInput from "../../components/Register/Input";
import RoleSelector from "../../components/Register/RoleSelection";
import { register } from "../../services/auth/register";
import { validateRegister } from "../../utils/auth/validateInputs";
import Modal from "../../components/global/Modal";
import { useAuth } from "../../utils/auth/AuthContext";
import GoogleAuthButton from "../../components/auth/GoogleAuthButton";
import { startGoogleLogin } from "../../services/auth/googleLogin";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const handleRegister = async () => {
    try {
      if (!selectedRole) {
        setModalMessage("Please select whether you are a coach or client.");
        setShowModal(true);
        return;
      }

      const errors = validateRegister(name, email, password);

      if (Object.keys(errors).length > 0) {
        const message = Object.values(errors)[0];
        setModalMessage(message as string);
        setShowModal(true);
        return;
      }

      await register(name, email, password, selectedRole);

      await refreshAuth();

      if (selectedRole === "coach") {
        navigate("/onboarding/coach", { replace: true });
      } else {
        navigate("/onboarding/client", { replace: true });
      }
    } catch (err: any) {
      setModalMessage(err.message || "Something went wrong");
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <section className="w-auto">
          <RegHeader />

          <RoleSelector role={selectedRole} setRole={setSelectedRole} />

          <RegInput
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />

          <RegFooter onSubmit={handleRegister} />

          <div className="flex flex-col gap-4">
            <div className="pt-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-400" />
              <span className="text-[12px] text-default-500">or</span>
              <div className="h-px flex-1 bg-gray-400" />
            </div>
            <GoogleAuthButton onPress={startGoogleLogin} />
          </div>
        </section>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Error"
      >
        {modalMessage}
      </Modal>
    </>
  );
};

export default Register;
