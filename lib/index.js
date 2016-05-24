'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['', ''], ['', '']);

exports.composeWatchQueryBase = composeWatchQueryBase;
exports.default = composeWatchQuery;

var _reactKomposer = require('react-komposer');

var _gql = require('apollo-client/gql');

var _gql2 = _interopRequireDefault(_gql);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function composeWatchQueryBase(options, fn, props, onData) {
  var _props$context = props.context();

  var Client = _props$context.Client;
  var query = options.query;
  var _options$pollInterval = options.pollInterval;
  var pollInterval = _options$pollInterval === undefined ? 500 : _options$pollInterval;
  var _options$forceFetch = options.forceFetch;
  var forceFetch = _options$forceFetch === undefined ? false : _options$forceFetch;
  var _options$returnPartia = options.returnPartialData;
  var returnPartialData = _options$returnPartia === undefined ? false : _options$returnPartia;
  var others = (0, _objectWithoutProperties3.default)(options, ['query', 'pollInterval', 'forceFetch', 'returnPartialData']);


  var taggedQuery = (0, _gql2.default)(_templateObject, query);

  var queryObservable = Client.watchQuery((0, _extends3.default)({
    query: taggedQuery,
    pollInterval: pollInterval,
    forceFetch: forceFetch,
    returnPartialData: returnPartialData
  }, others));

  var subscription = queryObservable.subscribe({
    next: function next(graphQLResult) {
      var mappedResult = fn(graphQLResult, props);
      onData(null, (0, _extends3.default)({}, mappedResult, {
        subscription: subscription
      }));
    },
    error: function error(_error) {
      onData(_error);
    }
  });
}

function composeWatchQuery(options, fn) {
  return (0, _reactKomposer.compose)(composeWatchQueryBase.bind(null, options, fn));
}