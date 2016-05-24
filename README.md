## Apollo watchQuery for React Komposer

> For more information on React Komposer, see [here](https://github.com/kadirahq/react-komposer).

### Installation

```
npm install --save react-komposer-watchQuery react-komposer apollo-client
```

> react-komposer and apollo-client are peerDependencies of react-komposer-watchQuery

### Usage

In `configs/context.js`:

```
import * as Collections from '../../lib/collections';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router-ssr';
import { Tracker } from 'meteor/tracker';
import { configureGraphQLClient } from 'apollo-tools';

export default function () {
  const Client = configureGraphQLClient({
    url: 'graphql',
    auth: true,
  })

  return {
    Meteor,
    FlowRouter,
    Collections,
    Tracker,
    Client, // make sure to supply this
  };
}
```

Here's an example of a Mantra container:

```
import TodoList from '../../components/todo-list';
import composeWatchQuery from 'react-komposer-watchQuery';
import { useDeps, composeAll } from 'mantra-core';

const options = {
  query = `
    query todos {
      allTodos {
        _id
        todo
        createdAt
      }
    }
  `,
};

const resultMapper = ({
  data,
  errors,
}) => {
  const {
    allTodos,
  } = data;

  return {
    todos: allTodos,
    errors,
  };
};


export default composeAll(
  composeWatchQuery(options, resultMapper),
  useDeps()
)(TodoList);

```
