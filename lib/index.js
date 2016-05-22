import { compose } from 'react-komposer';
import gql from 'apollo-client/gql';

export function composeWatchQueryBase(options, fn, props, onData) {
  const { Client } = props.context();
  const {
    query,
    pollInterval = 500,
    forceFetch = false,
    returnPartialData = false,
    ...others,
  } = options;

  const taggedQuery = gql`
    {
      ${query}
    }
  `;

  const queryObservable = Client.watchQuery({
    query: taggedQuery,
    pollInterval,
    forceFetch,
    returnPartialData,
    ...others,
  });

  const subscription = queryObservable.subscribe({
    next: (graphQLResult) => {
      const mappedResult = fn(graphQLResult, props);
      onData(null, {
        ...mappedResult,
        subscription,
      });
    },
    error: (error) => {
      onData(error);
    },
  });
}

export default function composeWatchQuery(options, fn) {
  return compose(composeWatchQueryBase.bind(null, options, fn));
}
