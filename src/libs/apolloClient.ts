import { ApolloClient, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URI || "https://wpe-hiring.tokopedia.net/graphql",
  cache: new InMemoryCache(),
});

export default apolloClient;
