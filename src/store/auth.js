import { defineStore } from "pinia";
import { ref } from "vue";
import axiosApiInstanse from "../../api";

export const useAuthStore = defineStore("auth", () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const isLoading = ref(false);

  const userTokenData = ref({
    idToken: "",
    localId: "",
    refreshToken: "",
  });

  async function auth(payload, type) {
    const stringUrl = type === "login" ? "signInWithPassword" : "signUp";
    try {
      isLoading.value = true;
      const response = await axiosApiInstanse.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:${stringUrl}?key=${apiKey}`,
        {
          ...payload,
          returnSecureToken: true,
        },
      );

      userTokenData.value = {
        idToken: response.data.idToken,
        localId: response.data.localId,
        refreshToken: response.data.refreshToken,
      };

      localStorage.setItem(
        "userTokenData",
        JSON.stringify(userTokenData.value),
      );
      if (type === "login") {
        document.cookie = `Wallet-Access-Token=${userTokenData.value.idToken}; secure`;
        document.cookie = `Wallet-Refresh-Token=${userTokenData.value.refreshToken}; secure`;
      }
    } catch (err) {
      throw new Error();
    } finally {
      isLoading.value = false;
    }
  }
  return { isLoading, userTokenData, auth };
});

export default useAuthStore;
