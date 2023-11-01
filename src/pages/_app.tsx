import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ApolloProvider } from "@apollo/client";
import ThemeProvider from "@/context/Theme";
import ContactProvider from "@/context/Contact";
import apolloClient from "@/libs/apolloClient";

export default function App({ Component, pageProps }: AppProps) {
  const { asPath } = useRouter();

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider>
        <ContactProvider>
          <Component key={asPath} {...pageProps} />
        </ContactProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
