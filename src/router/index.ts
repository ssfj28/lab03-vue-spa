import { createRouter, createWebHistory } from "vue-router";

import DashboardView from "../views/DashboardView.vue";
import PaletteEditorView from "../views/PaletteEditorView.vue";
import HarmoniesView from "../views/HarmoniesView.vue";
import AccessibilityView from "../views/AccessibilityView.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
    },
    {
      path: "/palettes/new",
      name: "palette-new",
      component: PaletteEditorView,
    },
    {
      path: "/palettes/:id/edit",
      name: "palette-edit",
      component: PaletteEditorView,
    },
    {
      path: "/harmonies",
      name: "harmonies",
      component: HarmoniesView,
    },
    {
      path: "/accessibility",
      name: "accessibility",
      component: AccessibilityView,
    },
  ],
});

export default router;
