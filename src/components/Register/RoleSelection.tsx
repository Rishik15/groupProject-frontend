import RoleCard from "./RoleCard";

interface RoleProps {
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const RoleSelector = ({ role, setRole }: RoleProps) => {
  return (
    <section className="flex flex-col pt-6">
      <h4 className="text-sm mb-2 font-[525]">I want to...</h4>

      <div className="flex gap-4">
        <RoleCard
          title="Train"
          desc="Find a coach & track progress"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          }
          active={role === "client"}
          onClick={() => setRole("client")}
        />

        <RoleCard
          title="Coach"
          desc="Manage clients & sessions"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"></path>
              <path d="m2.5 21.5 1.4-1.4"></path>
              <path d="m20.1 3.9 1.4-1.4"></path>
              <path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"></path>
              <path d="m9.6 14.4 4.8-4.8"></path>
            </svg>
          }
          active={role === "coach"}
          onClick={() => setRole("coach")}
        />
      </div>
    </section>
  );
};

export default RoleSelector;
