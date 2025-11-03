import {
  createHistoryRouter,
  createRoute,
  createRouterControls,
} from "atomic-router";
import { createBrowserHistory } from "history";

import { sample } from "effector";
import { startedApp } from "_entities/app/model";

export const routes = {
  home: createRoute(),
  upload: createRoute(),
  profile: createRoute(),
  auth: {
    register: createRoute(),
    login: createRoute(),
  },
  notFound: createRoute(),
};

export const controls = createRouterControls();

export const router = createHistoryRouter({
  routes: [
    {
      path: "/profile",
      route: routes.profile,
    },
    {
      path: "/upload",
      route: routes.upload,
    },
    {
      path: "/",
      route: routes.home,
    },
  ],
  controls,
  notFoundRoute: routes.notFound,
});

sample({
  clock: startedApp,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
});
