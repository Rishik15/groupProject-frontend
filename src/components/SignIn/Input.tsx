import { useState } from "react";
import { InputGroup, Label, TextField, Button } from "@heroui/react";
import { KeyRound, Mail, Eye, EyeOff } from "lucide-react";

interface SignInProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const SignInputs = ({
  email,
  setEmail,
  password,
  setPassword,
}: SignInProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col gap-3 w-full pt-6">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={isVisible ? "text" : "password"}
            placeholder="Minimum 8 characters"
          />

          <InputGroup.Suffix className="pr-0">
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
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

export default SignInputs;
