<template>
  <div class="index">
    <div class="page-header">
      <el-menu
        class="menu"
        mode="horizontal"
        :default-active="$route.path"
        :router="true"
      >
        <el-menu-item index="/topo">拓扑信息</el-menu-item>
        <el-menu-item index="/ping">路径选择</el-menu-item>
      </el-menu>
    </div>
    <div class="page-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "Topo",
    };
  },
  methods: {
    handleTabClick() {
      console.log("clicked");
    },
  },
};
</script>

<style scoped>
.index {
  width: 100%;
  height: 100%;
}
</style>
