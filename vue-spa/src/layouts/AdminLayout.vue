<!-- Admin Layout -->
<template>
  <section class="admin-dashboard">
    <header>
      <nav>
        <ul>
          <li><router-link to="/dashboard/add-item">Menu</router-link></li>
          <li><router-link to="/dashboard/orders">Orders</router-link></li>
          <li><router-link to="/logout">Log out</router-link></li>
        </ul>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer class="footer">
      <p class="footer__text">© 2025 Fireside Café. All rights reserved.</p>
    </footer>
  </section>
</template>

<script setup>
//const router = useRouter()
// router.push("/login")
</script>

<style lang="scss">
@use "@/assets/styles/variables" as *;
@use "@/assets/styles/mixins" as *;

.admin-dashboard {
  @include mainContainer();
}

.footer {
  background-color: $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  width: 100%;
}

.footer__text {
  @include body-text();
  @include responsive-font(0.5rem, 1.5vw, 1rem);

  color: $color-highlight;
}
</style>
