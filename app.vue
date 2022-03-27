<template>
  <div>
    <link 
      rel="stylesheet"
      href="/assets/css/main.scss"
    >
    <NuxtPage class="page-container" />
  </div>
</template>

<script>
import "@fontsource/inter";

const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
  document.body.classList.toggle("dark-mode");
} else if (currentTheme === "light") {
  document.body.classList.toggle("light-mode");
}
</script>

<style>
body {
  margin: 48px 250px;
  background-color: var(--background-page-color);
}

</style>