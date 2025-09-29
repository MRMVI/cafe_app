<!-- Admin Layout -->
<template>
  <section class="adminDashboard">
    <aside class="sidebar">
      <ul>
        <li><router-link to="/dashboard/add-item">Add Item</router-link></li>
        <li><router-link to="/dashboard/orders">Orders</router-link></li>
        <li>Logout</li>
      </ul>
    </aside>

    <main>
      <router-view />
    </main>
  </section>
</template>

<script setup>
//const router = useRouter()
// router.push("/login")
</script>
