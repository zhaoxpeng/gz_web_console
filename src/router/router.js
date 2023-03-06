import Vue from "vue";
import VueRouter from "vue-router";
import login from "../view/login.vue";
import index from "../view/index.vue";
import intellectualProperty from "../view/intellectualProperty/intellectualIndex.vue";
import projectDeclaration from "../view/projectDeclaration/projectDeclarationIndex.vue";
import otherManager from "../view/otherManager/otherManager.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  // mode: "history",
  //ES6简写，等于routes：routes
  routes: [
    {
      path: "/",
      name: "login",
      component: login
    },
    {
      path: "/index",
      name: "index",
      component: index
    },
    {
      path: "/intellectualProperty",
      name: "intellectualProperty",
      component: intellectualProperty
    },
    {
      path: "/projectDeclaration",
      name: "projectDeclaration",
      component: projectDeclaration
    },
    {
      path: "/otherManager",
      name: "otherManager",
      component: otherManager
    }
  ]
});
router.beforeEach((to, from, next) => {
  var user = JSON.parse(sessionStorage.getItem("user"));
  if (to.path != "/" && to.name != "login" && user == null) {
    next("/");
  } else {
    next();
  }
});
export default router;
