import { defineStore } from "pinia";
import { ref } from "vue";

export const useAlertsStore = defineStore("alert", () => {
  const alertInfo = ref({
    message: "",
    statusCode: null,
    severity: "",
  });

  function resetAlertInfo() {
    return (alertInfo.value = {
      message: "",
      statusCode: null,
      severity: "",
    });
  }

  const SUCCESS_STATUS_CODES = [200, 201];
  const ERROR_STATUS_CODES = [400, 401, 403, 500, 502, 503];

  function setAlert(severity, summary, detail, life = 3000) {
    return {
      summary,
      severity,
      detail,
      life,
    };
  }

  function showToastMessage(toast) {
    if (ERROR_STATUS_CODES.includes(alertInfo.value.statusCode)) {
      toast.add(setAlert("error", "Error Message", alertInfo.value.message));
      resetAlertInfo();
    } else if (SUCCESS_STATUS_CODES.includes(alertInfo.value.statusCode)) {
      toast.add(
        setAlert("success", "Success Message", alertInfo.value.message),
      );
      resetAlertInfo();
    } else {
      toast.add(setAlert("warn", "Warn Message", "Unknow error"));
      resetAlertInfo();
    }
  }

  return { alertInfo, showToastMessage };
});

export default useAlertsStore;
