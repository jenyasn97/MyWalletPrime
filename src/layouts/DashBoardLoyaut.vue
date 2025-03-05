<template>
  <div class="card !bg-white drop-shadow-md">
    <Menubar :model="items" class="!bg-white">
      <template #item="{ item, props }">
        <a
          class="flex items-center"
          v-bind="props.action"
          @click="
            () => {
              showLog(props);
            }
          "
        >
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
        </a>
      </template>
      <template #end>
        <div class="flex items-center gap-4">
          <InputText
            placeholder="Search..."
            type="text"
            class="w-32 sm:w-auto"
          />
          <Avatar
            size="large"
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            shape="circle"
            @click="toggle"
            class="cursor-pointer"
          />
          <Popover ref="op">
            <div class="flex w-[10rem] flex-col gap-2">
              <div>
                <span class="mb-2 block font-medium">{{
                  `${userStore.userInRealDb.name} ${userStore.userInRealDb.surname}`
                }}</span>
                <ul class="m-0 flex list-none flex-col p-0">
                  <li
                    v-for="member in members"
                    :key="member.name"
                    class="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-3 hover:bg-slate-100"
                    @click="selectMember(member)"
                  >
                    <div>
                      <a href="#" class="font-medium">{{ member.name }}</a>
                    </div>
                  </li>
                </ul>
              </div>
              <hr class="opacity-25" />
              <Button
                label="Logout"
                size="small"
                severity="danger"
                @click="logOut"
              ></Button>
            </div>
          </Popover>
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Menubar, Avatar, InputText, Popover, Button } from "primevue";
import useUserStore from "@/store/userStore";

const userStore = useUserStore();

function showLog(item) {
  console.log(item);
}

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
  },
  {
    label: "Orders",
    icon: "pi pi-shopping-cart",
  },
  {
    label: "Products",
    icon: "pi pi-box",
  },
  {
    label: "Customers",
    icon: "pi pi-users",
  },
  {
    label: "Analytics",
    icon: "pi pi-chart-line",
  },
]);

const op = ref();
const selectedMember = ref(null);
const members = ref([
  {
    name: "Settings",
  },
  {
    name: "Support",
  },
]);

const selectMember = (member) => {
  selectedMember.value = member;
  console.log(selectedMember.value.name);
};

const toggle = (event) => {
  op.value.toggle(event);
};

function logOut() {
  document.cookie.split(";").forEach((cookie) => {
    const [name] = cookie.split("=");
    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  });
  location.reload();
}

userStore.getUserInRealDbtime();
</script>

<style scoped></style>
