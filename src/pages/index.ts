import { createRoutesView } from "atomic-router-react";

import { HomeRoute } from "./home";
import { UploadRoute } from "./upload";
import { NotFoundRoute } from "./notFound";

export const RoutesView = createRoutesView({
  routes: [HomeRoute, UploadRoute, NotFoundRoute],
  // otherwise() {
  //   return <div>Page not found!</div>;
  // },
});
