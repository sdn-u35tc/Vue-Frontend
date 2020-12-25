import Vue from "vue";
import Router from "vue-router";
import Index from "../components/Index";
import Topo from "../components/Topo";
import Ping from "../components/Ping";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Index",
      redirect: "/topo",
      component: Index,
      children: [
        {
          path: "/topo",
          name: "Topo",
          component: Topo
        },
        {
          path: "/ping",
          name: "Ping",
          component: Ping
        }
      ]
    }
  ]
});
