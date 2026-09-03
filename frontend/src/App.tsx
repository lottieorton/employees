import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppRoutes from "./components/AppRoutes/AppRoutes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <main className="bg-gray-50 min-h-screen flex flex-col items-center">
        <div className="font-sans p-4 flex flex-col w-full max-w-250 md:p-10 3xl:max-w-350">
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </div>
      </main>
    </QueryClientProvider>
  );
}

export default App;
