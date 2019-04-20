<template>
  <q-page >
    <q-tabs
      v-model="tab"
      class="cn-bold-font bg-adminTitle text-white shadow-2"
      active-color="adminSecondary"
      indicator-color="adminSecondary"
      align="justify"
      narrow-indicator
    >
      <q-route-tab class="" name="student" label="学员"
                   @click="resetSelectionLabel()"
                   to="/admin/dashboard/student"/>
      <q-route-tab class="" name="teacher" label="教师"
                   @click="resetSelectionLabel()"
                   to="/admin/dashboard/teacher" />
      <q-route-tab class="" name="follow" label="关注"
                   @click="resetSelectionLabel()"
                   to="/admin/dashboard/follow" />
      <q-route-tab class="" name="line" label="Line 绑定"
                   @click="resetSelectionLabel()"
                   to="/admin/dashboard/linebind" />
    </q-tabs>
    <router-view/>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      tab: 'students'
    }
  }
  // name: 'PageName',
}
</script>

<style>
</style>
