<template>
  <div class="relative mt-auto flex h-[80vh] flex-col">
    <div class="flex flex-1 flex-col justify-center">
      <div class="relative z-20 flex flex-1 justify-center">
        <div class="flex h-full items-center justify-center">
          <div class="w-full max-w-2xl px-6 py-12 text-center lg:p-12 xl:p-16">
            <h1 class="mb-6 text-4xl !leading-tight font-bold xl:text-5xl">
              <span class="block">Oops! Page Not Found</span>
              <span class="text-primary block">Error 404</span>
            </h1>

            <p class="mb-8 max-w-xl text-xl leading-normal lg:max-w-none">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>

            <div class="flex items-center justify-center gap-4">
              <Button
                label="Home Page"
                type="button"
                outlined
                @click="router.push('/')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from "primevue/button";
import svg from "../assets/404.svg";
import { useRouter } from "vue-router";
const router = useRouter();
</script>
