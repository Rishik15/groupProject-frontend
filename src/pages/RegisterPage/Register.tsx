import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegFooter from "../../components/Register/Footer";
import RegHeader from "../../components/Register/Header";
import RegInput from "../../components/Register/Input";
import RoleSelector from "../../components/Register/RoleSelection";
import { register } from "../../services/auth/register";
import { validateRegister } from "../../utils/auth/validateInputs";
import Modal from "../../components/global/Modal";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!role) {
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

      const data = await register(name, email, password, role);

      if (data.role === "coach") {
        navigate("/coach");
      } else {
        navigate("/client");
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

          <RoleSelector role={role} setRole={setRole} />

          <RegInput
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
          />

          <RegFooter onSubmit={handleRegister} />
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
