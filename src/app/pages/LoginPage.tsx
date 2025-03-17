import { useState } from "react";
import { Input } from "../../components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";

import { useLocalStorageValue } from "@react-hookz/web";
import { FetchAPIClient } from "@/lib/FetchClient";
import { Label } from "@radix-ui/react-label";
import { AUTH_INFO_STORAGE } from "@/lib/constants";
import { AuthInfo } from "@/lib/types";
import { H3 } from "@/components/ui/typography";
import { useNavigate } from "react-router";

export const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<Error>();
  const { set: setAuthInfo } =
    useLocalStorageValue<AuthInfo>(AUTH_INFO_STORAGE);
  const navigate = useNavigate();

  const { mutate: login } = useMutation({
    mutationFn: () =>
      FetchAPIClient.post<AuthInfo, undefined>("auth/login", { email, name }),
    onSuccess: () => {
      setAuthInfo({ name, email, lastLogin: Date.now() });
      navigate("/");
    },
    onError: (e) => setError(e),
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-svh w-full gap-4">
      <H3>Login</H3>
      <form action={() => login()}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && error.message}
          <Button className="mt-4" type="submit">
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};
