import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { FetchAPIClient } from "@/lib/FetchClient";
import { useLocalStorageValue } from "@react-hookz/web";
import { useMutation } from "@tanstack/react-query";
import { AUTH_INFO_STORAGE } from "@/lib/constants";
import { AuthInfo } from "@/lib/types";
import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";

export const NavigationLayout = () => {
  const { value: authInfo, remove } =
    useLocalStorageValue<AuthInfo>(AUTH_INFO_STORAGE);
  const navigate = useNavigate();

  const { mutate: logout } = useMutation({
    mutationFn: () => FetchAPIClient.post<undefined, undefined>("auth/logout"),
    onSettled: () => remove(),
  });

  useEffect(() => {
    if (!authInfo) {
      navigate("/login");
    }
  }, [authInfo, navigate]);

  if (!authInfo) {
    return null;
  }
  return (
    <div>
      <div className="sticky top-0 w-full border-b bg-background z-40 flex p-2">
        <NavigationMenu className="ml-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Hi {authInfo.name}!</NavigationMenuTrigger>
              <NavigationMenuContent>
                <Button variant="ghost" onClick={() => logout()}>
                  Logout
                </Button>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <Outlet />
    </div>
  );
};
