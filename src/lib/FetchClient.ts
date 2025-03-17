import Axios, { AxiosError } from "axios";
import { AUTH_INFO_STORAGE, BASE_URL } from "./constants";
import { router } from "@/app/routes";

const createFetchAPIClient = () => {
  const instance = Axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (resp) => resp,
    function (error: AxiosError) {
      if (error.status === 401) {
        localStorage.removeItem(AUTH_INFO_STORAGE);
        router.navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const FetchAPIClient = createFetchAPIClient();
