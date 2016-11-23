'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTestUtils = require('react-addons-test-utils');

var _reactAddonsTestUtils2 = _interopRequireDefault(_reactAddonsTestUtils);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _dom = require('../dom');

var _testUtils = require('./test-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var document = global.document;

describe('DocumentMeta - DOM nested', function () {

  var DOC_META = {
    title: 'This is a document title',
    description: 'This meta value is describing the page we are looking at',
    canonical: 'http://domain.tld/path/to/page',
    meta: {
      charset: 'utf-8',
      name: {
        keywords: 'react,document,meta,tags'
      }
    },
    link: {
      rel: {
        stylesheet: ['http://domain.tld/css/vendor.css', 'http://domain.tld/css/styles.css']
      }
    }
  };

  var DOC_META_NESTED = {
    title: 'This is another document title',
    description: null,
    canonical: 'http://domain.tld/path/to/other',
    meta: {
      name: {
        keywords: 'react,document,meta,tags,nesting'
      }
    },
    link: {
      rel: {}
    }
  };

  beforeEach(function () {
    _2.default.canUseDOM = true;
    (0, _dom.removeDocumentMeta)();
    _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_2.default, DOC_META),
      _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_2.default, _extends({}, DOC_META_NESTED, { extend: true }))
      )
    ));
  });

  it('should render document.title / <title> according to the nested title-prop', function () {
    _assert2.default.strictEqual(document.title, DOC_META_NESTED.title);
  });

  it('should render <meta name="description" content="..."> according to the nested description-prop', function () {
    _assert2.default.strictEqual((0, _testUtils.getAttr)('meta[name=description]', 'content'), DOC_META_NESTED.description);
  });

  it('should render <link rel="canonical" href="..." according to the nested canonical-prop', function () {
    _assert2.default.strictEqual((0, _testUtils.getAttr)('link[rel=canonical]', 'href'), DOC_META_NESTED.canonical);
  });

  it('should render simple meta tags, eg. <meta charset="...">', function () {
    _assert2.default.strictEqual((0, _testUtils.getAttr)('meta[charset]', 'charset'), DOC_META.meta.charset);
  });

  it('should render normal meta tags, eg. <meta name="..." content="...">', function () {
    Object.keys(DOC_META.meta.name).forEach(function (name) {
      var value = DOC_META_NESTED.meta.name.hasOwnProperty(name) ? DOC_META_NESTED.meta.name[name] : DOC_META.meta.name[name];
      _assert2.default.strictEqual((0, _testUtils.getAttr)('meta[name=' + name + ']', 'content'), value, '<meta name="' + name + '" ... /> has not been rendered correctly');
    });
  });

  it('should render normal link tags, eg. <link rel="..." href="...">', function () {
    Object.keys(DOC_META.link.rel).forEach(function (rel) {
      var value = DOC_META_NESTED.link.rel.hasOwnProperty(rel) ? DOC_META_NESTED.link.rel[rel] : DOC_META.link.rel[rel];
      var values = Array.isArray(value) ? value : [value];

      var idx = 0;
      var elements = (0, _testUtils.getElements)('link[rel=' + rel + ']');
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var element = _step.value;

          _assert2.default.strictEqual(element.getAttribute('href'), values[idx++], '<link rel="' + rel + '" ... /> has not been rendered correctly');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
  });

  describe('Deep nesting', function () {
    beforeEach(function () {
      _2.default.canUseDOM = true;
      (0, _dom.removeDocumentMeta)();
      _reactAddonsTestUtils2.default.renderIntoDocument(_react2.default.createElement(
        _2.default,
        { meta: { name: { l1: 'a' } } },
        _react2.default.createElement(
          _2.default,
          { meta: { name: { l2: 'b' } }, extend: true },
          _react2.default.createElement(
            _2.default,
            { meta: { name: { l3: 'c' } } },
            _react2.default.createElement(_2.default, { meta: { name: { l4: 'd' } }, extend: true })
          )
        )
      ));
    });

    it('should render inside-out, but only as long as the parent component is extendable', function () {
      var expected = { l4: 'd', 'l3': 'c' };
      var actual = {};

      var elements = (0, _testUtils.getElements)('meta[name]');
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = elements[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var element = _step2.value;

          var name = element.getAttribute('name');
          actual[name] = element.getAttribute('content');
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      _assert2.default.deepEqual(expected, actual, '<meta name="..." content="..." /> has not been rendered correctly');
    });
  });
});
