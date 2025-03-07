import axiosApiInstanse from "../../api";
import { defineStore } from "pinia";
import { ref } from "vue";
import useAuthStore from "./auth";
import useAlertsStore from "./alertsStore";

export const useUserStore = defineStore("user", () => {
  const userInRealDb = ref({
    name: "",
    surname: "",
    img: "",
    userId: "",
  });
  const alertsStore = useAlertsStore();

  async function getUserInRealDbtime() {
    const authStore = useAuthStore();
    try {
      const response = await axiosApiInstanse.get(
        "https://myapp-wallet-default-rtdb.europe-west1.firebasedatabase.app/users.json",
      );

      const users = response.data;
      for (const user in users) {
        const item = users[user]; // Данные конкретного пользователя

        if (item.id === authStore?.userTokenData?.localId) {
          userInRealDb.value = {
            name: item.name,
            surname: item.surname,
            img: item.img,
            userId: item.id,
          };
        }
      }
    } catch (error) {
      alertsStore.alertInfo = {
        message: error.message,
        statusCode: error.status,
      };
      console.log(error);
    }
  }
  return { userInRealDb, getUserInRealDbtime };
});

export default useUserStore;
