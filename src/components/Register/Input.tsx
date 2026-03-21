import { useState } from "react";
import { InputGroup, Label, TextField, Button } from "@heroui/react";
import { KeyRound, User, Mail, Eye, EyeOff } from "lucide-react";

interface RegisterProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const RegisterInputs = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
}: RegisterProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col gap-3 w-full pt-4">
      <TextField name="name">
        <Label className="text-sm">Full Name</Label>

        <InputGroup className="bg-transparent border border-gray-300 shadow-2xs">
          <InputGroup.Prefix>
            <User className="size-4 text-muted" />
          </InputGroup.Prefix>

          <InputGroup.Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </InputGroup>
      </TextField>

      <TextField name="email">
        <Label className="text-sm">Email Address</Label>

        <InputGroup className="bg-transparent border border-gray-300 shadow-2xs ">
          <InputGroup.Prefix>
            <Mail className="size-4 text-muted" />
          </InputGroup.Prefix>

          <InputGroup.Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
          />
        </InputGroup>
      </TextField>

      <TextField name="password">
        <Label className="text-sm">Password</Label>

        <InputGroup className="bg-transparent border border-gray-300 shadow-2xs ">
          <InputGroup.Prefix>
            <KeyRound className="size-4 text-muted" />
          </InputGroup.Prefix>
          <InputGroup.Input
            type={isVisible ? "text" : "password"}
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputGroup.Suffix className="pr-0">
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              aria-label={isVisible ? "Hide password" : "Show password"}
              onPress={() => setIsVisible(!isVisible)}
            >
              {isVisible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </InputGroup.Suffix>
        </InputGroup>
      </TextField>
    </div>
  );
};

export default RegisterInputs;
