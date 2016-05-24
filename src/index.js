import { compose } from 'react-komposer';
import gql from 'apollo-client/gql';

export function composeWatchQueryBase(options, fn, props, onData) {
  if (options === null || typeof options !== 'object') {
    const error = 'No options object passed as argument';
    throw new Error(error);
  }

  if (!options.hasOwnProperty('query')) {
    const error = 'query is missing';
    throw new Error(error);
  }

  if (typeof options.query !== 'string') {
    const error = 'query should be string';
    throw new Error(error);
  }

  if (fn === null || typeof fn !== 'function') {
    const error = 'No resultMapper function passed as argument';
    throw new Error(error);
  }

  if (!props.context) {
    const error = 'No context passed as prop';
    throw new Error(error);
  }

  const context = typeof props.context === 'function' ? props.context() : props.context;

  const Client = context.Client || context.client;

  if (!Client) {
    const error = 'No Apollo Client found in the context';
    throw new Error(error);
  }

  const {
    query,
    pollInterval = 500,
    forceFetch = false,
    returnPartialData = false,
    ...others,
  } = options;

  const taggedQuery = gql`${query}`;

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
