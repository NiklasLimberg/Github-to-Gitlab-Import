import config from '#config'

import apolloClient from 'apollo-client';
const { ApolloClient } = apolloClient;
import apolloInMemoryCache from 'apollo-cache-inmemory';
const { InMemoryCache } = apolloInMemoryCache;
import apolloHttpLink from 'apollo-link-http';
const { HttpLink } = apolloHttpLink;
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
        __schema: {
            types: []
        }
    }
});


export function githubClient() {
    if (!config.GITHUB_API_TOKEN) {
        throw new Error(
            "You need to provide a Github personal access token as `GITHUB_TOKEN` env variable. See README for more info."
        );
    }

    return new ApolloClient({
        link: new HttpLink({
            uri: "https://api.github.com/graphql",
            headers: {
                authorization: `token ${config.GITHUB_API_TOKEN}`,
            },
        }),
        cache: new InMemoryCache({ fragmentMatcher })
    });
}
