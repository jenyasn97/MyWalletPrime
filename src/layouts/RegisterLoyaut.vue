<template>
  <div class="flex h-screen items-center px-6 md:px-12 lg:px-20">
    <Form
      v-slot="$form"
      :resolver="resolver"
      :initialValues="initialValues"
      @submit="onFormSubmit"
      class="mx-auto w-full rounded-lg px-6 py-12 text-sm shadow-2xl md:w-6/9 lg:w-4/9 lg:text-base"
    >
      <div class="mb-8 flex flex-col items-center justify-center text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 50 50"
        >
          <g
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          >
            <path
              stroke="#306cfe"
              d="M39.583 8.333H10.417A4.167 4.167 0 0 0 6.25 12.5v0a4.167 4.167 0 0 0 4.167 4.167H43.75"
            />
            <path
              stroke="#306cfe"
              d="M43.75 16.667v22.916a2.083 2.083 0 0 1-2.083 2.084H8.333a2.083 2.083 0 0 1-2.083-2.084V12.5a4.167 4.167 0 0 0 4.167 4.167z"
            />
            <path
              stroke="#344054"
              d="M33.333 25H43.75v8.333H33.333a2.083 2.083 0 0 1-2.083-2.083v-4.167A2.083 2.083 0 0 1 33.333 25"
            />
          </g>
        </svg>

        <div
          class="mb-2 text-2xl font-medium text-zinc-900 xl:mb-4 xl:text-3xl"
        >
          Welcome in MyWalletApp
        </div>
        <span class="text-sm font-medium text-zinc-600 xl:text-base"
          >Do you already have an account?</span
        >
        <RouterLink
          to="/signin"
          class="text-primary ml-2 cursor-pointer font-medium no-underline"
          >Come in!</RouterLink
        >
      </div>
      <div class="mb-4 flex justify-between gap-4">
        <div class="flex w-1/2 flex-col">
          <label for="name" class="mb-2 block font-medium text-zinc-900"
            >Your name</label
          >
          <InputText
            name="name"
            id="name"
            type="text"
            placeholder="name"
            v-model="initialValues.name"
          />
          <Message
            v-if="$form.name?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.name.error?.message }}</Message
          >
        </div>
        <div class="flex w-1/2 flex-col">
          <label for="surname" class="mb-2 block font-medium text-zinc-900"
            >Your surname</label
          >
          <InputText
            v-model="initialValues.surname"
            name="surname"
            id="surname"
            type="text"
            placeholder="surname"
          />
          <Message
            v-if="$form.surname?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.surname.error?.message }}</Message
          >
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div class="flex flex-col">
          <label for="email" class="mb-2 block font-medium text-zinc-900"
            >Email</label
          >
          <InputText
            v-model="initialValues.email"
            name="email"
            id="email"
            type="text"
            placeholder="email"
            fluid
          />
          <Message
            v-if="$form.email?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.email.error?.message }}</Message
          >
        </div>
        <div>
          <label for="password" class="mb-2 block font-medium text-zinc-900"
            >Password</label
          >
          <Password
            v-model="initialValues.password"
            name="password"
            type="password"
            id="password"
            placehoder="Password"
            :feedback="false"
            toggleMask
            fluid
            class="w-full"
          />
          <Message
            v-if="$form.password?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $form.password.error?.message }}</Message
          >
        </div>

        <Button
          label="Sign Up"
          :loading="authStore.isLoading"
          icon="pi pi-user !text-xl !leading-none"
          class="w-full !text-base xl:!text-xl"
          type="submit"
        />
      </div>
    </Form>
    <Toast />
  </div>
</template>
<script setup>
import { Password, InputText, Button, Message, Toast } from "primevue";
import { Form } from "@primevue/forms";
import { useToast } from "primevue/usetoast";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { z } from "zod";
import { ref } from "vue";
import { addUser } from "@/lib/utils";
import useAuthStore from "@/store/auth";
import useAlertsStore from "@/store/alertsStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const alertsStore = useAlertsStore();
const toast = useToast();
const router = useRouter();

const initialValues = ref({
  name: "",
  surname: "",
  email: "",
  password: "",
});

async function register() {
  try {
    await authStore.auth({
      email: initialValues.value.email,
      password: initialValues.value.password,
    });
    await addUser(
      initialValues.value.name,
      initialValues.value.surname,
      initialValues.value.email,
      authStore.userTokenData.localId,
    );
    alertsStore.showToastMessage(toast);
    setTimeout(() => {
      router.push("/signin");
    }, 1000);
  } catch (e) {
    alertsStore.showToastMessage(toast);
  }
}

const onFormSubmit = ({ valid }) => {
  if (valid) {
    register();
  }
};

//Позволяет валидировать данные ввода в инпут
const resolver = ref(
  zodResolver(
    z.object({
      name: z.string().min(1, { message: "Name is required." }),
      surname: z.string().min(1, { message: "Surname is required." }),
      password: z.string().min(6, {
        message: "A password of at least 6 characters is required.",
      }),
      email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Invalid email address." }),
    }),
  ),
);
</script>
