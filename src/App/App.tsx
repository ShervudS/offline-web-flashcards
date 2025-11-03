import { RouterProvider } from "atomic-router-react";

import { ConfirmProvider } from "_shared/ModalConfirm/ConfirmProvider";
import { RoutesView } from "_pages/index";
import { Footer } from "_widgets/Footer";
import { Header } from "_widgets/Header";

import { router } from "_processes/routing";

export const App = () => (
  <RouterProvider router={router}>
    <ConfirmProvider>
      <Header />

      <main className="flex flex-col gap-1 min-h-screen content-container">
        <RoutesView />
      </main>

      <Footer />
    </ConfirmProvider>
  </RouterProvider>
);
