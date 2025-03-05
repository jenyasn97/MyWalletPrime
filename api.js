import { getCookie } from "@/lib/utils";
import useAuthStore from "@/store/auth";
import axios from "axios";
import router from "@/router";
import useAlertsStore from "@/store/alertsStore";

const axiosApiInstanse = axios.create();
const apiKey = import.meta.env.VITE_API_KEY;

axiosApiInstanse.interceptors.request.use((config) => {
  const url = config.url;
  if (!url.includes("signInWithPassword") && !url.includes("signUp")) {
    const authStore = useAuthStore();
    let params = new URLSearchParams();
    params.append("auth", getCookie("Wallet-Access-Token"));
    authStore.userTokenData = JSON.parse(localStorage.getItem("userTokenData"));
    config.params = params;
  }
  return config;
});

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
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newTokens = await axios.post(
          `https://securetoken.googleapis.com/v1/token?key=${apiKey} `,
          {
            grant_type: "refresh_token",
            refresh_token: getCookie("Wallet-Refresh-Token"),
          },
        );
        authStore.userTokenData.idToken = newTokens.data.access_token;
        authStore.userTokenData.refreshToken = newTokens.data.refresh_token;
        document.cookie = `Wallet-Access-Token=${newTokens.data.access_token}; secure`;
        document.cookie = `Wallet-Refresh-Token=${newTokens.data.refresh_token}; secure`;
      } catch (err) {
        document.cookie = "Wallet-Access-Token=; Max-Age=-1;";
        document.cookie = "Wallet-Refresh-Token=; Max-Age=-1;";
        authStore.userTokenData.idToken = "";
        authStore.userTokenData.refreshToken = "";
        router.push("/login");
      }
    }
    alertsStore.alertInfo = {
      message: error.response.data.error.message,
      statusCode: error.response.data.error.code,
    };
  },
);

export default axiosApiInstanse;
