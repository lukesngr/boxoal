import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const queryClient = new QueryClient();

function BoxAlc({ Component, pageProps: { session, ...pageProps} }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
          <Component {...pageProps} />
      </SessionProvider>
      <ReactQueryDevtools />
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default BoxAlc;