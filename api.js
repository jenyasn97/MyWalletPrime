import { getCookie } from "@/lib/utils";
import useAuthStore from "@/store/auth";
import axios from "axios";
import router from "@/router";
import useAlertsStore from "@/store/alertsStore";

const axiosApiInstanse = axios.create();
const apiKey = import.meta.env.VITE_API_KEY;

axiosApiInstanse.interceptors.request.use(
  (config) => {
    const url = config.url;
    if (!url.includes("signInWithPassword") && !url.includes("signUp")) {
      const authStore = useAuthStore();
      let userTokenData = localStorage.getItem("userTokenData");

      if (userTokenData) {
        authStore.userTokenData = JSON.parse(userTokenData);
      }

      let params = new URLSearchParams();
      const token = getCookie("Wallet-Access-Token");
      if (token) {
        params.append("auth", token);
      }

      config.params = params;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosApiInstanse.interceptors.response.use(
  (response) => {
    const alertsStore = useAlertsStore();
    alertsStore.alertInfo = {
      message: "The request was completed successfully",
      statusCode: response.status,
    };
    return response;
  },
  async function (error) {
    const authStore = useAuthStore();
    const alertsStore = useAlertsStore();
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getCookie("Wallet-Refresh-Token");
        if (!refreshToken) throw new Error("No refresh token available");

        const newTokens = await axios.post(
          `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
          {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          },
        );

        authStore.userTokenData.idToken = newTokens.data.access_token;
        authStore.userTokenData.refreshToken = newTokens.data.refresh_token;

        document.cookie = `Wallet-Access-Token=${newTokens.data.access_token}; secure`;
        document.cookie = `Wallet-Refresh-Token=${newTokens.data.refresh_token}; secure`;

        return axiosApiInstanse(originalRequest);
      } catch (err) {
        document.cookie = "Wallet-Access-Token=; Max-Age=-1;";
        document.cookie = "Wallet-Refresh-Token=; Max-Age=-1;";

        authStore.userTokenData = {
          idToken: "",
          localId: "",
          refreshToken: "",
        };
        localStorage.removeItem("userTokenData");

        router.push("/login");
      }
    }

    alertsStore.alertInfo = {
      message: error.response?.data?.error?.message || "Unknown error",
      statusCode: error.response?.status || 500,
    };

    return Promise.reject(error);
  },
);

export default axiosApiInstanse;
