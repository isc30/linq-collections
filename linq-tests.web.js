(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
// -
// Created by Ivan Sanz (@isc30)
// Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
// -
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Enumerables_1 = require("./Enumerables");
var Comparers_1 = require("./Comparers");
// endregion
// region EnumerableCollection
var EnumerableCollection = /** @class */ (function () {
    function EnumerableCollection() {
    }
    EnumerableCollection.prototype.toList = function () {
        return new List(this.toArray());
    };
    EnumerableCollection.prototype.toDictionary = function (keySelector, valueSelector) {
        return Dictionary.fromArray(this.toArray(), keySelector, valueSelector);
    };
    EnumerableCollection.prototype.reverse = function () {
        return new Enumerables_1.ReverseEnumerable(this.asEnumerable());
    };
    EnumerableCollection.prototype.concat = function (other) {
        var others = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            others[_i - 1] = arguments[_i];
        }
        return (_a = this.asEnumerable()).concat.apply(_a, [other].concat(others));
        var _a;
    };
    EnumerableCollection.prototype.contains = function (element) {
        return this.any(function (e) { return e === element; });
    };
    EnumerableCollection.prototype.where = function (predicate) {
        return new Enumerables_1.ConditionalEnumerable(this.asEnumerable(), predicate);
    };
    EnumerableCollection.prototype.select = function (selector) {
        return new Enumerables_1.TransformEnumerable(this.asEnumerable(), selector);
    };
    EnumerableCollection.prototype.selectMany = function (selector) {
        var selectToEnumerable = function (e) {
            var ie = selector(e);
            return ie instanceof Array
                ? new Enumerables_1.ArrayEnumerable(ie)
                : ie.asEnumerable();
        };
        return this
            .select(selectToEnumerable).toArray()
            .reduce(function (p, c) { return new Enumerables_1.ConcatEnumerable(p, c); }, Enumerables_1.Enumerable.empty());
    };
    EnumerableCollection.prototype.elementAt = function (index) {
        var element = this.elementAtOrDefault(index);
        if (element === undefined) {
            throw new Error("Out of bounds");
        }
        return element;
    };
    EnumerableCollection.prototype.except = function (other) {
        return this.asEnumerable().except(other);
    };
    EnumerableCollection.prototype.first = function (predicate) {
        var element;
        if (predicate !== undefined) {
            element = this.firstOrDefault(predicate);
        }
        else {
            element = this.firstOrDefault();
        }
        if (element === undefined) {
            throw new Error("Sequence contains no elements");
        }
        return element;
    };
    EnumerableCollection.prototype.groupBy = function (keySelector, valueSelector) {
        var array = this.toArray();
        var dictionary = new Dictionary();
        for (var i = 0; i < array.length; ++i) {
            var key = keySelector(array[i]);
            var value = valueSelector !== undefined
                ? valueSelector(array[i])
                : array[i];
            if (!dictionary.containsKey(key)) {
                dictionary.set(key, new List());
            }
            dictionary.get(key).push(value);
        }
        return dictionary.asEnumerable();
    };
    EnumerableCollection.prototype.last = function (predicate) {
        var element;
        if (predicate !== undefined) {
            element = this.lastOrDefault(predicate);
        }
        else {
            element = this.lastOrDefault();
        }
        if (element === undefined) {
            throw new Error("Sequence contains no elements");
        }
        return element;
    };
    EnumerableCollection.prototype.single = function (predicate) {
        var element;
        if (predicate !== undefined) {
            element = this.singleOrDefault(predicate);
        }
        else {
            element = this.singleOrDefault();
        }
        if (element === undefined) {
            throw new Error("Sequence contains no elements");
        }
        return element;
    };
    EnumerableCollection.prototype.singleOrDefault = function (predicate) {
        if (predicate !== undefined) {
            return this.asEnumerable().singleOrDefault(predicate);
        }
        return this.asEnumerable().singleOrDefault();
    };
    EnumerableCollection.prototype.skipWhile = function (predicate) {
        return this.asEnumerable().skipWhile(predicate);
    };
    EnumerableCollection.prototype.takeWhile = function (predicate) {
        return this.asEnumerable().takeWhile(predicate);
    };
    EnumerableCollection.prototype.sequenceEqual = function (other, comparer) {
        if (comparer !== undefined) {
            return this.asEnumerable().sequenceEqual(other, comparer);
        }
        return this.asEnumerable().sequenceEqual(other);
    };
    EnumerableCollection.prototype.distinct = function (keySelector) {
        return new Enumerables_1.UniqueEnumerable(this.asEnumerable(), keySelector);
    };
    EnumerableCollection.prototype.min = function (selector) {
        if (selector !== undefined) {
            // Don't copy iterators
            return new Enumerables_1.TransformEnumerable(this.asEnumerable(), selector).min();
        }
        return this.aggregate(function (previous, current) {
            return (previous !== undefined && previous < current)
                ? previous
                : current;
        });
    };
    EnumerableCollection.prototype.orderBy = function (keySelector, comparer) {
        return new Enumerables_1.OrderedEnumerable(this.asEnumerable(), Comparers_1.createComparer(keySelector, true, comparer));
    };
    EnumerableCollection.prototype.orderByDescending = function (keySelector) {
        return new Enumerables_1.OrderedEnumerable(this.asEnumerable(), Comparers_1.createComparer(keySelector, false, undefined));
    };
    EnumerableCollection.prototype.max = function (selector) {
        if (selector !== undefined) {
            // Don't copy iterators
            return new Enumerables_1.TransformEnumerable(this.asEnumerable(), selector).max();
        }
        return this.aggregate(function (previous, current) {
            return (previous !== undefined && previous > current)
                ? previous
                : current;
        });
    };
    EnumerableCollection.prototype.sum = function (selector) {
        return this.aggregate(function (previous, current) { return previous + selector(current); }, 0);
    };
    EnumerableCollection.prototype.skip = function (amount) {
        return new Enumerables_1.RangeEnumerable(this.asEnumerable(), amount, undefined);
    };
    EnumerableCollection.prototype.take = function (amount) {
        return new Enumerables_1.RangeEnumerable(this.asEnumerable(), undefined, amount);
    };
    EnumerableCollection.prototype.union = function (other) {
        return new Enumerables_1.UniqueEnumerable(this.concat(other));
    };
    EnumerableCollection.prototype.aggregate = function (aggregator, initialValue) {
        if (initialValue !== undefined) {
            return this.asEnumerable().aggregate(aggregator, initialValue);
        }
        return this.asEnumerable().aggregate(aggregator);
    };
    EnumerableCollection.prototype.any = function (predicate) {
        if (predicate !== undefined) {
            return this.asEnumerable().any(predicate);
        }
        return this.asEnumerable().any();
    };
    EnumerableCollection.prototype.all = function (predicate) {
        return this.asEnumerable().all(predicate);
    };
    EnumerableCollection.prototype.average = function (selector) {
        return this.asEnumerable().average(selector);
    };
    EnumerableCollection.prototype.count = function (predicate) {
        if (predicate !== undefined) {
            return this.asEnumerable().count(predicate);
        }
        return this.asEnumerable().count();
    };
    EnumerableCollection.prototype.elementAtOrDefault = function (index) {
        return this.asEnumerable().elementAtOrDefault(index);
    };
    EnumerableCollection.prototype.firstOrDefault = function (predicate) {
        if (predicate !== undefined) {
            return this.asEnumerable().firstOrDefault(predicate);
        }
        return this.asEnumerable().firstOrDefault();
    };
    EnumerableCollection.prototype.lastOrDefault = function (predicate) {
        if (predicate !== undefined) {
            return this.asEnumerable().lastOrDefault(predicate);
        }
        return this.asEnumerable().lastOrDefault();
    };
    EnumerableCollection.prototype.forEach = function (action) {
        return this.asEnumerable().forEach(action);
    };
    EnumerableCollection.prototype.defaultIfEmpty = function (defaultValue) {
        if (defaultValue !== undefined) {
            return this.asEnumerable().defaultIfEmpty(defaultValue);
        }
        return this.asEnumerable().defaultIfEmpty();
    };
    return EnumerableCollection;
}());
exports.EnumerableCollection = EnumerableCollection;
// endregion
// region ArrayQueryable
var ArrayQueryable = /** @class */ (function (_super) {
    __extends(ArrayQueryable, _super);
    function ArrayQueryable(elements) {
        if (elements === void 0) { elements = []; }
        var _this = _super.call(this) || this;
        _this.source = elements;
        return _this;
    }
    ArrayQueryable.prototype.asArray = function () {
        return this.source;
    };
    ArrayQueryable.prototype.toArray = function () {
        return [].concat(this.source);
    };
    ArrayQueryable.prototype.toList = function () {
        return new List(this.toArray());
    };
    ArrayQueryable.prototype.asEnumerable = function () {
        return new Enumerables_1.ArrayEnumerable(this.source);
    };
    ArrayQueryable.prototype.aggregate = function (aggregator, initialValue) {
        if (initialValue !== undefined) {
            return this.source.reduce(aggregator, initialValue);
        }
        return this.source.reduce(aggregator);
    };
    ArrayQueryable.prototype.any = function (predicate) {
        if (predicate !== undefined) {
            return this.source.some(predicate);
        }
        return this.source.length > 0;
    };
    ArrayQueryable.prototype.all = function (predicate) {
        return this.source.every(predicate);
    };
    ArrayQueryable.prototype.average = function (selector) {
        if (this.count() === 0) {
            throw new Error("Sequence contains no elements");
        }
        var sum = 0;
        for (var i = 0, end = this.source.length; i < end; ++i) {
            sum += selector(this.source[i]);
        }
        return sum / this.source.length;
    };
    ArrayQueryable.prototype.count = function (predicate) {
        if (predicate !== undefined) {
            return this.source.filter(predicate).length;
        }
        return this.source.length;
    };
    ArrayQueryable.prototype.elementAtOrDefault = function (index) {
        if (index < 0) {
            throw new Error("Negative index is forbiden");
        }
        return this.source[index];
    };
    ArrayQueryable.prototype.firstOrDefault = function (predicate) {
        if (predicate !== undefined) {
            return this.source.filter(predicate)[0];
        }
        return this.source[0];
    };
    ArrayQueryable.prototype.groupBy = function (keySelector, valueSelector) {
        var array = this.asArray();
        var dictionary = new Dictionary();
        for (var i = 0; i < array.length; ++i) {
            var key = keySelector(array[i]);
            var value = valueSelector !== undefined
                ? valueSelector(array[i])
                : array[i];
            if (!dictionary.containsKey(key)) {
                dictionary.set(key, new List());
            }
            dictionary.get(key).push(value);
        }
        return dictionary.asEnumerable();
    };
    ArrayQueryable.prototype.lastOrDefault = function (predicate) {
        if (predicate !== undefined) {
            var records = this.source.filter(predicate);
            return records[records.length - 1];
        }
        return this.source[this.source.length - 1];
    };
    ArrayQueryable.prototype.forEach = function (action) {
        for (var i = 0, end = this.source.length; i < end; ++i) {
            action(this.source[i], i);
        }
    };
    ArrayQueryable.prototype.sequenceEqual = function (other, comparer) {
        if (comparer === void 0) { comparer = Comparers_1.strictEqualityComparer(); }
        if (other instanceof ArrayQueryable
            || other instanceof Array) {
            var thisArray = this.asArray();
            var otherArray = other instanceof ArrayQueryable
                ? other.asArray()
                : other;
            if (thisArray.length != otherArray.length) {
                return false;
            }
            for (var i = 0; i < thisArray.length; ++i) {
                if (!comparer(thisArray[i], otherArray[i])) {
                    return false;
                }
            }
            return true;
        }
        return this.asEnumerable().sequenceEqual(other, comparer);
    };
    return ArrayQueryable;
}(EnumerableCollection));
exports.ArrayQueryable = ArrayQueryable;
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    List.prototype.copy = function () {
        return new List(this.toArray());
    };
    List.prototype.asReadOnly = function () {
        return this;
    };
    List.prototype.clear = function () {
        this.source = [];
    };
    List.prototype.remove = function (element) {
        var newSource = [];
        for (var i = 0, end = this.source.length; i < end; ++i) {
            if (this.source[i] !== element) {
                newSource.push(this.source[i]);
            }
        }
        this.source = newSource;
    };
    List.prototype.removeAt = function (index) {
        if (index < 0 || this.source[index] === undefined) {
            throw new Error("Out of bounds");
        }
        return this.source.splice(index, 1)[0];
    };
    List.prototype.get = function (index) {
        return this.source[index];
    };
    List.prototype.push = function (element) {
        return this.source.push(element);
    };
    List.prototype.pushRange = function (elements) {
        if (!(elements instanceof Array)) {
            elements = elements.toArray();
        }
        return this.source.push.apply(this.source, elements);
    };
    List.prototype.pushFront = function (element) {
        return this.source.unshift(element);
    };
    List.prototype.pop = function () {
        return this.source.pop();
    };
    List.prototype.popFront = function () {
        return this.source.shift();
    };
    List.prototype.set = function (index, element) {
        if (index < 0) {
            throw new Error("Out of bounds");
        }
        this.source[index] = element;
    };
    List.prototype.insert = function (index, element) {
        if (index < 0 || index > this.source.length) {
            throw new Error("Out of bounds");
        }
        this.source.splice(index, 0, element);
    };
    List.prototype.indexOf = function (element) {
        return this.source.indexOf(element);
    };
    return List;
}(ArrayQueryable));
exports.List = List;
var Stack = /** @class */ (function (_super) {
    __extends(Stack, _super);
    function Stack() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Stack.prototype.copy = function () {
        return new Stack(this.toArray());
    };
    Stack.prototype.clear = function () {
        this.source = [];
    };
    Stack.prototype.peek = function () {
        return this.source[this.source.length - 1];
    };
    Stack.prototype.pop = function () {
        return this.source.pop();
    };
    Stack.prototype.push = function (element) {
        return this.source.push(element);
    };
    return Stack;
}(ArrayQueryable));
exports.Stack = Stack;
var Dictionary = /** @class */ (function (_super) {
    __extends(Dictionary, _super);
    function Dictionary(keyValuePairs) {
        var _this = _super.call(this) || this;
        _this.clear();
        if (keyValuePairs !== undefined) {
            for (var i = 0; i < keyValuePairs.length; ++i) {
                var pair = keyValuePairs[i];
                _this.set(pair.key, pair.value);
            }
        }
        return _this;
    }
    Dictionary.fromArray = function (array, keySelector, valueSelector) {
        var keyValuePairs = array.map(function (v) {
            return {
                key: keySelector(v),
                value: valueSelector(v),
            };
        });
        return new Dictionary(keyValuePairs);
    };
    Dictionary.fromJsObject = function (object) {
        var keys = new List(Object.getOwnPropertyNames(object));
        var keyValues = keys.select(function (k) { return ({ key: k, value: object[k] }); });
        return new Dictionary(keyValues.toArray());
    };
    Dictionary.prototype.copy = function () {
        return new Dictionary(this.toArray());
    };
    Dictionary.prototype.asReadOnly = function () {
        return this;
    };
    Dictionary.prototype.asEnumerable = function () {
        return new Enumerables_1.ArrayEnumerable(this.toArray());
    };
    Dictionary.prototype.toArray = function () {
        var _this = this;
        return this.getKeys().select(function (p) {
            return {
                key: p,
                value: _this.dictionary[p],
            };
        }).toArray();
    };
    Dictionary.prototype.clear = function () {
        this.dictionary = {};
    };
    Dictionary.prototype.containsKey = function (key) {
        return this.dictionary.hasOwnProperty(key);
    };
    Dictionary.prototype.containsValue = function (value) {
        var keys = this.getKeysFast();
        for (var i = 0; i < keys.length; ++i) {
            if (this.dictionary[keys[i]] === value) {
                return true;
            }
        }
        return false;
    };
    Dictionary.prototype.getKeys = function () {
        var _this = this;
        var keys = this.getKeysFast();
        return new List(keys.map(function (k) { return _this.keyType === "number"
            ? parseFloat(k)
            : k; }));
    };
    Dictionary.prototype.getKeysFast = function () {
        return Object.getOwnPropertyNames(this.dictionary);
    };
    Dictionary.prototype.getValues = function () {
        var keys = this.getKeysFast();
        var result = new Array(keys.length);
        for (var i = 0; i < keys.length; ++i) {
            result[i] = this.dictionary[keys[i]];
        }
        return new List(result);
    };
    Dictionary.prototype.remove = function (key) {
        if (this.containsKey(key)) {
            delete this.dictionary[key];
        }
    };
    Dictionary.prototype.get = function (key) {
        if (!this.containsKey(key)) {
            throw new Error("Key doesn't exist: " + key);
        }
        return this.dictionary[key];
    };
    Dictionary.prototype.set = function (key, value) {
        if (this.containsKey(key)) {
            throw new Error("Key already exists: " + key);
        }
        this.setOrUpdate(key, value);
    };
    Dictionary.prototype.setOrUpdate = function (key, value) {
        if (this.keyType === undefined) {
            this.keyType = typeof key;
        }
        this.dictionary[key] = value;
    };
    return Dictionary;
}(EnumerableCollection));
exports.Dictionary = Dictionary;
// endregion

},{"./Comparers":2,"./Enumerables":3}],2:[function(require,module,exports){
"use strict";
/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictEqualityComparer = function () { return function (left, right) { return left === right; }; };
function combineComparers(left, right) {
    return function (l, r) { return left(l, r) || right(l, r); };
}
exports.combineComparers = combineComparers;
function createComparer(keySelector, ascending, customComparer) {
    if (customComparer !== undefined) {
        return function (l, r) { return customComparer(keySelector(l), keySelector(r)); };
    }
    return ascending
        ? function (l, r) {
            var left = keySelector(l);
            var right = keySelector(r);
            return left < right
                ? -1
                : left > right
                    ? 1
                    : 0;
        }
        : function (l, r) {
            var left = keySelector(l);
            var right = keySelector(r);
            return left < right
                ? 1
                : left > right
                    ? -1
                    : 0;
        };
}
exports.createComparer = createComparer;

},{}],3:[function(require,module,exports){
"use strict";
// -
// Created by Ivan Sanz (@isc30)
// Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
// -
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Iterators_1 = require("./Iterators");
var Comparers_1 = require("./Comparers");
var Collections_1 = require("./Collections");
var Utils_1 = require("./Utils");
// endregion
// region EnumerableBase
var EnumerableBase = /** @class */ (function () {
    function EnumerableBase(source) {
        this.source = source;
    }
    EnumerableBase.prototype.reset = function () {
        this.source.reset();
    };
    EnumerableBase.prototype.next = function () {
        return this.source.next();
    };
    EnumerableBase.prototype.asEnumerable = function () {
        return this;
    };
    EnumerableBase.prototype.toArray = function () {
        var result = [];
        this.reset();
        while (this.next()) {
            result.push(this.value());
        }
        return result;
    };
    EnumerableBase.prototype.toList = function () {
        return new Collections_1.List(this.toArray());
    };
    EnumerableBase.prototype.toDictionary = function (keySelector, valueSelector) {
        return Collections_1.Dictionary.fromArray(this.toArray(), keySelector, valueSelector);
    };
    EnumerableBase.prototype.count = function (predicate) {
        if (predicate !== undefined) {
            // Don't copy iterators
            return new ConditionalEnumerable(this, predicate).count();
        }
        var result = 0;
        this.reset();
        while (this.next()) {
            ++result;
        }
        // tslint:disable-next-line:no-bitwise
        return result >>> 0;
    };
    EnumerableBase.prototype.any = function (predicate) {
        if (predicate !== undefined) {
            // Don't copy iterators
            return new ConditionalEnumerable(this, predicate).any();
        }
        this.reset();
        return this.next();
    };
    EnumerableBase.prototype.all = function (predicate) {
        this.reset();
        while (this.next()) {
            if (!predicate(this.value())) {
                return false;
            }
        }
        return true;
    };
    EnumerableBase.prototype.reverse = function () {
        return new ReverseEnumerable(this.copy());
    };
    EnumerableBase.prototype.contains = function (element) {
        return this.any(function (e) { return e === element; });
    };
    EnumerableBase.prototype.sequenceEqual = function (other, comparer) {
        if (comparer === void 0) { comparer = Comparers_1.strictEqualityComparer(); }
        var otherEnumerable = other instanceof Array
            ? new ArrayEnumerable(other)
            : other.asEnumerable();
        this.reset();
        otherEnumerable.reset();
        while (this.next()) {
            if (!otherEnumerable.next() || !comparer(this.value(), otherEnumerable.value())) {
                return false;
            }
        }
        return !otherEnumerable.next();
    };
    EnumerableBase.prototype.where = function (predicate) {
        return new ConditionalEnumerable(this.copy(), predicate);
    };
    EnumerableBase.prototype.select = function (selector) {
        return new TransformEnumerable(this.copy(), selector);
    };
    EnumerableBase.prototype.selectMany = function (selector) {
        var selectToEnumerable = function (e) {
            var ie = selector(e);
            return Array.isArray(ie)
                ? new ArrayEnumerable(ie)
                : ie.asEnumerable();
        };
        return this
            .select(selectToEnumerable).toArray()
            .reduce(function (p, c) { return new ConcatEnumerable(p, c); }, Enumerable.empty());
    };
    EnumerableBase.prototype.skipWhile = function (predicate) {
        return new SkipWhileEnumerable(this.copy(), predicate);
    };
    EnumerableBase.prototype.concat = function (other) {
        var others = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            others[_i - 1] = arguments[_i];
        }
        var asEnumerable = function (e) {
            return e instanceof Array
                ? new ArrayEnumerable(e)
                : e.asEnumerable();
        };
        var result = new ConcatEnumerable(this.copy(), asEnumerable(other).copy());
        for (var i = 0, end = others.length; i < end; ++i) {
            result = new ConcatEnumerable(result, asEnumerable(others[i]).copy());
        }
        return result;
    };
    EnumerableBase.prototype.defaultIfEmpty = function (defaultValue) {
        return new DefaultIfEmptyEnumerable(this, defaultValue);
    };
    EnumerableBase.prototype.elementAt = function (index) {
        var element = this.elementAtOrDefault(index);
        if (element === undefined) {
            throw new Error("Out of bounds");
        }
        return element;
    };
    EnumerableBase.prototype.elementAtOrDefault = function (index) {
        if (index < 0) {
            throw new Error("Negative index is forbiden");
        }
        this.reset();
        var currentIndex = -1;
        while (this.next()) {
            ++currentIndex;
            if (currentIndex === index) {
                break;
            }
        }
        if (currentIndex !== index) {
            return undefined;
        }
        return this.value();
    };
    EnumerableBase.prototype.except = function (other) {
        return this.where(function (e) { return !other.contains(e); });
    };
    EnumerableBase.prototype.first = function (predicate) {
        var element;
        if (predicate !== undefined) {
            element = this.firstOrDefault(predicate);
        }
        else {
            element = this.firstOrDefault();
        }
        if (element === undefined) {
            throw new Error("Sequence contains no elements");
        }
        return element;
    };
    EnumerableBase.prototype.firstOrDefault = function (predicate) {
        if (predicate !== undefined) {
            // Don't copy iterators
            return new ConditionalEnumerable(this, predicate).firstOrDefault();
        }
        this.reset();
        if (!this.next()) {
            return undefined;
        }
        return this.value();
    };
    EnumerableBase.prototype.forEach = function (action) {
        this.reset();
        for (var i = 0; this.next(); ++i) {
            action(this.value(), i);
        }
    };
    EnumerableBase.prototype.groupBy = function (keySelector, valueSelector) {
        var array = this.toArray();
        var dictionary = new Collections_1.Dictionary();
        for (var i = 0; i < array.length; ++i) {
            var key = keySelector(array[i]);
            var value = valueSelector !== undefined
                ? valueSelector(array[i])
                : array[i];
            if (!dictionary.containsKey(key)) {
                dictionary.set(key, new Collections_1.List());
            }
            dictionary.get(key).push(value);
        }
        return dictionary.asEnumerable();
    };
    EnumerableBase.prototype.last = function (predicate) {
        var element;
        if (predicate !== undefined) {
            element = this.lastOrDefault(predicate);
        }
        else {
            element = this.lastOrDefault();
        }
        if (element === undefined) {
            throw new Error("Sequence contains no elements");
        }
        return element;
    };
    EnumerableBase.prototype.lastOrDefault = function (predicate) {
        if (predicate !== undefined) {
            // Don't copy iterators
            return new ConditionalEnumerable(this, predicate).lastOrDefault();
        }
        var reversed = new ReverseEnumerable(this);
        reversed.reset();
        if (!reversed.next()) {
            return undefined;
        }
        return reversed.value();
    };
    EnumerableBase.prototype.single = function (predicate) {
        var element;
        if (predicate !== undefined) {
            element = this.singleOrDefault(predicate);
        }
        else {
            element = this.singleOrDefault();
        }
        if (element === undefined) {
            throw new Error("Sequence contains no elements");
        }
        return element;
    };
    EnumerableBase.prototype.singleOrDefault = function (predicate) {
        if (predicate !== undefined) {
            // Don't copy iterators
            return new ConditionalEnumerable(this, predicate).singleOrDefault();
        }
        this.reset();
        if (!this.next()) {
            return undefined;
        }
        var element = this.value();
        if (this.next()) {
            throw new Error("Sequence contains more than 1 element");
        }
        return element;
    };
    EnumerableBase.prototype.distinct = function (keySelector) {
        return new UniqueEnumerable(this.copy(), keySelector);
    };
    EnumerableBase.prototype.aggregate = function (aggregator, initialValue) {
        var value = initialValue;
        this.reset();
        if (initialValue === undefined) {
            if (!this.next()) {
                throw new Error("Sequence contains no elements");
            }
            value = aggregator(value, this.value());
        }
        while (this.next()) {
            value = aggregator(value, this.value());
        }
        return value;
    };
    EnumerableBase.prototype.min = function (selector) {
        if (selector !== undefined) {
            // Don't copy iterators
            return new TransformEnumerable(this, selector).min();
        }
        return this.aggregate(function (previous, current) {
            return (previous !== undefined && previous < current)
                ? previous
                : current;
        });
    };
    EnumerableBase.prototype.orderBy = function (keySelector, comparer) {
        return new OrderedEnumerable(this.copy(), Comparers_1.createComparer(keySelector, true, comparer));
    };
    EnumerableBase.prototype.orderByDescending = function (keySelector) {
        return new OrderedEnumerable(this.copy(), Comparers_1.createComparer(keySelector, false, undefined));
    };
    EnumerableBase.prototype.max = function (selector) {
        if (selector !== undefined) {
            // Don't copy iterators
            return new TransformEnumerable(this, selector).max();
        }
        return this.aggregate(function (previous, current) {
            return (previous !== undefined && previous > current)
                ? previous
                : current;
        });
    };
    EnumerableBase.prototype.sum = function (selector) {
        return this.aggregate(function (previous, current) { return previous + selector(current); }, 0);
    };
    EnumerableBase.prototype.average = function (selector) {
        this.reset();
        if (!this.next()) {
            throw new Error("Sequence contains no elements");
        }
        var sum = 0;
        var count = 0;
        do {
            sum += selector(this.value());
            ++count;
        } while (this.next());
        return sum / count;
    };
    EnumerableBase.prototype.skip = function (amount) {
        return new RangeEnumerable(this.copy(), amount, undefined);
    };
    EnumerableBase.prototype.take = function (amount) {
        return new RangeEnumerable(this.copy(), undefined, amount);
    };
    EnumerableBase.prototype.takeWhile = function (predicate) {
        return new TakeWhileEnumerable(this.copy(), predicate);
    };
    EnumerableBase.prototype.union = function (other) {
        return new UniqueEnumerable(this.concat(other));
    };
    return EnumerableBase;
}());
exports.EnumerableBase = EnumerableBase;
// endregion
// region Enumerable
var Enumerable = /** @class */ (function (_super) {
    __extends(Enumerable, _super);
    function Enumerable(source) {
        var _this = _super.call(this, source) || this;
        _this.currentValue = new Utils_1.Cached();
        return _this;
    }
    Enumerable.fromSource = function (source) {
        if (source instanceof Array) {
            return new ArrayEnumerable(source);
        }
        return new Enumerable(source);
    };
    Enumerable.empty = function () {
        return Enumerable.fromSource([]);
    };
    Enumerable.range = function (start, count, ascending) {
        if (ascending === void 0) { ascending = true; }
        if (count < 0) {
            throw new Error("Count must be >= 0");
        }
        var source = new Array(count);
        if (ascending) {
            // tslint:disable-next-line:curly
            for (var i = 0; i < count; source[i] = start + (i++))
                ;
        }
        else {
            // tslint:disable-next-line:curly
            for (var i = 0; i < count; source[i] = start - (i++))
                ;
        }
        return new ArrayEnumerable(source);
    };
    Enumerable.repeat = function (element, count) {
        if (count < 0) {
            throw new Error("Count must me >= 0");
        }
        var source = new Array(count);
        for (var i = 0; i < count; ++i) {
            source[i] = element;
        }
        return new ArrayEnumerable(source);
    };
    Enumerable.prototype.copy = function () {
        return new Enumerable(this.source.copy());
    };
    Enumerable.prototype.value = function () {
        if (!this.currentValue.isValid()) {
            this.currentValue.value = this.source.value();
        }
        return this.currentValue.value;
    };
    Enumerable.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.currentValue.invalidate();
    };
    Enumerable.prototype.next = function () {
        this.currentValue.invalidate();
        return _super.prototype.next.call(this);
    };
    return Enumerable;
}(EnumerableBase));
exports.Enumerable = Enumerable;
// endregion
// region ConditionalEnumerable
var ConditionalEnumerable = /** @class */ (function (_super) {
    __extends(ConditionalEnumerable, _super);
    function ConditionalEnumerable(source, predicate) {
        var _this = _super.call(this, source) || this;
        _this._predicate = predicate;
        return _this;
    }
    ConditionalEnumerable.prototype.copy = function () {
        return new ConditionalEnumerable(this.source.copy(), this._predicate);
    };
    ConditionalEnumerable.prototype.next = function () {
        var hasValue;
        do {
            hasValue = _super.prototype.next.call(this);
        } while (hasValue && !this._predicate(this.value()));
        return hasValue;
    };
    return ConditionalEnumerable;
}(Enumerable));
exports.ConditionalEnumerable = ConditionalEnumerable;
// endregion
// region SkipWhileEnumerable
var SkipWhileEnumerable = /** @class */ (function (_super) {
    __extends(SkipWhileEnumerable, _super);
    function SkipWhileEnumerable(source, predicate) {
        var _this = _super.call(this, source) || this;
        _this._predicate = predicate;
        _this._shouldContinueChecking = true;
        return _this;
    }
    SkipWhileEnumerable.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this._shouldContinueChecking = true;
    };
    SkipWhileEnumerable.prototype.copy = function () {
        return new SkipWhileEnumerable(this.source.copy(), this._predicate);
    };
    SkipWhileEnumerable.prototype.next = function () {
        if (!this._shouldContinueChecking) {
            return _super.prototype.next.call(this);
        }
        var hasValue;
        do {
            hasValue = _super.prototype.next.call(this);
        } while (hasValue && this._predicate(this.value()));
        this._shouldContinueChecking = false;
        return hasValue;
    };
    return SkipWhileEnumerable;
}(Enumerable));
exports.SkipWhileEnumerable = SkipWhileEnumerable;
// endregion
// region TakeWhileEnumerable
var TakeWhileEnumerable = /** @class */ (function (_super) {
    __extends(TakeWhileEnumerable, _super);
    function TakeWhileEnumerable(source, predicate) {
        var _this = _super.call(this, source) || this;
        _this._predicate = predicate;
        _this._shouldContinueTaking = true;
        return _this;
    }
    TakeWhileEnumerable.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this._shouldContinueTaking = true;
    };
    TakeWhileEnumerable.prototype.copy = function () {
        return new TakeWhileEnumerable(this.source.copy(), this._predicate);
    };
    TakeWhileEnumerable.prototype.next = function () {
        if (_super.prototype.next.call(this)) {
            if (this._shouldContinueTaking && this._predicate(this.value())) {
                return true;
            }
        }
        this._shouldContinueTaking = false;
        return false;
    };
    return TakeWhileEnumerable;
}(Enumerable));
exports.TakeWhileEnumerable = TakeWhileEnumerable;
// endregion
// region ConcatEnumerable
var ConcatEnumerable = /** @class */ (function (_super) {
    __extends(ConcatEnumerable, _super);
    function ConcatEnumerable(left, right) {
        var _this = _super.call(this, left) || this;
        _this._otherSource = right;
        _this._isFirstSourceFinished = false;
        return _this;
    }
    ConcatEnumerable.prototype.copy = function () {
        return new ConcatEnumerable(this.source.copy(), this._otherSource.copy());
    };
    ConcatEnumerable.prototype.reset = function () {
        this.source.reset();
        this._otherSource.reset();
        this._isFirstSourceFinished = false;
        this.currentValue.invalidate();
    };
    ConcatEnumerable.prototype.next = function () {
        this.currentValue.invalidate();
        var hasValue = !this._isFirstSourceFinished
            ? this.source.next()
            : this._otherSource.next();
        if (!hasValue && !this._isFirstSourceFinished) {
            this._isFirstSourceFinished = true;
            return this.next();
        }
        return hasValue;
    };
    ConcatEnumerable.prototype.value = function () {
        if (!this.currentValue.isValid()) {
            this.currentValue.value = !this._isFirstSourceFinished
                ? this.source.value()
                : this._otherSource.value();
        }
        return this.currentValue.value;
    };
    return ConcatEnumerable;
}(Enumerable));
exports.ConcatEnumerable = ConcatEnumerable;
// endregion
// region UniqueEnumerable
var UniqueEnumerable = /** @class */ (function (_super) {
    __extends(UniqueEnumerable, _super);
    function UniqueEnumerable(source, keySelector) {
        var _this = _super.call(this, source) || this;
        _this._keySelector = keySelector;
        _this._seen = { primitive: { number: {}, string: {}, boolean: {} }, complex: [] };
        return _this;
    }
    UniqueEnumerable.prototype.copy = function () {
        return new UniqueEnumerable(this.source.copy(), this._keySelector);
    };
    UniqueEnumerable.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this._seen = { primitive: { number: {}, string: {}, boolean: {} }, complex: [] };
    };
    UniqueEnumerable.prototype.isUnique = function (element) {
        var key = this._keySelector !== undefined
            ? this._keySelector(element)
            : element;
        var type = typeof key;
        return (type in this._seen.primitive)
            ? this._seen.primitive[type].hasOwnProperty(key)
                ? false
                : this._seen.primitive[type][key] = true
            : this._seen.complex.indexOf(key) !== -1
                ? false
                : this._seen.complex.push(key) > -1;
    };
    UniqueEnumerable.prototype.next = function () {
        var hasValue;
        do {
            hasValue = _super.prototype.next.call(this);
        } while (hasValue && !this.isUnique(this.value()));
        return hasValue;
    };
    return UniqueEnumerable;
}(Enumerable));
exports.UniqueEnumerable = UniqueEnumerable;
// endregion
// region RangeEnumerable
var RangeEnumerable = /** @class */ (function (_super) {
    __extends(RangeEnumerable, _super);
    function RangeEnumerable(source, start, count) {
        var _this = this;
        if ((start !== undefined && start < 0) || (count !== undefined && count < 0)) {
            throw new Error("Incorrect parameters");
        }
        _this = _super.call(this, source) || this;
        _this._start = start;
        _this._count = count;
        _this._currentIndex = -1;
        return _this;
    }
    RangeEnumerable.prototype.copy = function () {
        return new RangeEnumerable(this.source.copy(), this._start, this._count);
    };
    RangeEnumerable.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this._currentIndex = -1;
    };
    RangeEnumerable.prototype.isValidIndex = function () {
        var start = this._start !== undefined ? this._start : 0;
        var end = this._count !== undefined ? start + this._count : undefined;
        return this._currentIndex >= start && (end === undefined || this._currentIndex < end);
    };
    RangeEnumerable.prototype.performSkip = function () {
        var start = this._start !== undefined ? this._start : 0;
        var hasValue = true;
        while (hasValue && this._currentIndex + 1 < start) {
            hasValue = _super.prototype.next.call(this);
            ++this._currentIndex;
        }
        return hasValue;
    };
    RangeEnumerable.prototype.next = function () {
        if (this._currentIndex < 0 && !this.performSkip()) {
            return false;
        }
        ++this._currentIndex;
        return _super.prototype.next.call(this) && this.isValidIndex();
    };
    RangeEnumerable.prototype.value = function () {
        if (!this.isValidIndex()) {
            throw new Error("Out of bounds");
        }
        return _super.prototype.value.call(this);
    };
    return RangeEnumerable;
}(Enumerable));
exports.RangeEnumerable = RangeEnumerable;
// endregion
// region TransformEnumerable
var TransformEnumerable = /** @class */ (function (_super) {
    __extends(TransformEnumerable, _super);
    function TransformEnumerable(source, transform) {
        var _this = _super.call(this, source) || this;
        _this._transform = transform;
        _this._currentValue = new Utils_1.Cached();
        return _this;
    }
    TransformEnumerable.prototype.copy = function () {
        return new TransformEnumerable(this.source.copy(), this._transform);
    };
    TransformEnumerable.prototype.value = function () {
        if (!this._currentValue.isValid()) {
            this._currentValue.value = this._transform(this.source.value());
        }
        return this._currentValue.value;
    };
    TransformEnumerable.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this._currentValue.invalidate();
    };
    TransformEnumerable.prototype.next = function () {
        this._currentValue.invalidate();
        return _super.prototype.next.call(this);
    };
    return TransformEnumerable;
}(EnumerableBase));
exports.TransformEnumerable = TransformEnumerable;
// endregion
// region ReverseEnumerable
var ReverseEnumerable = /** @class */ (function (_super) {
    __extends(ReverseEnumerable, _super);
    function ReverseEnumerable(source) {
        var _this = _super.call(this, source) || this;
        _this._elements = new Utils_1.Cached();
        _this._currentIndex = -1;
        return _this;
    }
    ReverseEnumerable.prototype.copy = function () {
        return new ReverseEnumerable(this.source.copy());
    };
    ReverseEnumerable.prototype.reset = function () {
        this._elements.invalidate();
        this._currentIndex = -1;
    };
    ReverseEnumerable.prototype.isValidIndex = function () {
        return this._currentIndex >= 0
            && this._currentIndex < this._elements.value.length;
    };
    ReverseEnumerable.prototype.all = function (predicate) {
        return this.source.all(predicate);
    };
    ReverseEnumerable.prototype.any = function (predicate) {
        if (predicate !== undefined) {
            return this.source.any(predicate);
        }
        return this.source.any();
    };
    ReverseEnumerable.prototype.average = function (selector) {
        return this.source.average(selector);
    };
    ReverseEnumerable.prototype.count = function (predicate) {
        if (predicate !== undefined) {
            return this.source.count(predicate);
        }
        return this.source.count();
    };
    ReverseEnumerable.prototype.max = function (selector) {
        if (selector !== undefined) {
            return this.source.max(selector);
        }
        return this.source.max();
    };
    ReverseEnumerable.prototype.min = function (selector) {
        if (selector !== undefined) {
            return this.source.min(selector);
        }
        return this.source.min();
    };
    ReverseEnumerable.prototype.reverse = function () {
        return this.source.copy(); // haha so smart
    };
    ReverseEnumerable.prototype.sum = function (selector) {
        return this.source.sum(selector);
    };
    ReverseEnumerable.prototype.next = function () {
        if (!this._elements.isValid()) {
            this._elements.value = this.source.toArray();
        }
        ++this._currentIndex;
        return this.isValidIndex();
    };
    ReverseEnumerable.prototype.value = function () {
        if (!this._elements.isValid() || !this.isValidIndex()) {
            throw new Error("Out of bounds");
        }
        return this._elements.value[(this._elements.value.length - 1) - this._currentIndex];
    };
    return ReverseEnumerable;
}(Enumerable));
exports.ReverseEnumerable = ReverseEnumerable;
// endregion
// region OrderedEnumerable
var OrderedEnumerable = /** @class */ (function (_super) {
    __extends(OrderedEnumerable, _super);
    function OrderedEnumerable(source, comparer) {
        var _this = _super.call(this, source) || this;
        _this._comparer = comparer;
        _this._elements = new Utils_1.Cached();
        _this._currentIndex = -1;
        return _this;
    }
    OrderedEnumerable.prototype.isValidIndex = function () {
        return this._currentIndex >= 0
            && this._currentIndex < this._elements.value.length;
    };
    OrderedEnumerable.prototype.orderBy = function (keySelector, comparer) {
        return new OrderedEnumerable(this.source.copy(), Comparers_1.createComparer(keySelector, true, comparer));
    };
    OrderedEnumerable.prototype.orderByDescending = function (keySelector) {
        return new OrderedEnumerable(this.source.copy(), Comparers_1.createComparer(keySelector, false, undefined));
    };
    OrderedEnumerable.prototype.thenBy = function (keySelector, comparer) {
        return new OrderedEnumerable(this.source.copy(), Comparers_1.combineComparers(this._comparer, Comparers_1.createComparer(keySelector, true, comparer)));
    };
    OrderedEnumerable.prototype.thenByDescending = function (keySelector) {
        return new OrderedEnumerable(this.source.copy(), Comparers_1.combineComparers(this._comparer, Comparers_1.createComparer(keySelector, false, undefined)));
    };
    OrderedEnumerable.prototype.reset = function () {
        this._elements.invalidate();
        this._currentIndex = -1;
    };
    OrderedEnumerable.prototype.copy = function () {
        return new OrderedEnumerable(this.source.copy(), this._comparer);
    };
    OrderedEnumerable.prototype.value = function () {
        if (!this._elements.isValid() || !this.isValidIndex()) {
            throw new Error("Out of bounds");
        }
        return this._elements.value[this._currentIndex];
    };
    OrderedEnumerable.prototype.next = function () {
        if (!this._elements.isValid()) {
            this._elements.value = this.toArray();
        }
        ++this._currentIndex;
        return this.isValidIndex();
    };
    OrderedEnumerable.prototype.toArray = function () {
        // Allocate the array before sorting
        // It's faster than working with anonymous reference
        var result = this.source.toArray();
        return result.sort(this._comparer);
    };
    return OrderedEnumerable;
}(EnumerableBase));
exports.OrderedEnumerable = OrderedEnumerable;
// endregion
// region ArrayEnumerable
var ArrayEnumerable = /** @class */ (function (_super) {
    __extends(ArrayEnumerable, _super);
    function ArrayEnumerable(source) {
        var _this = _super.call(this, new Iterators_1.ArrayIterator(source)) || this;
        _this.list = new Collections_1.List(source);
        return _this;
    }
    ArrayEnumerable.prototype.toArray = function () {
        return this.list.toArray();
    };
    ArrayEnumerable.prototype.aggregate = function (aggregator, initialValue) {
        if (initialValue !== undefined) {
            return this.list.aggregate(aggregator, initialValue);
        }
        return this.list.aggregate(aggregator);
    };
    ArrayEnumerable.prototype.any = function (predicate) {
        if (predicate !== undefined) {
            return this.list.any(predicate);
        }
        return this.list.any();
    };
    ArrayEnumerable.prototype.all = function (predicate) {
        return this.list.all(predicate);
    };
    ArrayEnumerable.prototype.average = function (selector) {
        return this.list.average(selector);
    };
    ArrayEnumerable.prototype.count = function (predicate) {
        if (predicate !== undefined) {
            return this.list.count(predicate);
        }
        return this.list.count();
    };
    ArrayEnumerable.prototype.copy = function () {
        return new ArrayEnumerable(this.list.asArray());
    };
    ArrayEnumerable.prototype.elementAtOrDefault = function (index) {
        return this.list.elementAtOrDefault(index);
    };
    ArrayEnumerable.prototype.firstOrDefault = function (predicate) {
        if (predicate !== undefined) {
            return this.list.firstOrDefault(predicate);
        }
        return this.list.firstOrDefault();
    };
    ArrayEnumerable.prototype.lastOrDefault = function (predicate) {
        if (predicate !== undefined) {
            return this.list.lastOrDefault(predicate);
        }
        return this.list.lastOrDefault();
    };
    return ArrayEnumerable;
}(Enumerable));
exports.ArrayEnumerable = ArrayEnumerable;
// endregion
// region DefaultIfEmptyEnumerable
var DefaultIfEmptyEnumerable = /** @class */ (function (_super) {
    __extends(DefaultIfEmptyEnumerable, _super);
    function DefaultIfEmptyEnumerable(source, defaultValue) {
        var _this = _super.call(this, source) || this;
        _this._mustUseDefaultValue = undefined;
        _this._defaultValue = defaultValue;
        return _this;
    }
    DefaultIfEmptyEnumerable.prototype.copy = function () {
        return new DefaultIfEmptyEnumerable(this.source.copy(), this._defaultValue);
    };
    DefaultIfEmptyEnumerable.prototype.value = function () {
        if (this._mustUseDefaultValue) {
            return this._defaultValue;
        }
        return this.source.value();
    };
    DefaultIfEmptyEnumerable.prototype.next = function () {
        var hasNextElement = _super.prototype.next.call(this);
        // single default element
        this._mustUseDefaultValue = this._mustUseDefaultValue === undefined && !hasNextElement;
        return this._mustUseDefaultValue || hasNextElement;
    };
    DefaultIfEmptyEnumerable.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this._mustUseDefaultValue = undefined;
    };
    return DefaultIfEmptyEnumerable;
}(EnumerableBase));
exports.DefaultIfEmptyEnumerable = DefaultIfEmptyEnumerable;
// endregion

},{"./Collections":1,"./Comparers":2,"./Iterators":4,"./Utils":5}],4:[function(require,module,exports){
"use strict";
/*
* Created by Ivan Sanz (@isc30)
* Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/
Object.defineProperty(exports, "__esModule", { value: true });
/* ES6 compatibility layer :D
interface IteratorResult<T>
{
    done: boolean;
    value: T;
}

interface Iterator<T>
{
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}*/
var ArrayIterator = /** @class */ (function () {
    function ArrayIterator(source) {
        this.source = source;
        this.reset();
    }
    ArrayIterator.prototype.copy = function () {
        return new ArrayIterator(this.source);
    };
    ArrayIterator.prototype.reset = function () {
        this._index = -1;
    };
    ArrayIterator.prototype.isValidIndex = function () {
        return this._index >= 0 && this._index < this.source.length;
    };
    ArrayIterator.prototype.next = function () {
        ++this._index;
        return this.isValidIndex();
    };
    ArrayIterator.prototype.value = function () {
        if (!this.isValidIndex()) {
            throw new Error("Out of bounds");
        }
        return this.source[this._index];
    };
    return ArrayIterator;
}());
exports.ArrayIterator = ArrayIterator;

},{}],5:[function(require,module,exports){
"use strict";
/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/
Object.defineProperty(exports, "__esModule", { value: true });
/*export function Lazy<T>(factory: () => T): () => T
{
    let instance: T;
    
    return () => instance !== undefined
        ? instance
        : (instance = factory());
}*/
var Cached = /** @class */ (function () {
    function Cached() {
        this._isValid = false;
    }
    Cached.prototype.invalidate = function () {
        this._isValid = false;
    };
    Cached.prototype.isValid = function () {
        return this._isValid;
    };
    Object.defineProperty(Cached.prototype, "value", {
        get: function () {
            if (!this._isValid) {
                throw new Error("Trying to get value of invalid cache");
            }
            return this._value;
        },
        set: function (value) {
            this._value = value;
            this._isValid = true;
        },
        enumerable: true,
        configurable: true
    });
    return Cached;
}());
exports.Cached = Cached;

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Test;
(function (Test) {
    function isTrue(result) {
        if (result !== true) {
            throw new Error("Assertion failed");
        }
    }
    Test.isTrue = isTrue;
    function isFalse(result) {
        isTrue(result === false);
    }
    Test.isFalse = isFalse;
    function isEqual(first, second) {
        isTrue(first === second);
    }
    Test.isEqual = isEqual;
    function isNotEqual(first, second) {
        isFalse(first === second);
    }
    Test.isNotEqual = isNotEqual;
    function isArrayEqual(left, right) {
        isTrue(left.length === right.length
            && left.every(function (e, i) { return e === right[i]; }));
    }
    Test.isArrayEqual = isArrayEqual;
    function isArrayNotEqual(left, right) {
        isFalse(left.length === right.length
            && left.every(function (e, i) { return e === right[i]; }));
    }
    Test.isArrayNotEqual = isArrayNotEqual;
    function throwsException(call) {
        try {
            call();
        }
        catch (ex) {
            return;
        }
        throw new Error("Exception was expected");
    }
    Test.throwsException = throwsException;
})(Test = exports.Test || (exports.Test = {}));

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_test_1 = require("./unitary/Utils.test");
var Iterator_test_1 = require("./unitary/Iterator.test");
var Enumerable_test_1 = require("./unitary/Enumerable.test");
var IQueryable_test_1 = require("./unitary/IQueryable.test");
var List_test_1 = require("./unitary/List.test");
var Stack_test_1 = require("./unitary/Stack.test");
var IEnumerable_test_1 = require("./integration/IEnumerable.test");
var Dictionary_test_1 = require("./unitary/Dictionary.test");
describe("Unit Tests", function () {
    describe("Utils", Utils_test_1.UtilsUnitTest.run);
    describe("Enumerable (static)", Enumerable_test_1.EnumerableUnitTest.run);
    describe("Iterators", Iterator_test_1.IteratorUnitTest.run);
    describe("IQueryable", IQueryable_test_1.IQueryableUnitTest.run);
    describe("List", List_test_1.ListUnitTest.run);
    describe("Stack", Stack_test_1.StackUnitTest.run);
    describe("Dictionary", Dictionary_test_1.DictionaryUnitTest.run);
});
describe("Integration Tests", function () {
    describe("IEnumerable", IEnumerable_test_1.IEnumerableIntegrationTest.run);
});

},{"./integration/IEnumerable.test":8,"./unitary/Dictionary.test":9,"./unitary/Enumerable.test":10,"./unitary/IQueryable.test":11,"./unitary/Iterator.test":12,"./unitary/List.test":13,"./unitary/Stack.test":14,"./unitary/Utils.test":15}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Enumerables_1 = require("../../src/Enumerables");
var Test_1 = require("../Test");
var IEnumerableIntegrationTest;
(function (IEnumerableIntegrationTest) {
    function run() {
        it("Where + Select", whereSelect);
        it("SelectMany + Where", selectManyWhere);
        it("DistinctBy + Select + Max", distinctBySelectMax);
        it("Where + OrderBy + Select", whereOrderBySelect);
    }
    IEnumerableIntegrationTest.run = run;
    function whereSelect() {
        var persons = Enumerables_1.Enumerable.fromSource([
            { name: "Ivan", age: 21, aliases: ["isc", "isc30", "ivansanz"] },
            { name: "Antonio", age: 31, aliases: ["tony"] },
            { name: "Ana", age: 17, aliases: ["anita", "ana no se"] },
            { name: "Pedro", age: 8, aliases: ["pica", "piedra"] },
        ]);
        var kids = persons
            .where(function (p) { return p.age < 18; })
            .select(function (p) { return p.name + " (" + p.age + ")"; })
            .toArray();
        Test_1.Test.isArrayEqual(kids, ["Ana (17)", "Pedro (8)"]);
    }
    function selectManyWhere() {
        var persons = Enumerables_1.Enumerable.fromSource([
            { name: "Ivan", age: 21, aliases: ["isc", "isc30", "ivansanz"] },
            { name: "Antonio", age: 31, aliases: ["tony"] },
            { name: "Ana", age: 17, aliases: ["anita", "ana no se"] },
            { name: "Pedro", age: 8, aliases: ["pica", "piedra"] },
        ]);
        var smallAliases = persons
            .selectMany(function (p) { return p.aliases; })
            .where(function (a) { return a.length <= 4; })
            .toArray();
        Test_1.Test.isArrayEqual(smallAliases, ["isc", "tony", "pica"]);
    }
    function distinctBySelectMax() {
        var persons = Enumerables_1.Enumerable.fromSource([
            { name: "Ivan", age: 21, aliases: ["isc", "isc30", "ivansanz"] },
            { name: "Antonio", age: 31, aliases: ["tony"] },
            { name: "Ana", age: 31, aliases: ["anita", "ana no se"] },
            { name: "Pedro", age: 21, aliases: ["pica", "piedra"] },
        ]);
        var max = persons
            .distinct(function (p) { return p.age; })
            .select(function (p) { return p.age + 5; })
            .select(function (a) { return a + 2; })
            .max();
        Test_1.Test.isEqual(max, 31 + 5 + 2);
    }
    function whereOrderBySelect() {
        var persons = Enumerables_1.Enumerable.fromSource([
            { name: "Ivan", age: 21, aliases: ["isc", "isc30", "ivansanz"] },
            { name: "Antonio", age: 38, aliases: ["tony"] },
            { name: "Ana", age: 18, aliases: ["anita", "ana no se"] },
            { name: "Pedro", age: 9, aliases: ["pica", "piedra"] },
        ]);
        var childToAdult = persons
            .where(function (p) { return p.age < 30; })
            .orderBy(function (p) { return p.age; })
            .select(function (p) { return p.name; })
            .select(function (n) { return n + "!"; })
            .toArray();
        Test_1.Test.isArrayEqual(childToAdult, ["Pedro!", "Ana!", "Ivan!"]);
    }
})(IEnumerableIntegrationTest = exports.IEnumerableIntegrationTest || (exports.IEnumerableIntegrationTest = {}));

},{"../../src/Enumerables":3,"../Test":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Test_1 = require("./../Test");
var Collections_1 = require("./../../src/Collections");
var DictionaryUnitTest;
(function (DictionaryUnitTest) {
    function run() {
        describe("FromJsObject", fromJsObject);
        describe("AsReadOnly", asReadOnly);
        describe("Copy", copy);
        describe("Clear", clear);
        describe("Get", get);
        describe("Set", set);
        describe("SetOrUpdate", setOrUpdate);
        describe("ContainsKey", containsKey);
        describe("ContainsValue", containsValue);
        describe("GetKeys", getKeys);
        describe("GetValues", getValues);
        describe("Remove", remove);
    }
    DictionaryUnitTest.run = run;
    function fromJsObject() {
        it("Empty object", function () {
            var dic = Collections_1.Dictionary.fromJsObject({});
            Test_1.Test.isArrayEqual(dic.getKeys().toArray(), []);
        });
        it("Single property (string)", function () {
            var dic = Collections_1.Dictionary.fromJsObject({
                hello: "hola",
            });
            Test_1.Test.isArrayEqual(dic.getKeys().toArray(), ["hello"]);
            Test_1.Test.isEqual(dic.get("hello"), "hola");
        });
        it("Single property (number)", function () {
            var dic = Collections_1.Dictionary.fromJsObject({
                hello: 123,
            });
            Test_1.Test.isArrayEqual(dic.getKeys().toArray(), ["hello"]);
            Test_1.Test.isEqual(dic.get("hello"), 123);
        });
        it("Multiple properties (string)", function () {
            var dic = Collections_1.Dictionary.fromJsObject({
                hello: "hola",
                bye: "adios"
            });
            Test_1.Test.isArrayEqual(dic.getKeys().toArray(), ["hello", "bye"]);
            Test_1.Test.isArrayEqual(dic.getValues().toArray(), ["hola", "adios"]);
            Test_1.Test.isEqual(dic.get("hello"), "hola");
            Test_1.Test.isEqual(dic.get("bye"), "adios");
        });
        it("Multiple properties (number)", function () {
            var dic = Collections_1.Dictionary.fromJsObject({
                hello: 123,
                bye: 666,
            });
            Test_1.Test.isArrayEqual(dic.getKeys().toArray(), ["hello", "bye"]);
            Test_1.Test.isArrayEqual(dic.getValues().toArray(), [123, 666]);
            Test_1.Test.isEqual(dic.get("hello"), 123);
            Test_1.Test.isEqual(dic.get("bye"), 666);
        });
    }
    function asReadOnly() {
        it("Same object but different interface", function () {
            var dic = new Collections_1.Dictionary([
                { key: "hello", value: "yesssss" }
            ]);
            Test_1.Test.isEqual(dic, dic.asReadOnly());
        });
    }
    function copy() {
        it("Type is a Dictionary", function () {
            var dic = new Collections_1.Dictionary();
            Test_1.Test.isTrue(dic instanceof Collections_1.Dictionary);
        });
        it("Returns a copy, not a reference", function () {
            var dic = new Collections_1.Dictionary();
            var copy = dic.copy();
            Test_1.Test.isArrayEqual(dic.toArray(), copy.toArray());
            dic.set("lol", 666);
            Test_1.Test.isArrayNotEqual(dic.toArray(), copy.toArray());
            Test_1.Test.isArrayEqual(dic.toList().select(function (t) { return t.value; }).toArray(), [666]);
            Test_1.Test.isArrayEqual(copy.toList().select(function (t) { return t.value; }).toArray(), []);
        });
    }
    function clear() {
        it("Does nothing on empty dictionary", function () {
            var dic = new Collections_1.Dictionary();
            Test_1.Test.isArrayEqual(dic.toArray(), []);
            dic.clear();
            Test_1.Test.isArrayEqual(dic.toArray(), []);
            dic.clear();
            Test_1.Test.isArrayEqual(dic.toArray(), []);
        });
        it("Dictionary is cleared", function () {
            var dic = new Collections_1.Dictionary([
                { key: 1, value: 1 },
                { key: 2, value: 2 },
            ]);
            Test_1.Test.isArrayEqual(dic.select(function (p) { return p.value; }).toArray(), [1, 2]);
            dic.clear();
            Test_1.Test.isArrayEqual(dic.toArray(), []);
        });
    }
    function get() {
        it("Value is correct (number)", function () {
            var dic = new Collections_1.Dictionary([
                { key: 1, value: 1 },
                { key: 2, value: 2 },
            ]);
            Test_1.Test.isEqual(dic.get(1), 1);
            Test_1.Test.isEqual(dic.get(2), 2);
        });
        it("Value is correct (string)", function () {
            var dic = new Collections_1.Dictionary([
                { key: "Hello", value: "Hola" },
                { key: "Bye", value: "Adios" },
            ]);
            Test_1.Test.isEqual(dic.get("Hello"), "Hola");
            Test_1.Test.isEqual(dic.get("Bye"), "Adios");
        });
        it("Exception if invalid key", function () {
            var dic = new Collections_1.Dictionary([
                { key: "Hello", value: "Hola" },
            ]);
            Test_1.Test.throwsException(function () { return dic.get("Bye"); });
            Test_1.Test.throwsException(function () { return dic.get(":("); });
        });
    }
    function set() {
        it("Value is set correctly", function () {
            var dic = new Collections_1.Dictionary();
            dic.set("hola", "hello");
            Test_1.Test.isEqual(dic.get("hola"), "hello");
        });
        it("Throws exception if key already exists", function () {
            var dic = new Collections_1.Dictionary([
                { key: "hola", value: "hello" },
            ]);
            Test_1.Test.throwsException(function () { return dic.set("hola", "nope"); });
        });
    }
    function setOrUpdate() {
        it("Value is set correctly", function () {
            var dic = new Collections_1.Dictionary();
            dic.setOrUpdate("hola", "hello");
            Test_1.Test.isEqual(dic.get("hola"), "hello");
        });
        it("Replace value if key already exists", function () {
            var dic = new Collections_1.Dictionary([
                { key: "hola", value: "hello" },
            ]);
            dic.setOrUpdate("hola", "nope");
            Test_1.Test.isEqual(dic.get("hola"), "nope");
        });
    }
    function containsKey() {
        it("Returns correct value", function () {
            var dic = new Collections_1.Dictionary([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
            ]);
            Test_1.Test.isTrue(dic.containsKey(1));
            Test_1.Test.isTrue(dic.containsKey(22));
            Test_1.Test.isFalse(dic.containsKey(-1));
            Test_1.Test.isFalse(dic.containsKey(0));
            Test_1.Test.isFalse(dic.containsKey(2));
            Test_1.Test.isFalse(dic.containsKey(101));
            Test_1.Test.isFalse(dic.containsKey(122));
            Test_1.Test.isFalse(dic.containsKey(5));
            dic.set(5, 105);
            Test_1.Test.isTrue(dic.containsKey(5));
        });
    }
    function containsValue() {
        it("Returns correct value", function () {
            var dic = new Collections_1.Dictionary([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
            ]);
            Test_1.Test.isTrue(dic.containsValue(101));
            Test_1.Test.isTrue(dic.containsValue(122));
            Test_1.Test.isFalse(dic.containsValue(-1));
            Test_1.Test.isFalse(dic.containsValue(0));
            Test_1.Test.isFalse(dic.containsValue(2));
            Test_1.Test.isFalse(dic.containsValue(1));
            Test_1.Test.isFalse(dic.containsValue(22));
            Test_1.Test.isFalse(dic.containsValue(105));
            dic.set(5, 105);
            Test_1.Test.isTrue(dic.containsValue(105));
        });
    }
    function getKeys() {
        it("Returns correct value (number)", function () {
            var dic = new Collections_1.Dictionary([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
            ]);
            Test_1.Test.isArrayEqual(dic.getKeys().asArray(), [1, 22]);
        });
        it("Returns correct value (string)", function () {
            var dic = new Collections_1.Dictionary([
                { key: "hola", value: 101 },
                { key: "adios", value: 122 },
            ]);
            Test_1.Test.isArrayEqual(dic.getKeys().asArray(), ["hola", "adios"]);
        });
    }
    function getValues() {
        it("Returns correct value (number)", function () {
            var dic = new Collections_1.Dictionary([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
            ]);
            Test_1.Test.isArrayEqual(dic.getValues().asArray(), [101, 122]);
        });
        it("Returns correct value (string)", function () {
            var dic = new Collections_1.Dictionary([
                { key: "hola", value: "iepe" },
                { key: "adios", value: "talue" },
            ]);
            Test_1.Test.isArrayEqual(dic.getValues().asArray(), ["iepe", "talue"]);
        });
    }
    function remove() {
        it("Does nothing if key doesn't exist", function () {
            var dic = new Collections_1.Dictionary([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
            ]);
            Test_1.Test.isArrayEqual(dic.getKeys().asArray(), [1, 22]);
            dic.remove(66);
            Test_1.Test.isArrayEqual(dic.getKeys().asArray(), [1, 22]);
        });
        it("Removes key", function () {
            var dic = new Collections_1.Dictionary([
                { key: 1, value: 101 },
                { key: 22, value: 122 },
                { key: 33, value: 1322 },
            ]);
            Test_1.Test.isArrayEqual(dic.getKeys().asArray(), [1, 22, 33]);
            dic.remove(22);
            Test_1.Test.isArrayEqual(dic.getKeys().asArray(), [1, 33]);
            dic.remove(1);
            Test_1.Test.isArrayEqual(dic.getKeys().asArray(), [33]);
            dic.remove(33);
            Test_1.Test.isArrayEqual(dic.getKeys().asArray(), []);
        });
    }
})(DictionaryUnitTest = exports.DictionaryUnitTest || (exports.DictionaryUnitTest = {}));

},{"./../../src/Collections":1,"./../Test":6}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Enumerables_1 = require("../../src/Enumerables");
var Iterators_1 = require("../../src/Iterators");
var Test_1 = require("../Test");
var EnumerableUnitTest;
(function (EnumerableUnitTest) {
    function run() {
        it("FromSource", fromSource);
        it("Empty", empty);
        describe("Range", range);
        it("Repeat", repeat);
    }
    EnumerableUnitTest.run = run;
    function fromSource() {
        var e = Enumerables_1.Enumerable.fromSource(new Iterators_1.ArrayIterator([]));
        Test_1.Test.isFalse(e.next());
        Test_1.Test.throwsException(function () { return e.value(); });
        e = Enumerables_1.Enumerable.fromSource(new Iterators_1.ArrayIterator([2, 4, 6]));
        Test_1.Test.isTrue(e.next());
        Test_1.Test.isEqual(e.value(), 2);
        Test_1.Test.isTrue(e.next());
        Test_1.Test.isEqual(e.value(), 4);
        Test_1.Test.isTrue(e.next());
        Test_1.Test.isEqual(e.value(), 6);
        Test_1.Test.isFalse(e.next());
        Test_1.Test.throwsException(function () { return e.value(); });
        e = Enumerables_1.Enumerable.fromSource(Enumerables_1.Enumerable.fromSource(new Iterators_1.ArrayIterator([])));
        Test_1.Test.isFalse(e.next());
        Test_1.Test.throwsException(function () { return e.value(); });
        e = Enumerables_1.Enumerable.fromSource(Enumerables_1.Enumerable.fromSource([2, 4, 6]));
        Test_1.Test.isTrue(e.next());
        Test_1.Test.isEqual(e.value(), 2);
        Test_1.Test.isTrue(e.next());
        Test_1.Test.isEqual(e.value(), 4);
        Test_1.Test.isTrue(e.next());
        Test_1.Test.isEqual(e.value(), 6);
        Test_1.Test.isFalse(e.next());
        Test_1.Test.throwsException(function () { return e.value(); });
    }
    function empty() {
        var base = Enumerables_1.Enumerable.empty();
        Test_1.Test.isArrayEqual(base.toArray(), []);
    }
    function range() {
        it("Negative count throws exception", function () {
            Test_1.Test.throwsException(function () { return Enumerables_1.Enumerable.range(0, -1); });
            Test_1.Test.throwsException(function () { return Enumerables_1.Enumerable.range(5, -666); });
        });
        it("Zero count returns empty", function () {
            var base = Enumerables_1.Enumerable.range(0, 0);
            Test_1.Test.isArrayEqual(base.toArray(), []);
            base = Enumerables_1.Enumerable.range(4, 0);
            Test_1.Test.isArrayEqual(base.toArray(), []);
        });
        it("Value is correct", function () {
            var base = Enumerables_1.Enumerable.range(2, 3);
            Test_1.Test.isArrayEqual(base.toArray(), [2, 3, 4]);
            base = Enumerables_1.Enumerable.range(-2, 4);
            Test_1.Test.isArrayEqual(base.toArray(), [-2, -1, 0, 1]);
            base = Enumerables_1.Enumerable.range(0, 6);
            Test_1.Test.isArrayEqual(base.toArray(), [0, 1, 2, 3, 4, 5]);
            base = Enumerables_1.Enumerable.range(0, 1000000);
            Test_1.Test.isArrayEqual(base.toArray(), base.toArray());
        });
        it("Negative count throws exception (descending)", function () {
            Test_1.Test.throwsException(function () { return Enumerables_1.Enumerable.range(0, -1, false); });
            Test_1.Test.throwsException(function () { return Enumerables_1.Enumerable.range(5, -666, false); });
        });
        it("Zero count returns empty (descending)", function () {
            var base = Enumerables_1.Enumerable.range(0, 0, false);
            Test_1.Test.isArrayEqual(base.toArray(), []);
            base = Enumerables_1.Enumerable.range(4, 0, false);
            Test_1.Test.isArrayEqual(base.toArray(), []);
        });
        it("Value is correct (descending)", function () {
            var base = Enumerables_1.Enumerable.range(2, 3, false);
            Test_1.Test.isArrayEqual(base.toArray(), [2, 1, 0]);
            base = Enumerables_1.Enumerable.range(-2, 4, false);
            Test_1.Test.isArrayEqual(base.toArray(), [-2, -3, -4, -5]);
            base = Enumerables_1.Enumerable.range(0, 6, false);
            Test_1.Test.isArrayEqual(base.toArray(), [0, -1, -2, -3, -4, -5]);
            base = Enumerables_1.Enumerable.range(0, 1000000, false);
            Test_1.Test.isArrayEqual(base.toArray(), base.toArray());
        });
    }
    function repeat() {
        Test_1.Test.throwsException(function () { return Enumerables_1.Enumerable.repeat(0, -1); });
        Test_1.Test.throwsException(function () { return Enumerables_1.Enumerable.repeat(5, -60); });
        Test_1.Test.throwsException(function () { return Enumerables_1.Enumerable.repeat(-5, -1); });
        var base = Enumerables_1.Enumerable.repeat(3, 0);
        Test_1.Test.isArrayEqual(base.toArray(), []);
        base = Enumerables_1.Enumerable.repeat(3, 4);
        Test_1.Test.isArrayEqual(base.toArray(), [3, 3, 3, 3]);
        var baseString = Enumerables_1.Enumerable.repeat("a", 0);
        Test_1.Test.isArrayEqual(baseString.toArray(), []);
        baseString = Enumerables_1.Enumerable.repeat("a", 2);
        Test_1.Test.isArrayEqual(baseString.toArray(), ["a", "a"]);
    }
})(EnumerableUnitTest = exports.EnumerableUnitTest || (exports.EnumerableUnitTest = {}));

},{"../../src/Enumerables":3,"../../src/Iterators":4,"../Test":6}],11:[function(require,module,exports){
"use strict";
// tslint:disable-next-line:max-line-length
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Enumerables_1 = require("../../src/Enumerables");
var Collections_1 = require("../../src/Collections");
var Iterators_1 = require("../../src/Iterators");
var Test_1 = require("../Test");
var IQueryableUnitTest;
(function (IQueryableUnitTest) {
    var EnumerableCollectionBase = /** @class */ (function (_super) {
        __extends(EnumerableCollectionBase, _super);
        function EnumerableCollectionBase(elements) {
            if (elements === void 0) { elements = []; }
            var _this = _super.call(this) || this;
            _this.source = elements;
            return _this;
        }
        EnumerableCollectionBase.prototype.copy = function () {
            return new EnumerableCollectionBase(this.toArray());
        };
        EnumerableCollectionBase.prototype.toArray = function () {
            return [].concat(this.source);
        };
        EnumerableCollectionBase.prototype.asEnumerable = function () {
            return new Enumerables_1.ArrayEnumerable(this.source);
        };
        return EnumerableCollectionBase;
    }(Collections_1.EnumerableCollection));
    function runTest(name, test) {
        describe(name + " (Enumerable)", function () { return test(function (e) { return new Enumerables_1.Enumerable(new Iterators_1.ArrayIterator(e)); }); });
        describe(name + " (ConditionalEnumerable)", function () { return test(function (e) { return new Enumerables_1.ConditionalEnumerable(Enumerables_1.Enumerable.fromSource(e), function (x) { return true; }); }); });
        describe(name + " (ConcatEnumerable)", function () { return test(function (e) { return e.length > 1
            ? new Enumerables_1.ConcatEnumerable(Enumerables_1.Enumerable.fromSource([e[0]]), Enumerables_1.Enumerable.fromSource(e.slice(1)))
            : new Enumerables_1.ConcatEnumerable(Enumerables_1.Enumerable.fromSource(e), Enumerables_1.Enumerable.fromSource([])); }); });
        var counter = 0;
        describe(name + " (UniqueEnumerable)", function () { return test(function (e) { return new Enumerables_1.UniqueEnumerable(Enumerables_1.Enumerable.fromSource(e), function (k) { return counter++; }); }); });
        describe(name + " (RangeEnumerable)", function () { return test(function (e) { return new Enumerables_1.RangeEnumerable(Enumerables_1.Enumerable.fromSource(e), undefined, undefined); }); });
        describe(name + " (TransformEnumerable)", function () { return test(function (e) { return new Enumerables_1.TransformEnumerable(Enumerables_1.Enumerable.fromSource(e), function (x) { return x; }); }); });
        describe(name + " (ReverseEnumerable)", function () { return test(function (e) { return new Enumerables_1.ReverseEnumerable(new Enumerables_1.ReverseEnumerable(Enumerables_1.Enumerable.fromSource(e))); }); });
        describe(name + " (SkipWhileEnumerable)", function () { return test(function (e) { return new Enumerables_1.SkipWhileEnumerable(Enumerables_1.Enumerable.fromSource(e), function (x) { return false; }); }); });
        describe(name + " (TakeWhileEnumerable)", function () { return test(function (e) { return new Enumerables_1.TakeWhileEnumerable(Enumerables_1.Enumerable.fromSource(e), function (x) { return true; }); }); });
        describe(name + " (DefaultIfEmptyEnumerable)", function () { return test(function (e) { return new Enumerables_1.DefaultIfEmptyEnumerable(Enumerables_1.Enumerable.fromSource(e)).where(function (i) { return i !== undefined; }); }); });
        describe(name + " (ArrayEnumerable)", function () { return test(function (e) { return new Enumerables_1.ArrayEnumerable(e); }); });
        describe(name + " (EnumerableCollection)", function () { return test(function (e) { return new EnumerableCollectionBase(e); }); });
        describe(name + " (List)", function () { return test(function (e) { return new Collections_1.List(e); }); });
        describe(name + " (Stack)", function () { return test(function (e) { return new Collections_1.Stack(e); }); });
        counter = 0;
        describe(name + " (Dictionary Value)", function () { return test(function (e) { return Collections_1.Dictionary.fromArray(e, function (p) { return counter++; }, function (p) { return p; }).select(function (p) { return p.value; }); }); });
    }
    function run() {
        runTest("ToArray", toArray);
        runTest("ToList", toList);
        runTest("ToDictionary", toDictionary);
        runTest("Aggregate", aggregate);
        runTest("All", all);
        runTest("Any", any);
        runTest("Average", average);
        runTest("Concat", concat);
        runTest("Contains", contains);
        runTest("Count", count);
        runTest("DefaultIfEmpty", defaultIfEmpty);
        runTest("Distinct", distinct);
        runTest("ElementAt", elementAt);
        runTest("ElementAtOrDefault", elementAtOrDefault);
        runTest("Except", except);
        runTest("First", first);
        runTest("FirstOrDefault", firstOrDefault);
        runTest("ForEach", forEach);
        runTest("Last", last);
        runTest("LastOrDefault", lastOrDefault);
        runTest("Max", max);
        runTest("Min", min);
        runTest("OrderBy", orderBy);
        runTest("OrderByDescending", orderByDescending);
        runTest("Reverse", reverse);
        runTest("Select", select);
        runTest("SelectMany", selectMany);
        runTest("SequenceEqual", sequenceEqual);
        runTest("Single", single);
        runTest("SingleOrDefault", singleOrDefault);
        runTest("Skip", skip);
        runTest("Skip + Take", skipTake);
        runTest("SkipWhile", skipWhile);
        runTest("Sum", sum);
        runTest("Take", take);
        runTest("TakeWhile", takeWhile);
        runTest("ThenBy", thenBy);
        runTest("ThenByDescending", thenByDescending);
        runTest("Union", union);
        runTest("Where", where);
        runTest("GroupBy", groupBy);
    }
    IQueryableUnitTest.run = run;
    function toArray(instancer) {
        it("Empty collection", function () {
            Test_1.Test.isArrayEqual(instancer([]).toArray(), []);
        });
        var base = [1, 2, 3, 4];
        var baseEnumerable = instancer([1, 2, 3, 4]);
        var baseToArray = baseEnumerable.toArray();
        it("Content is correct", function () {
            Test_1.Test.isArrayEqual(base, baseToArray);
        });
        it("Returns a copy, not a reference", function () {
            base.push(5);
            Test_1.Test.isArrayEqual([1, 2, 3, 4], baseToArray);
        });
        it("Content is correct (string)", function () {
            var strSource = ["asd", "asdaa"];
            var strI = instancer(strSource);
            Test_1.Test.isArrayEqual(strI.toArray(), strSource);
        });
    }
    function toList(instancer) {
        it("Returns List", function () {
            var list = instancer([1, 2, 3]).toList();
            Test_1.Test.isTrue(list instanceof Collections_1.List);
            Test_1.Test.isArrayEqual(list.toArray(), [1, 2, 3]);
        });
    }
    function toDictionary(instancer) {
        it("Returns Dictionary", function () {
            var dictionary = instancer([1, 2, 3])
                .toDictionary(function (v) { return v; }, function (v) { return "wow" + v; });
            Test_1.Test.isTrue(dictionary instanceof Collections_1.Dictionary);
        });
    }
    function aggregate(instancer) {
        it("Exception if empty", function () {
            var base = instancer([]);
            Test_1.Test.throwsException(function () { return base.aggregate(function (p, c) { return c; }); });
        });
        it("No exception if empty but with default value", function () {
            var base = instancer([]);
            Test_1.Test.isEqual(base.aggregate(function (p, c) { return c; }, -666), -666);
        });
        it("No initial value", function () {
            var base = instancer(["a", "b", "a", "a"]);
            Test_1.Test.isEqual(base.aggregate(function (p, c) { return p === "b" ? p : c; }), "b");
            Test_1.Test.isEqual(base.aggregate(function (p, c) { return p !== undefined ? c + p : c; }), "aaba");
        });
        it("Custom initial value", function () {
            var base = instancer(["a", "b", "a", "a"]);
            Test_1.Test.isEqual(base.aggregate(function (p, c) { return p !== undefined ? c + p : c; }, "xd"), "aabaxd");
        });
        it("Custom return type", function () {
            var base = instancer(["a", "b", "a", "a"]);
            Test_1.Test.isTrue(base.aggregate(function (p, c) { return p || c === "b"; }, false));
            Test_1.Test.isTrue(base.aggregate(function (p, c) { return p || c === "a"; }, false));
            Test_1.Test.isFalse(base.aggregate(function (p, c) { return p || c === "x"; }, false));
            Test_1.Test.isTrue(base.aggregate(function (p, c) { return p || c === "x"; }, true));
        });
    }
    function all(instancer) {
        it("True if empty", function () {
            var base = instancer([]);
            Test_1.Test.isTrue(base.all(function (e) { return true; }));
            Test_1.Test.isTrue(base.all(function (e) { return false; }));
        });
        it("Single element", function () {
            var base = instancer(["lol"]);
            Test_1.Test.isTrue(base.all(function (e) { return e[0] === "l"; }));
            Test_1.Test.isFalse(base.all(function (e) { return e[0] === "X"; }));
        });
        it("Multiple elements", function () {
            var base = instancer(["a", "av", "abc", "axd"]);
            Test_1.Test.isTrue(base.all(function (e) { return e.length > 0; }));
            Test_1.Test.isTrue(base.all(function (e) { return e[0] === "a"; }));
            Test_1.Test.isTrue(base.all(function (e) { return e.length < 4; }));
            Test_1.Test.isFalse(base.all(function (e) { return e.length > 1; }));
            Test_1.Test.isFalse(base.all(function (e) { return e[1] === "v"; }));
            Test_1.Test.isFalse(base.all(function (e) { return e.length < 2; }));
        });
    }
    function any(instancer) {
        it("False if empty", function () {
            var base = instancer([]);
            Test_1.Test.isFalse(base.any());
            Test_1.Test.isFalse(base.any(function (e) { return true; }));
            Test_1.Test.isFalse(base.any(function (e) { return false; }));
        });
        it("True if single element", function () {
            var base = instancer(["lol"]);
            Test_1.Test.isTrue(base.any());
        });
        it("Predicate in single element", function () {
            var base = instancer(["lol"]);
            Test_1.Test.isTrue(base.any(function (e) { return e[1] === "o"; }));
            Test_1.Test.isFalse(base.any(function (e) { return e === "isc"; }));
        });
        it("Predicate in multiple elements", function () {
            var base = instancer(["a", "av", "abc", "x"]);
            Test_1.Test.isTrue(base.any(function (e) { return e.length > 2; }));
            Test_1.Test.isTrue(base.any(function (e) { return e[0] === "a"; }));
            Test_1.Test.isTrue(base.any(function (e) { return e.length === 1; }));
            Test_1.Test.isFalse(base.any(function (e) { return e[0] === "b"; }));
            Test_1.Test.isFalse(base.any(function (e) { return e.length > 5; }));
            Test_1.Test.isFalse(base.any(function (e) { return e.length === 0; }));
        });
        it("Stop as soon as the result can be determined", function () {
            var base = instancer([
                function () { return 3; },
                function () { return 4; },
                function () { throw new Error("stop"); },
                function () { return 5; },
            ]);
            Test_1.Test.isTrue(base.any(function (e) { return e() === 3; }));
            Test_1.Test.isTrue(base.any(function (e) { return e() === 4; }));
            Test_1.Test.throwsException(function () { return base.any(function (e) { return e() === 5; }); });
        });
    }
    function average(instancer) {
        it("Exception if empty", function () {
            var base = instancer([]);
            Test_1.Test.throwsException(function () { return base.average(function (e) { return e; }); });
        });
        it("Single element", function () {
            var base = instancer([2]);
            Test_1.Test.isEqual(base.average(function (e) { return e; }), 2);
        });
        it("Multiple elements", function () {
            var base = instancer([3, 4, -2, 79, 1]);
            Test_1.Test.isEqual(base.average(function (e) { return e; }), 17);
        });
        it("Selector in multiple elements", function () {
            var strbase = instancer(["112", "452", "465"]);
            Test_1.Test.isEqual(strbase.average(function (e) { return parseInt(e[0]); }), 3);
            Test_1.Test.isEqual(strbase.average(function (e) { return parseInt(e[1]); }), 4);
            Test_1.Test.isEqual(strbase.average(function (e) { return parseInt(e); }), 343);
        });
    }
    function concat(instancer) {
        it("Empty collections", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(base.concat(base).toArray(), []);
            Test_1.Test.isArrayEqual(base.concat(base, base).toArray(), []);
            Test_1.Test.isArrayEqual(base.concat(base, base, base).toArray(), []);
        });
        it("Exception if out of bounds", function () {
            var first = instancer(Enumerables_1.Enumerable.range(1, 2).toArray());
            var second = instancer(Enumerables_1.Enumerable.range(3, 2).toArray());
            var third = instancer(Enumerables_1.Enumerable.range(5, 2).toArray());
            var combo = first.concat(second);
            combo.next();
            Test_1.Test.isEqual(combo.value(), 1);
            combo.next();
            Test_1.Test.isEqual(combo.value(), 2);
            combo.next();
            Test_1.Test.isEqual(combo.value(), 3);
            combo.next();
            Test_1.Test.isEqual(combo.value(), 4);
            combo.next();
            Test_1.Test.throwsException(function () { combo.value(); });
            combo = first.concat(second, third);
            combo.next();
            Test_1.Test.isEqual(combo.value(), 1);
            combo.next();
            Test_1.Test.isEqual(combo.value(), 2);
            combo.next();
            Test_1.Test.isEqual(combo.value(), 3);
            combo.next();
            Test_1.Test.isEqual(combo.value(), 4);
            combo.next();
            Test_1.Test.isEqual(combo.value(), 5);
            combo.next();
            Test_1.Test.isEqual(combo.value(), 6);
            combo.next();
            Test_1.Test.throwsException(function () { combo.value(); });
        });
        it("2 collections", function () {
            var first = instancer(Enumerables_1.Enumerable.range(1, 3).toArray());
            var second = instancer(Enumerables_1.Enumerable.range(4, 3).toArray());
            Test_1.Test.isArrayEqual(first.concat(second).toArray(), [1, 2, 3, 4, 5, 6]);
        });
        it("More than 2 collections", function () {
            var first = instancer(Enumerables_1.Enumerable.range(1, 2).toArray());
            var second = instancer(Enumerables_1.Enumerable.range(3, 2).toArray());
            var third = instancer(Enumerables_1.Enumerable.range(5, 2).toArray());
            Test_1.Test.isArrayEqual(first.concat(second, third).toArray(), [1, 2, 3, 4, 5, 6]);
        });
        it("Mixed with Empty collections", function () {
            var empty = instancer([]);
            var range = instancer(Enumerables_1.Enumerable.range(1, 3).toArray());
            Test_1.Test.isArrayEqual(range.concat(empty).toArray(), [1, 2, 3]);
            Test_1.Test.isArrayEqual(empty.concat(range).toArray(), [1, 2, 3]);
            Test_1.Test.isArrayEqual(empty.concat(range, empty).toArray(), [1, 2, 3]);
            Test_1.Test.isArrayEqual(range.concat(range, empty).toArray(), [1, 2, 3, 1, 2, 3]);
            Test_1.Test.isArrayEqual(range.concat(empty, range).toArray(), [1, 2, 3, 1, 2, 3]);
        });
    }
    function contains(instancer) {
        it("Empty returns false", function () {
            var empty = instancer([]);
            Test_1.Test.isFalse(empty.contains(999));
            Test_1.Test.isFalse(empty.contains(0));
            Test_1.Test.isFalse(empty.contains(-999));
        });
        it("Value is correct", function () {
            var base = instancer([1, 2, 4]);
            Test_1.Test.isTrue(base.contains(1));
            Test_1.Test.isTrue(base.contains(2));
            Test_1.Test.isTrue(base.contains(4));
            Test_1.Test.isFalse(base.contains(3));
            Test_1.Test.isFalse(base.contains(7));
        });
    }
    function count(instancer) {
        it("Empty returns Zero (no predicate)", function () {
            var empty = instancer([]);
            Test_1.Test.isEqual(empty.count(), 0);
        });
        it("Empty returns Zero (with predicate)", function () {
            var empty = instancer([]);
            Test_1.Test.isEqual(empty.count(function (e) { return e === 13; }), 0);
        });
        it("Value is correct (no predicate)", function () {
            var base = instancer([1]);
            Test_1.Test.isEqual(base.count(), 1);
            base = instancer([1, 2, 3]);
            Test_1.Test.isEqual(base.count(), 3);
            base = instancer(Enumerables_1.Enumerable.range(1, 66).toArray());
            Test_1.Test.isEqual(base.count(), 66);
        });
        it("Value is correct (with predicate)", function () {
            var base = instancer([1]);
            Test_1.Test.isEqual(base.count(function (e) { return e < 4; }), 1);
            Test_1.Test.isEqual(base.count(function (e) { return e > 4; }), 0);
            base = instancer([1, 2, 3]);
            Test_1.Test.isEqual(base.count(function (e) { return e % 2 !== 0; }), 2);
            Test_1.Test.isEqual(base.count(function (e) { return e > 0; }), 3);
            Test_1.Test.isEqual(base.count(function (e) { return e <= 1; }), 1);
            base = instancer(Enumerables_1.Enumerable.range(1, 66).toArray());
            Test_1.Test.isEqual(base.count(function (e) { return e < 1; }), 0);
            Test_1.Test.isEqual(base.count(function (e) { return e > 20; }), 46);
            Test_1.Test.isEqual(base.count(function (e) { return e < 100; }), 66);
        });
    }
    function defaultIfEmpty(instancer) {
        it("Return normal array if not empty (no default value)", function () {
            var base = instancer([1, 2, 3]);
            Test_1.Test.isArrayEqual(base.defaultIfEmpty().toArray(), [1, 2, 3]);
        });
        it("Return normal array if not empty (with default value)", function () {
            var base = instancer([1, 2, 3]);
            Test_1.Test.isArrayEqual(base.defaultIfEmpty(666).toArray(), [1, 2, 3]);
        });
        it("Return single element (undefined) array if empty (no default value)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(base.defaultIfEmpty().toArray(), [undefined]);
        });
        it("Return single element (undefined) array if empty (with default value)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(base.defaultIfEmpty(666).toArray(), [666]);
        });
        it("Multiple iterations (no default value)", function () {
            var base = instancer([]).defaultIfEmpty();
            Test_1.Test.isArrayEqual(base.toArray(), [undefined]);
            Test_1.Test.isArrayEqual(base.toArray(), [undefined]);
            Test_1.Test.isArrayEqual(base.toArray(), [undefined]);
        });
        it("Multiple iterations (with default value)", function () {
            var base = instancer([]).defaultIfEmpty(666);
            Test_1.Test.isArrayEqual(base.toArray(), [666]);
            Test_1.Test.isArrayEqual(base.toArray(), [666]);
            Test_1.Test.isArrayEqual(base.toArray(), [666]);
        });
        it("Using iterators (no default value)", function () {
            var base = instancer([]).defaultIfEmpty();
            Test_1.Test.throwsException(function () { return base.value(); });
            Test_1.Test.isTrue(base.next());
            Test_1.Test.isEqual(base.value(), undefined);
            Test_1.Test.isEqual(base.value(), undefined);
            Test_1.Test.isFalse(base.next());
        });
        it("Using iterators (with default value)", function () {
            var base = instancer([]).defaultIfEmpty(666);
            Test_1.Test.throwsException(function () { return base.value(); });
            Test_1.Test.isTrue(base.next());
            Test_1.Test.isEqual(base.value(), 666);
            Test_1.Test.isEqual(base.value(), 666);
            Test_1.Test.isFalse(base.next());
        });
    }
    function distinct(instancer) {
        it("Return empty if empty (no predicate)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(base.distinct(function (e) { return e; }).toArray(), []);
        });
        it("Value is correct (no predicate)", function () {
            var base = instancer([
                -5, 6, 2, 6, 99, 0, -5, 2, 7, 2, 0,
            ]);
            Test_1.Test.isArrayEqual(base.distinct(function (e) { return e; }).toArray(), [-5, 6, 2, 99, 0, 7]);
        });
        it("Return empty if empty (with predicate)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(base.distinct(function (x) { return x; }).toArray(), []);
        });
        it("Value is correct (with predicate)", function () {
            var base = instancer([
                "a", "b", "aba", "ce", "wea", "baba", "era", "eaa",
            ]);
            Test_1.Test.isArrayEqual(base.distinct(function (e) { return e[0]; }).toArray(), ["a", "b", "ce", "wea", "era"]);
        });
        // TODO: Complex types
    }
    function orderBy(instancer) {
        it("Return empty if empty source (iterator)", function () {
            var base = instancer([]);
            var ordered = new Enumerables_1.Enumerable(base.orderBy(function (e) { return e; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), []);
        });
        it("Simple order (iterator)", function () {
            var base = instancer([2, 6, 3, 7, 1]);
            var ordered = new Enumerables_1.Enumerable(base.orderBy(function (e) { return e; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), [1, 2, 3, 6, 7]);
        });
        it("Simple order (custom comparer) (iterator)", function () {
            var base = instancer([2, 6, 3, 7, 1]);
            var ordered = new Enumerables_1.Enumerable(base.orderBy(function (e) { return e; }, function (l, r) { return l > r ? -1 : 1; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });
        it("Simple order (string) (iterator)", function () {
            var base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            var ordered = new Enumerables_1.Enumerable(base.orderBy(function (e) { return e[1]; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), ["Manolo", "Antonio", "Ivan", "Uxue"]);
        });
        it("Return empty if empty source", function () {
            var base = instancer([]);
            var ordered = base.orderBy(function (e) { return e; });
            Test_1.Test.isArrayEqual(ordered.toArray(), []);
        });
        it("Simple order", function () {
            var base = instancer([2, 6, 3, 7, 1]);
            var ordered = base.orderBy(function (e) { return e; });
            Test_1.Test.isArrayEqual(ordered.toArray(), [1, 2, 3, 6, 7]);
        });
        it("Simple order (custom comparer)", function () {
            var base = instancer([2, 6, 3, 7, 1]);
            var ordered = base.orderBy(function (e) { return e; }, function (l, r) { return l > r ? -1 : 1; });
            Test_1.Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });
        it("Simple order (string)", function () {
            var base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            var ordered = base.orderBy(function (e) { return e[1]; });
            Test_1.Test.isArrayEqual(ordered.toArray(), ["Manolo", "Antonio", "Ivan", "Uxue"]);
        });
        it("Return empty if empty source (double)", function () {
            var base = instancer([]);
            var ordered = base.orderBy(function (e) { return e; }).orderBy(function (e) { return e; });
            Test_1.Test.isArrayEqual(ordered.toArray(), []);
        });
        it("Simple order (double)", function () {
            var base = instancer([2, 6, 3, 7, 1]);
            var ordered = base.orderBy(function (e) { return e; }).orderBy(function (e) { return e; });
            Test_1.Test.isArrayEqual(ordered.toArray(), [1, 2, 3, 6, 7]);
        });
        it("Simple order (custom comparer) (double)", function () {
            var base = instancer([2, 6, 3, 7, 1]);
            var ordered = base.orderBy(function (e) { return e; }).orderBy(function (e) { return e; }, function (l, r) { return l > r ? -1 : 1; });
            Test_1.Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });
        it("Simple order (string) (double)", function () {
            var base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            var ordered = base.orderBy(function (e) { return e[1]; }).orderBy(function (e) { return e[1]; });
            Test_1.Test.isArrayEqual(ordered.toArray(), ["Manolo", "Antonio", "Ivan", "Uxue"]);
        });
    }
    function orderByDescending(instancer) {
        it("Return empty if empty source (iterator)", function () {
            var base = instancer([]);
            var ordered = new Enumerables_1.Enumerable(base.orderByDescending(function (e) { return e; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), []);
        });
        it("Simple order (iterator)", function () {
            var base = instancer([2, 6, 3, 7, 1]);
            var ordered = new Enumerables_1.Enumerable(base.orderByDescending(function (e) { return e; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });
        it("Simple order (string) (iterator)", function () {
            var base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            var ordered = new Enumerables_1.Enumerable(base.orderByDescending(function (e) { return e[1]; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), ["Uxue", "Ivan", "Antonio", "Manolo"]);
        });
        it("Return empty if empty source", function () {
            var base = instancer([]);
            var ordered = base.orderByDescending(function (e) { return e; });
            Test_1.Test.isArrayEqual(ordered.toArray(), []);
        });
        it("Simple order", function () {
            var base = instancer([2, 6, 3, 7, 1]);
            var ordered = base.orderByDescending(function (e) { return e; });
            Test_1.Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });
        it("Simple order (string)", function () {
            var base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            var ordered = base.orderByDescending(function (e) { return e[1]; });
            Test_1.Test.isArrayEqual(ordered.toArray(), ["Uxue", "Ivan", "Antonio", "Manolo"]);
        });
        it("Return empty if empty source (double)", function () {
            var base = instancer([]);
            var ordered = base.orderByDescending(function (e) { return e; }).orderByDescending(function (e) { return e; });
            Test_1.Test.isArrayEqual(ordered.toArray(), []);
        });
        it("Simple order (double)", function () {
            var base = instancer([2, 6, 3, 7, 1]);
            var ordered = base.orderByDescending(function (e) { return e; }).orderByDescending(function (e) { return e; });
            Test_1.Test.isArrayEqual(ordered.toArray(), [7, 6, 3, 2, 1]);
        });
        it("Simple order (double) (string)", function () {
            var base = instancer(["Ivan", "Uxue", "Manolo", "Antonio"]);
            var ordered = base.orderByDescending(function (e) { return e; }).orderByDescending(function (e) { return e[1]; });
            Test_1.Test.isArrayEqual(ordered.toArray(), ["Uxue", "Ivan", "Antonio", "Manolo"]);
        });
    }
    function reverse(instancer) {
        it("Value is correct ", function () {
            var base = instancer([1, 2, 3, 4]).reverse();
            Test_1.Test.isArrayEqual(base.toArray(), [4, 3, 2, 1]);
        });
        it("Value is correct (iterator)", function () {
            var base = new Enumerables_1.Enumerable(instancer([1, 2, 3, 4]).reverse());
            Test_1.Test.isArrayEqual(base.toArray(), [4, 3, 2, 1]);
        });
        it("Double reverse does nothing", function () {
            var base = instancer([1, 2, 3, 4]).reverse().reverse();
            Test_1.Test.isArrayEqual(base.toArray(), [1, 2, 3, 4]);
            base = new Enumerables_1.Enumerable(instancer([1, 2, 3, 4]).reverse()).reverse();
            Test_1.Test.isArrayEqual(base.toArray(), [1, 2, 3, 4]);
        });
        it("Double reverse does nothing (iterator)", function () {
            var base = new Enumerables_1.Enumerable(instancer([1, 2, 3, 4]).reverse().reverse());
            Test_1.Test.isArrayEqual(base.toArray(), [1, 2, 3, 4]);
            base = new Enumerables_1.Enumerable(new Enumerables_1.Enumerable(instancer([1, 2, 3, 4]).reverse()).reverse());
            Test_1.Test.isArrayEqual(base.toArray(), [1, 2, 3, 4]);
        });
    }
    function elementAt(instancer) {
        it("Negative index throws exception", function () {
            var base = instancer([1, 2, 3, 4]);
            Test_1.Test.throwsException(function () { return base.elementAt(-1); });
            Test_1.Test.throwsException(function () { return base.elementAt(-666); });
        });
        it("Out of bounds index throws exception", function () {
            var base = instancer([1, 2]);
            Test_1.Test.throwsException(function () { return base.elementAt(2); });
            Test_1.Test.throwsException(function () { return base.elementAt(666); });
        });
        it("Value is correct", function () {
            var base = instancer([1, 2, 3, 4]);
            Test_1.Test.throwsException(function () { return base.elementAt(-1); });
            Test_1.Test.isEqual(base.elementAt(0), 1);
            Test_1.Test.isEqual(base.elementAt(1), 2);
            Test_1.Test.isEqual(base.elementAt(2), 3);
            Test_1.Test.isEqual(base.elementAt(3), 4);
            Test_1.Test.throwsException(function () { return base.elementAt(4); });
        });
    }
    function elementAtOrDefault(instancer) {
        it("Negative index throws exception", function () {
            var base = instancer([1, 2, 3, 4]);
            Test_1.Test.throwsException(function () { return base.elementAtOrDefault(-1); });
            Test_1.Test.throwsException(function () { return base.elementAtOrDefault(-666); });
        });
        it("Out of bounds index returns undefined", function () {
            var base = instancer([1, 2]);
            Test_1.Test.isEqual(base.elementAtOrDefault(2), undefined);
            Test_1.Test.isEqual(base.elementAtOrDefault(666), undefined);
        });
        it("Value is correct", function () {
            var base = instancer([1, 2, 3, 4]);
            Test_1.Test.throwsException(function () { return base.elementAtOrDefault(-1); });
            Test_1.Test.isEqual(base.elementAtOrDefault(0), 1);
            Test_1.Test.isEqual(base.elementAtOrDefault(1), 2);
            Test_1.Test.isEqual(base.elementAtOrDefault(2), 3);
            Test_1.Test.isEqual(base.elementAtOrDefault(3), 4);
            Test_1.Test.isEqual(base.elementAtOrDefault(4), undefined);
        });
    }
    function except(instancer) {
        it("Value is correct (empty)", function () {
            var base = instancer([1, 2, 3, 4]);
            var base2 = instancer([]);
            Test_1.Test.isArrayEqual(base.except(base2).toArray(), [1, 2, 3, 4]);
            base = instancer([]);
            Test_1.Test.isArrayEqual(base.except(base2).toArray(), []);
        });
        it("Value is correct", function () {
            var base = instancer([1, 2, 3, 4]);
            var base2 = instancer([2, 5, 1, 7]);
            Test_1.Test.isArrayEqual(base.except(base2).toArray(), [3, 4]);
            base2 = instancer([3, 6, 88]);
            Test_1.Test.isArrayEqual(base.except(base2).toArray(), [1, 2, 4]);
        });
    }
    function first(instancer) {
        it("Exception if empty", function () {
            var base = instancer([]);
            Test_1.Test.throwsException(function () { return base.first(); });
        });
        it("Exception if no element found", function () {
            var base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test_1.Test.throwsException(function () { return base.first(function (e) { return e === 11811; }); });
        });
        it("Value is correct", function () {
            var base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test_1.Test.isEqual(base.first(), -2);
            Test_1.Test.isEqual(base.first(function (e) { return e > 5; }), 65);
            Test_1.Test.isEqual(base.first(function (e) { return e % 6 === 0; }), 42);
        });
    }
    function firstOrDefault(instancer) {
        it("Undefined if empty", function () {
            var base = instancer([]);
            Test_1.Test.isEqual(base.firstOrDefault(), undefined);
        });
        it("Undefined if no element found", function () {
            var base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test_1.Test.isEqual(base.firstOrDefault(function (e) { return e === 11811; }), undefined);
        });
        it("Value is correct", function () {
            var base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test_1.Test.isEqual(base.firstOrDefault(), -2);
            Test_1.Test.isEqual(base.firstOrDefault(function (e) { return e > 5; }), 65);
            Test_1.Test.isEqual(base.firstOrDefault(function (e) { return e % 6 === 0; }), 42);
        });
    }
    function last(instancer) {
        it("Exception if empty", function () {
            var base = instancer([]);
            Test_1.Test.throwsException(function () { return base.last(); });
        });
        it("Exception if no element found", function () {
            var base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test_1.Test.throwsException(function () { return base.last(function (e) { return e === 11811; }); });
        });
        it("Value is correct", function () {
            var base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test_1.Test.isEqual(base.last(), 2);
            Test_1.Test.isEqual(base.last(function (e) { return e > 5; }), 7);
            Test_1.Test.isEqual(base.last(function (e) { return e % 6 === 0; }), 36);
        });
    }
    function lastOrDefault(instancer) {
        it("Exception if empty", function () {
            var base = instancer([]);
            Test_1.Test.isEqual(base.lastOrDefault(), undefined);
        });
        it("Exception if no element found", function () {
            var base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test_1.Test.isEqual(base.lastOrDefault(function (e) { return e === 11811; }), undefined);
        });
        it("Value is correct", function () {
            var base = instancer([-2, 4, 65, 42, 32, 1, 36, 7, 2]);
            Test_1.Test.isEqual(base.lastOrDefault(), 2);
            Test_1.Test.isEqual(base.lastOrDefault(function (e) { return e > 5; }), 7);
            Test_1.Test.isEqual(base.lastOrDefault(function (e) { return e % 6 === 0; }), 36);
        });
    }
    function forEach(instancer) {
        it("All elements are iterated", function () {
            var base = instancer([1, 2, 3]);
            var iterated = [];
            base.forEach(function (e) {
                iterated.push(e);
            });
            Test_1.Test.isArrayEqual(base.toArray(), iterated);
        });
        it("Primitive type inmutability", function () {
            var base = instancer([1, 2, 3]);
            var original = base.toArray();
            base.forEach(function (e) {
                e = e + 1;
            });
            Test_1.Test.isArrayEqual(base.toArray(), original);
        });
        it("Using indices", function () {
            var base = instancer([1, 2, 3]);
            var indices = [];
            base.forEach(function (e, i) {
                indices.push(e + i);
            });
            Test_1.Test.isArrayEqual(indices, [1, 3, 5]);
        });
    }
    function max(instancer) {
        it("Exception if empty", function () {
            var base = instancer([]);
            Test_1.Test.throwsException(function () { return base.max(); });
        });
        it("Value is correct (no selector)", function () {
            var base = instancer([2]);
            Test_1.Test.isEqual(base.max(), 2);
            base = instancer([3, 4, -8, 77, 1]);
            Test_1.Test.isEqual(base.max(), 77);
        });
        it("Value is correct (with selector)", function () {
            var strbase = instancer([
                "hello", "ivan", "how", "are", "you",
            ]);
            Test_1.Test.isEqual(strbase.max(), "you");
            Test_1.Test.isEqual(strbase.max(function (e) { return e[0]; }), "y");
            Test_1.Test.isEqual(strbase.max(function (e) { return e[1]; }), "v");
        });
    }
    function min(instancer) {
        it("Exception if empty", function () {
            var base = instancer([]);
            Test_1.Test.throwsException(function () { return base.min(); });
        });
        it("Value is correct (no selector)", function () {
            var base = instancer([2]);
            Test_1.Test.isEqual(base.min(), 2);
            base = instancer([3, 4, -8, 77, 1]);
            Test_1.Test.isEqual(base.min(), -8);
        });
        it("Value is correct (with selector)", function () {
            var strbase = instancer([
                "hello", "ivan", "how", "are", "you",
            ]);
            Test_1.Test.isEqual(strbase.min(), "are");
            Test_1.Test.isEqual(strbase.min(function (e) { return e[0]; }), "a");
            Test_1.Test.isEqual(strbase.min(function (e) { return e[1]; }), "e");
        });
    }
    function select(instancer) {
        it("Empty if empty", function () {
            var base = instancer([]).select(function (e) { return e + 1; });
            Test_1.Test.isArrayEqual(base.toArray(), []);
        });
        it("Value is correct", function () {
            var base = instancer([1, 2, 3]).select(function (e) { return e + 1; });
            Test_1.Test.isArrayEqual(base.toArray(), [2, 3, 4]);
        });
        it("Value is correct (string)", function () {
            var base = instancer(["pepin", "sanz", "macheta"]).select(function (e) { return e.length; });
            Test_1.Test.isArrayEqual(base.toArray(), [5, 4, 7]);
        });
    }
    var SelectManyTestClass = /** @class */ (function () {
        function SelectManyTestClass(numbers) {
            this.numbers = numbers;
        }
        return SelectManyTestClass;
    }());
    function selectMany(instancer) {
        it("Empty returns empty", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(base.selectMany(function (e) { return e.numbers; }).toArray(), []);
        });
        it("Single element", function () {
            var base = instancer([new SelectManyTestClass(instancer([1, 2, 3]))]);
            Test_1.Test.isArrayEqual(base.selectMany(function (e) { return e.numbers; }).toArray(), [1, 2, 3]);
        });
        it("Multiple elements", function () {
            var base = instancer([
                new SelectManyTestClass(instancer([1, 2, 3])),
                new SelectManyTestClass(instancer([4, 5])),
                new SelectManyTestClass(instancer([])),
                new SelectManyTestClass(instancer([6])),
                new SelectManyTestClass(instancer([7, 8])),
            ]);
            Test_1.Test.isArrayEqual(base.selectMany(function (e) { return e.numbers; }).toArray(), [1, 2, 3, 4, 5, 6, 7, 8]);
        });
    }
    function sequenceEqual(instancer) {
        var Person = /** @class */ (function () {
            function Person(firstName, lastName, age) {
                this.firstName = firstName;
                this.lastName = lastName;
                this.age = age;
            }
            return Person;
        }());
        it("Both empty return true", function () {
            var first = instancer([]);
            var second = instancer([]);
            Test_1.Test.isTrue(first.sequenceEqual(second));
            Test_1.Test.isTrue(first.sequenceEqual(second.toArray()));
        });
        it("Different count return false (number)", function () {
            var first = instancer([]);
            var second = instancer([1]);
            Test_1.Test.isFalse(first.sequenceEqual(second));
            Test_1.Test.isFalse(first.sequenceEqual(second.toArray()));
        });
        it("Same count different values return false (number)", function () {
            var first = instancer([2]);
            var second = instancer([1]);
            Test_1.Test.isFalse(first.sequenceEqual(second));
            Test_1.Test.isFalse(first.sequenceEqual(second.toArray()));
        });
        it("Different count return false (string)", function () {
            var first = instancer([]);
            var second = instancer(["test1"]);
            Test_1.Test.isFalse(first.sequenceEqual(second));
            Test_1.Test.isFalse(first.sequenceEqual(second.toArray()));
        });
        it("Same count different values return false (string)", function () {
            var first = instancer(["test1"]);
            var second = instancer(["test2"]);
            Test_1.Test.isFalse(first.sequenceEqual(second));
            Test_1.Test.isFalse(first.sequenceEqual(second.toArray()));
        });
        it("Same object in both return true", function () {
            var obj = {};
            var first = instancer([obj]);
            var second = instancer([obj]);
            Test_1.Test.isTrue(first.sequenceEqual(second));
            Test_1.Test.isTrue(first.sequenceEqual(second.toArray()));
        });
        var stringLengthComparer = function (left, right) { return left.length === right.length; };
        it("Custom comparer; check lengths; should return true (string)", function () {
            var first = instancer(["one"]);
            var second = instancer(["two"]);
            Test_1.Test.isTrue(first.sequenceEqual(second, stringLengthComparer));
            Test_1.Test.isTrue(first.sequenceEqual(second.toArray(), stringLengthComparer));
        });
        it("Custom comparer; check lengths; should return false (string)", function () {
            var first = instancer(["three"]);
            var second = instancer(["four"]);
            Test_1.Test.isFalse(first.sequenceEqual(second, stringLengthComparer));
            Test_1.Test.isFalse(first.sequenceEqual(second.toArray(), stringLengthComparer));
        });
        var personAgeAndFirstNameComparer = function (left, right) {
            return left.age === right.age && left.firstName === right.firstName;
        };
        it("Custom comparer; same count; same objects; should return true (complex object)", function () {
            var person = new Person("Ben", "Jerry", 42);
            var first = instancer([person, person, person]);
            var second = instancer([person, person, person]);
            Test_1.Test.isTrue(first.sequenceEqual(second, personAgeAndFirstNameComparer));
            Test_1.Test.isTrue(first.sequenceEqual(second.toArray(), personAgeAndFirstNameComparer));
        });
        it("Custom comparer; same count; different objects with same values; should return true (complex object)", function () {
            var person1 = new Person("Ben", "Jerry", 42);
            var person2 = new Person("Ben", "Smith", 42);
            var first = instancer([person1, person2, person1]);
            var second = instancer([person2, person1, person2]);
            Test_1.Test.isTrue(first.sequenceEqual(second, personAgeAndFirstNameComparer));
            Test_1.Test.isTrue(first.sequenceEqual(second.toArray(), personAgeAndFirstNameComparer));
        });
        it("Custom comparer; same count; different objects with different values; should return false (complex object)", function () {
            var person1 = new Person("Ben", "Jerry", 42);
            var person2 = new Person("John", "Smith", 42);
            var first = instancer([person1, person2, person1]);
            var second = instancer([person2, person1, person2]);
            Test_1.Test.isFalse(first.sequenceEqual(second, personAgeAndFirstNameComparer));
            Test_1.Test.isFalse(first.sequenceEqual(second.toArray(), personAgeAndFirstNameComparer));
        });
        it("ArrayQueryable<T> vs different IQueryable<T> must fallback to iterator approach", function () {
            var person1 = new Person("Ben", "Jerry", 42);
            var person2 = new Person("John", "Smith", 42);
            // always ArrayQueryable<T>
            var first = new Collections_1.List([person1, person2, person1]);
            var second = instancer([person2, person1, person2]);
            Test_1.Test.isFalse(first.sequenceEqual(second, personAgeAndFirstNameComparer));
            Test_1.Test.isFalse(first.sequenceEqual(second.toArray(), personAgeAndFirstNameComparer));
        });
    }
    function single(instancer) {
        it("Exception if empty (no selector)", function () {
            var base = instancer([]);
            Test_1.Test.throwsException(function () { return base.single(); });
        });
        it("Exception if empty (with selector)", function () {
            var base = instancer([]);
            Test_1.Test.throwsException(function () { return base.single(function (e) { return true; }); });
        });
        it("Value is correct (single element)", function () {
            var base = instancer([33]);
            Test_1.Test.isEqual(base.single(), 33);
        });
        it("Value is correct (multiple elements)", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isEqual(base.single(function (e) { return e > 60; }), 65);
            Test_1.Test.isEqual(base.single(function (e) { return e % 6 === 0; }), 36);
        });
        it("Exception if no element was found", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.throwsException(function () { return base.single(function (e) { return e === 11811; }); });
        });
        it("Exception if more than 1 element was found", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.throwsException(function () { return base.single(); });
            Test_1.Test.throwsException(function () { return base.single(function (e) { return e > 5; }); });
        });
    }
    function singleOrDefault(instancer) {
        it("Undefined if empty (no selector)", function () {
            var base = instancer([]);
            Test_1.Test.isEqual(base.singleOrDefault(), undefined);
        });
        it("Undefined if empty (with selector)", function () {
            var base = instancer([]);
            Test_1.Test.isEqual(base.singleOrDefault(function (e) { return true; }), undefined);
        });
        it("Value is correct (single element)", function () {
            var base = instancer([33]);
            Test_1.Test.isEqual(base.singleOrDefault(), 33);
        });
        it("Value is correct (multiple elements)", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isEqual(base.singleOrDefault(function (e) { return e > 60; }), 65);
            Test_1.Test.isEqual(base.singleOrDefault(function (e) { return e % 6 === 0; }), 36);
        });
        it("Undefined if no element was found", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isEqual(base.singleOrDefault(function (e) { return e === 11811; }), undefined);
        });
        it("Exception if more than 1 element was found", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.throwsException(function () { return base.singleOrDefault(); });
            Test_1.Test.throwsException(function () { return base.singleOrDefault(function (e) { return e > 5; }); });
        });
    }
    function skip(instancer) {
        it("Exception if negative amount", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.throwsException(function () { return base.skip(-666); });
        });
        it("Value is same (skipping 0 elements)", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isArrayEqual(base.skip(0).toArray(), [-2, 4, 65, 32, 1, 36, 7, 2]);
        });
        it("Value is correct", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isArrayEqual(base.skip(1).toArray(), [4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isArrayEqual(base.skip(3).toArray(), [32, 1, 36, 7, 2]);
            Test_1.Test.isArrayEqual(base.skip(6).toArray(), [7, 2]);
        });
        it("Empty if amount >= count", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isArrayEqual(base.skip(8).toArray(), []);
            Test_1.Test.isArrayEqual(base.skip(99).toArray(), []);
            Test_1.Test.isArrayEqual(base.skip(666).toArray(), []);
        });
        it("Exception if index is out of bounds", function () {
            var base = instancer([-2, 4]).skip(1);
            Test_1.Test.throwsException(function () { return base.value(); });
            Test_1.Test.isTrue(base.next());
            Test_1.Test.isEqual(base.value(), 4);
            Test_1.Test.isFalse(base.next());
            Test_1.Test.throwsException(function () { return base.value(); });
        });
    }
    function skipTake(instancer) {
        it("Value is correct", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isArrayEqual(base.skip(2).take(2).toArray(), [65, 32]);
            Test_1.Test.isArrayEqual(base.skip(7).take(5).toArray(), [2]);
        });
        it("Exception if index is out of bounds", function () {
            var base = instancer([-2, 4, 5, 6]).skip(1).take(2);
            Test_1.Test.throwsException(function () { return base.value(); });
            Test_1.Test.isTrue(base.next());
            Test_1.Test.isEqual(base.value(), 4);
            Test_1.Test.isTrue(base.next());
            Test_1.Test.isEqual(base.value(), 5);
            Test_1.Test.isFalse(base.next());
            Test_1.Test.throwsException(function () { return base.value(); });
        });
    }
    function skipWhile(instancer) {
        it("Empty if empty (true)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(base.skipWhile(function (e) { return true; }).toArray(), []);
        });
        it("Empty if empty (false)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(base.skipWhile(function (e) { return false; }).toArray(), []);
        });
        it("Empty if empty (true) (iterator)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(new Enumerables_1.Enumerable(base.skipWhile(function (e) { return true; })).toArray(), []);
        });
        it("Empty if empty (false) (iterator)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(new Enumerables_1.Enumerable(base.skipWhile(function (e) { return false; })).toArray(), []);
        });
        it("Value is correct (returns elements)", function () {
            var base = instancer([39, 40, 21, 66, 20]);
            var skipWhile = base.skipWhile(function (e) { return e >= 39; });
            Test_1.Test.isArrayEqual(skipWhile.toArray(), [21, 66, 20]);
        });
        it("Value is correct (no elements)", function () {
            var base = instancer([39, 21, 66, 20]);
            var skipWhile = base.skipWhile(function (e) { return e < 90; });
            Test_1.Test.isArrayEqual(skipWhile.toArray(), []);
        });
        it("Value is correct (returns elements) (iterator)", function () {
            var base = instancer([39, 21, 66, 20]);
            var skipWhile = new Enumerables_1.Enumerable(base.skipWhile(function (e) { return e >= 39; }));
            Test_1.Test.isArrayEqual(skipWhile.toArray(), [21, 66, 20]);
        });
        it("Value is correct (no elements) (iterator)", function () {
            var base = instancer([39, 21, 66, 20]);
            var skipWhile = new Enumerables_1.Enumerable(base.skipWhile(function (e) { return e < 90; }));
            Test_1.Test.isArrayEqual(skipWhile.toArray(), []);
        });
    }
    function sum(instancer) {
        it("Zero if empty", function () {
            var base = instancer([]);
            Test_1.Test.isEqual(base.sum(function (e) { return e; }), 0);
        });
        it("Value is correct (single element)", function () {
            var base = instancer([2]);
            Test_1.Test.isEqual(base.sum(function (e) { return e; }), 2);
        });
        it("Value is correct (multiple elements)", function () {
            var base = instancer([3, 4, -20, 1]);
            Test_1.Test.isEqual(base.sum(function (e) { return e; }), -12);
        });
    }
    function take(instancer) {
        it("Exception if negative amount", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.throwsException(function () { return base.take(-666); });
        });
        it("Value is empty (take 0 elements)", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isArrayEqual(base.take(0).toArray(), []);
        });
        it("Value is correct", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isArrayEqual(base.take(1).toArray(), [-2]);
            Test_1.Test.isArrayEqual(base.take(3).toArray(), [-2, 4, 65]);
            Test_1.Test.isArrayEqual(base.take(6).toArray(), [-2, 4, 65, 32, 1, 36]);
        });
        it("Value is correct (amount >= count)", function () {
            var base = instancer([-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isArrayEqual(base.take(8).toArray(), [-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isArrayEqual(base.take(99).toArray(), [-2, 4, 65, 32, 1, 36, 7, 2]);
            Test_1.Test.isArrayEqual(base.take(666).toArray(), [-2, 4, 65, 32, 1, 36, 7, 2]);
        });
        it("Exception if index is out of bounds", function () {
            var base = instancer([-2, 4]).take(1);
            Test_1.Test.throwsException(function () { return base.value(); });
            Test_1.Test.isTrue(base.next());
            Test_1.Test.isEqual(base.value(), -2);
            Test_1.Test.isFalse(base.next());
            Test_1.Test.throwsException(function () { return base.value(); });
        });
    }
    function takeWhile(instancer) {
        it("Empty if empty (true)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(base.takeWhile(function (e) { return true; }).toArray(), []);
        });
        it("Empty if empty (false)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(base.takeWhile(function (e) { return false; }).toArray(), []);
        });
        it("Empty if empty (true) (iterator)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(new Enumerables_1.Enumerable(base.takeWhile(function (e) { return true; })).toArray(), []);
        });
        it("Empty if empty (false) (iterator)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(new Enumerables_1.Enumerable(base.takeWhile(function (e) { return false; })).toArray(), []);
        });
        it("Value is correct (returns elements)", function () {
            var base = instancer([39, 40, 21, 66, 20]);
            var takeWhile = base.takeWhile(function (e) { return e >= 39; });
            Test_1.Test.isArrayEqual(takeWhile.toArray(), [39, 40]);
        });
        it("Value is correct (no elements)", function () {
            var base = instancer([39, 21, 66, 20]);
            var takeWhile = base.takeWhile(function (e) { return e > 90; });
            Test_1.Test.isArrayEqual(takeWhile.toArray(), []);
        });
        it("Value is correct (returns elements) (iterator)", function () {
            var base = instancer([39, 40, 21, 66, 20]);
            var takeWhile = new Enumerables_1.Enumerable(base.takeWhile(function (e) { return e >= 39; }));
            Test_1.Test.isArrayEqual(takeWhile.toArray(), [39, 40]);
        });
        it("Value is correct (no elements) (iterator)", function () {
            var base = instancer([39, 21, 66, 20]);
            var takeWhile = new Enumerables_1.Enumerable(base.takeWhile(function (e) { return e > 90; }));
            Test_1.Test.isArrayEqual(takeWhile.toArray(), []);
        });
    }
    function union(instancer) {
        it("Empty returns empty", function () {
            var base1 = instancer([]);
            var base2 = instancer([]);
            var union = base1.union(base2);
            Test_1.Test.isArrayEqual(union.toArray(), []);
        });
        it("Empty returns empty (iterator)", function () {
            var base1 = instancer([]);
            var base2 = instancer([]);
            var union = new Enumerables_1.Enumerable(base1.union(base2));
            Test_1.Test.isArrayEqual(union.toArray(), []);
        });
        it("Value is correct", function () {
            var base1 = instancer([1, 2, 3, 4]);
            var base2 = instancer([2, 5, 6, 1, 7]);
            var union = base1.union(base2);
            Test_1.Test.isArrayEqual(union.toArray(), [1, 2, 3, 4, 5, 6, 7]);
        });
        it("Value is correct (iterator)", function () {
            var base1 = instancer([1, 2, 3, 4]);
            var base2 = instancer([2, 5, 6, 1, 7]);
            var union = new Enumerables_1.Enumerable(base1.union(base2));
            Test_1.Test.isArrayEqual(union.toArray(), [1, 2, 3, 4, 5, 6, 7]);
        });
        it("Value is correct (left is empty)", function () {
            var base1 = instancer([1, 2, 3, 4]);
            var base2 = instancer([]);
            var union = base1.union(base2);
            Test_1.Test.isArrayEqual(union.toArray(), [1, 2, 3, 4]);
        });
        it("Value is correct (left is empty) (iterator)", function () {
            var base1 = instancer([]);
            var base2 = instancer([1, 2, 3, 4]);
            var union = new Enumerables_1.Enumerable(base1.union(base2));
            Test_1.Test.isArrayEqual(union.toArray(), [1, 2, 3, 4]);
        });
        it("Value is correct (right is empty)", function () {
            var base1 = instancer([]);
            var base2 = instancer([1, 2, 3, 4]);
            var union = base1.union(base2);
            Test_1.Test.isArrayEqual(union.toArray(), [1, 2, 3, 4]);
        });
        it("Value is correct (right is empty) (iterator)", function () {
            var base1 = instancer([1, 2, 3, 4]);
            var base2 = instancer([]);
            var union = new Enumerables_1.Enumerable(base1.union(base2));
            Test_1.Test.isArrayEqual(union.toArray(), [1, 2, 3, 4]);
        });
    }
    function where(instancer) {
        it("Empty if empty", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(base.where(function (e) { return true; }).toArray(), []);
        });
        it("Value is correct (returns elements)", function () {
            var base = instancer([39, 21, 66, 20]);
            var where = base.where(function (e) { return e < 30; });
            Test_1.Test.isArrayEqual(where.toArray(), [21, 20]);
        });
        it("Value is correct (no elements)", function () {
            var base = instancer([39, 21, 66, 20]);
            var where = base.where(function (e) { return e > 90; });
            Test_1.Test.isArrayEqual(where.toArray(), []);
        });
        it("Empty if empty (iterator)", function () {
            var base = instancer([]);
            Test_1.Test.isArrayEqual(new Enumerables_1.Enumerable(base.where(function (e) { return true; })).toArray(), []);
        });
        it("Value is correct (returns elements) (iterator)", function () {
            var base = instancer([39, 21, 66, 20]);
            var where = new Enumerables_1.Enumerable(base.where(function (e) { return e < 30; }));
            Test_1.Test.isArrayEqual(where.toArray(), [21, 20]);
        });
        it("Value is correct (no elements) (iterator)", function () {
            var base = instancer([39, 21, 66, 20]);
            var where = new Enumerables_1.Enumerable(base.where(function (e) { return e > 90; }));
            Test_1.Test.isArrayEqual(where.toArray(), []);
        });
    }
    var IThenByTestClass = /** @class */ (function () {
        function IThenByTestClass() {
        }
        return IThenByTestClass;
    }());
    function thenBy(instancer) {
        it("Return empty if empty source (iterator)", function () {
            var base = instancer([]);
            var ordered = new Enumerables_1.Enumerable(base.orderBy(function (e) { return e; }).thenBy(function (e) { return e; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), []);
        });
        it("Simple order 1 (iterator)", function () {
            var elements = [
                { id: 1, day: 4 },
                { id: 2, day: 7 },
                { id: 3, day: 4 },
                { id: 4, day: 9 },
                { id: 5, day: 1 },
            ];
            var base = instancer(elements);
            var ordered = new Enumerables_1.Enumerable(base.orderBy(function (e) { return e.day; }).thenBy(function (e) { return e.id; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[0],
                elements[2],
                elements[1],
                elements[3],
            ]);
        });
        it("Simple order 2 (iterator)", function () {
            var elements = [
                { id: 5, day: 7 },
                { id: 2, day: 5 },
                { id: 3, day: 4 },
                { id: 1, day: 7 },
                { id: 4, day: 4 },
            ];
            var base = instancer(elements);
            var ordered = new Enumerables_1.Enumerable(base.orderBy(function (e) { return e.day; }).thenBy(function (e) { return e.id; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), [
                elements[2],
                elements[4],
                elements[1],
                elements[3],
                elements[0],
            ]);
        });
        it("Simple order (custom comparer) (iterator)", function () {
            var elements = [
                { id: 1, day: 4 },
                { id: 2, day: 7 },
                { id: 3, day: 4 },
                { id: 4, day: 9 },
                { id: 5, day: 1 },
            ];
            var base = instancer(elements);
            var ordered = new Enumerables_1.Enumerable(base.orderBy(function (e) { return e.day; }).thenBy(function (e) { return e.id; }, function (l, r) { return l < 3 ? 1 : -1; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[0],
                elements[1],
                elements[3],
            ]);
        });
        it("Return empty if empty source", function () {
            var base = instancer([]);
            var ordered = base.orderBy(function (e) { return e; }).thenBy(function (e) { return e; });
            Test_1.Test.isArrayEqual(ordered.toArray(), []);
        });
        it("Simple order 1", function () {
            var elements = [
                { id: 1, day: 4 },
                { id: 2, day: 7 },
                { id: 3, day: 4 },
                { id: 4, day: 9 },
                { id: 5, day: 1 },
            ];
            var base = instancer(elements);
            var ordered = base.orderBy(function (e) { return e.day; }).thenBy(function (e) { return e.id; });
            Test_1.Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[0],
                elements[2],
                elements[1],
                elements[3],
            ]);
        });
        it("Simple order 2", function () {
            var elements = [
                { id: 5, day: 7 },
                { id: 2, day: 5 },
                { id: 3, day: 4 },
                { id: 1, day: 7 },
                { id: 4, day: 4 },
            ];
            var base = instancer(elements);
            var ordered = base.orderBy(function (e) { return e.day; }).thenBy(function (e) { return e.id; });
            Test_1.Test.isArrayEqual(ordered.toArray(), [
                elements[2],
                elements[4],
                elements[1],
                elements[3],
                elements[0],
            ]);
        });
        it("Simple order (custom comparer)", function () {
            var elements = [
                { id: 1, day: 4 },
                { id: 2, day: 7 },
                { id: 3, day: 4 },
                { id: 4, day: 9 },
                { id: 5, day: 1 },
            ];
            var base = instancer(elements);
            var ordered = base.orderBy(function (e) { return e.day; }).thenBy(function (e) { return e.id; }, function (l, r) { return l < 3 ? 1 : -1; });
            Test_1.Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[0],
                elements[1],
                elements[3],
            ]);
        });
    }
    function thenByDescending(instancer) {
        it("Return empty if empty source (iterator)", function () {
            var base = instancer([]);
            var ordered = new Enumerables_1.Enumerable(base.orderBy(function (e) { return e; }).thenByDescending(function (e) { return e; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), []);
        });
        it("Simple order 1 (iterator)", function () {
            var elements = [
                { id: 1, day: 4 },
                { id: 2, day: 7 },
                { id: 3, day: 4 },
                { id: 4, day: 9 },
                { id: 5, day: 1 },
            ];
            var base = instancer(elements);
            var ordered = new Enumerables_1.Enumerable(base.orderBy(function (e) { return e.day; }).thenByDescending(function (e) { return e.id; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[0],
                elements[1],
                elements[3],
            ]);
        });
        it("Simple order 2 (iterator)", function () {
            var elements = [
                { id: 5, day: 7 },
                { id: 2, day: 5 },
                { id: 3, day: 4 },
                { id: 1, day: 7 },
                { id: 4, day: 4 },
            ];
            var base = instancer(elements);
            var ordered = new Enumerables_1.Enumerable(base.orderBy(function (e) { return e.day; }).thenByDescending(function (e) { return e.id; }));
            Test_1.Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[1],
                elements[0],
                elements[3],
            ]);
        });
        it("Return empty if empty source", function () {
            var base = instancer([]);
            var ordered = base.orderBy(function (e) { return e; }).thenByDescending(function (e) { return e; });
            Test_1.Test.isArrayEqual(ordered.toArray(), []);
        });
        it("Simple order 1", function () {
            var elements = [
                { id: 1, day: 4 },
                { id: 2, day: 7 },
                { id: 3, day: 4 },
                { id: 4, day: 9 },
                { id: 5, day: 1 },
            ];
            var base = instancer(elements);
            var ordered = base.orderBy(function (e) { return e.day; }).thenByDescending(function (e) { return e.id; });
            Test_1.Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[0],
                elements[1],
                elements[3],
            ]);
        });
        it("Simple order 2", function () {
            var elements = [
                { id: 5, day: 7 },
                { id: 2, day: 5 },
                { id: 3, day: 4 },
                { id: 1, day: 7 },
                { id: 4, day: 4 },
            ];
            var base = instancer(elements);
            var ordered = base.orderBy(function (e) { return e.day; }).thenByDescending(function (e) { return e.id; });
            Test_1.Test.isArrayEqual(ordered.toArray(), [
                elements[4],
                elements[2],
                elements[1],
                elements[0],
                elements[3],
            ]);
        });
    }
    function groupBy(instancer) {
        it("Return empty if empty source", function () {
            var base = instancer([]);
            var grouped = base.groupBy(function (e) { return e.id; });
            Test_1.Test.isArrayEqual(grouped.toArray(), []);
        });
        it("Return empty if empty source (value selector)", function () {
            var base = instancer([]);
            var grouped = base.groupBy(function (e) { return e.id; }, function (e) { return e.name; });
            Test_1.Test.isArrayEqual(grouped.toArray(), []);
        });
        it("Grouping is correct", function () {
            var people = [
                { id: 1, type: 3, name: "Ivan" },
                { id: 2, type: 2, name: "Juanmari" },
                { id: 3, type: 3, name: "Uxue" },
                { id: 4, type: 2, name: "Begoña" },
                { id: 5, type: 1, name: "Juanito" },
            ];
            var grouped = instancer(people)
                .groupBy(function (p) { return p.type; })
                .toDictionary(function (g) { return g.key; }, function (g) { return g.value; });
            Test_1.Test.isFalse(grouped.containsKey(0));
            Test_1.Test.isTrue(grouped.containsKey(1));
            Test_1.Test.isTrue(grouped.containsKey(2));
            Test_1.Test.isTrue(grouped.containsKey(3));
            Test_1.Test.isFalse(grouped.containsKey(4));
            Test_1.Test.isArrayEqual(grouped.get(1).toArray(), [people[4]]); // Juanito
            Test_1.Test.isArrayEqual(grouped.get(2).toArray(), [people[1], people[3]]); // Juanmari, Begoña
            Test_1.Test.isArrayEqual(grouped.get(3).toArray(), [people[0], people[2]]); // Ivan, Uxue
        });
        it("Grouping is correct (value selector)", function () {
            var people = [
                { id: 1, type: 3, name: "Ivan" },
                { id: 2, type: 2, name: "Juanmari" },
                { id: 3, type: 3, name: "Uxue" },
                { id: 4, type: 2, name: "Begoña" },
                { id: 5, type: 1, name: "Juanito" },
            ];
            var grouped = instancer(people)
                .groupBy(function (p) { return p.type; }, function (p) { return p.name; });
            Test_1.Test.isFalse(grouped.any(function (g) { return g.key === 0; }));
            Test_1.Test.isTrue(grouped.any(function (g) { return g.key === 1; }));
            Test_1.Test.isTrue(grouped.any(function (g) { return g.key === 2; }));
            Test_1.Test.isTrue(grouped.any(function (g) { return g.key === 3; }));
            Test_1.Test.isFalse(grouped.any(function (g) { return g.key === 4; }));
            Test_1.Test.isArrayEqual(grouped.single(function (g) { return g.key === 1; }).value.toArray(), ["Juanito"]);
            Test_1.Test.isArrayEqual(grouped.single(function (g) { return g.key === 2; }).value.toArray(), ["Juanmari", "Begoña"]);
            Test_1.Test.isArrayEqual(grouped.single(function (g) { return g.key === 3; }).value.toArray(), ["Ivan", "Uxue"]);
        });
    }
})(IQueryableUnitTest = exports.IQueryableUnitTest || (exports.IQueryableUnitTest = {}));

},{"../../src/Collections":1,"../../src/Enumerables":3,"../../src/Iterators":4,"../Test":6}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Test_1 = require("../Test");
var Iterators_1 = require("../../src/Iterators");
var Enumerables_1 = require("../../src/Enumerables");
var IteratorUnitTest;
(function (IteratorUnitTest) {
    function runTest(name, test) {
        describe(name + " (ArrayIterator)", function () { return test(function (e) { return new Iterators_1.ArrayIterator(e); }); });
        describe(name + " (Enumerable)", function () { return test(function (e) { return new Enumerables_1.Enumerable(new Iterators_1.ArrayIterator(e)); }); });
        describe(name + " (ConditionalEnumerable)", function () { return test(function (e) { return new Enumerables_1.ConditionalEnumerable(Enumerables_1.Enumerable.fromSource(e), function (x) { return true; }); }); });
        describe(name + " (ConcatEnumerable)", function () { return test(function (e) { return e.length > 1
            ? new Enumerables_1.ConcatEnumerable(Enumerables_1.Enumerable.fromSource([e[0]]), Enumerables_1.Enumerable.fromSource(e.slice(1)))
            : new Enumerables_1.ConcatEnumerable(Enumerables_1.Enumerable.fromSource(e), Enumerables_1.Enumerable.fromSource([])); }); });
        describe(name + " (OrderedEnumerable)", function () { return test(function (e) { return new Enumerables_1.OrderedEnumerable(Enumerables_1.Enumerable.fromSource(e), function (l, r) { return 0; }); }); });
        describe(name + " (RangeEnumerable)", function () { return test(function (e) { return new Enumerables_1.RangeEnumerable(Enumerables_1.Enumerable.fromSource(e), undefined, undefined); }); });
        describe(name + " (TransformEnumerable)", function () { return test(function (e) { return new Enumerables_1.TransformEnumerable(Enumerables_1.Enumerable.fromSource(e), function (x) { return x; }); }); });
        describe(name + " (ReverseEnumerable)", function () { return test(function (e) { return new Enumerables_1.ReverseEnumerable(new Enumerables_1.ReverseEnumerable(Enumerables_1.Enumerable.fromSource(e))); }); });
        describe(name + " (OrderedEnumerable)", function () { return test(function (e) { return new Enumerables_1.OrderedEnumerable(Enumerables_1.Enumerable.fromSource(e), function (x, y) { return 0; }); }); });
        describe(name + " (ArrayEnumerable)", function () { return test(function (e) { return new Enumerables_1.ArrayEnumerable(e); }); });
    }
    function run() {
        runTest("Next", next);
        runTest("Reset", reset);
        runTest("Value", value);
        runTest("Clone", clone);
    }
    IteratorUnitTest.run = run;
    function next(instancer) {
        it("Return false for empty collection", function () {
            var it = instancer([]);
            Test_1.Test.isFalse(it.next());
        });
        it("Iterate over elements + return false in the end", function () {
            var it = instancer([1, 2, 3]);
            Test_1.Test.isTrue(it.next()); // 1
            Test_1.Test.isTrue(it.next()); // 2
            Test_1.Test.isTrue(it.next()); // 3
            Test_1.Test.isFalse(it.next());
        });
    }
    function reset(instancer) {
        it("Iterator is resetted correctly", function () {
            var it = instancer([1, 2]);
            Test_1.Test.isTrue(it.next()); // 1
            Test_1.Test.isTrue(it.next()); // 2
            Test_1.Test.isFalse(it.next());
            it.reset();
            Test_1.Test.isTrue(it.next()); // 1
            Test_1.Test.isTrue(it.next()); // 2
            Test_1.Test.isFalse(it.next());
            it.reset();
            Test_1.Test.isTrue(it.next()); // 1
            it.reset();
            Test_1.Test.isTrue(it.next()); // 1
            Test_1.Test.isTrue(it.next()); // 2
            Test_1.Test.isFalse(it.next());
        });
        it("Multiple reset in a row act like single one", function () {
            var it = instancer([1, 2]);
            it.reset();
            it.reset();
            it.reset();
            Test_1.Test.isTrue(it.next()); // 1
            Test_1.Test.isTrue(it.next()); // 2
            Test_1.Test.isFalse(it.next());
            it.reset();
            it.reset();
            it.reset();
            Test_1.Test.isTrue(it.next()); // 1
            Test_1.Test.isTrue(it.next()); // 2
            Test_1.Test.isFalse(it.next());
            it.reset();
            it.reset();
            it.reset();
        });
    }
    function value(instancer) {
        it("Exception if getting an out of bounds value", function () {
            var it = instancer([]);
            Test_1.Test.isFalse(it.next());
            Test_1.Test.throwsException(function () { return it.value(); });
        });
        it("Get values", function () {
            var it = instancer([2, 4, 6]);
            Test_1.Test.isTrue(it.next());
            Test_1.Test.isEqual(it.value(), 2);
            Test_1.Test.isTrue(it.next());
            Test_1.Test.isEqual(it.value(), 4);
            Test_1.Test.isTrue(it.next());
            Test_1.Test.isEqual(it.value(), 6);
            Test_1.Test.isFalse(it.next());
        });
        it("Get values + exception in the end (out of bounds)", function () {
            var it = instancer([2, 4]);
            Test_1.Test.isTrue(it.next());
            Test_1.Test.isEqual(it.value(), 2);
            Test_1.Test.isTrue(it.next());
            Test_1.Test.isEqual(it.value(), 4);
            Test_1.Test.isFalse(it.next());
            Test_1.Test.throwsException(function () { return it.value(); });
        });
    }
    function clone(instancer) {
        it("Cloned iterator is resetted by default", function () {
            var original = instancer([2, 4, 6]);
            Test_1.Test.isTrue(original.next());
            Test_1.Test.isEqual(original.value(), 2);
            var clone = original.copy();
            Test_1.Test.isTrue(clone.next());
            Test_1.Test.isEqual(clone.value(), 2);
        });
        it("Cloned iterator doesn't affect original one", function () {
            var original = instancer([2, 4, 6]);
            Test_1.Test.isTrue(original.next());
            Test_1.Test.isEqual(original.value(), 2);
            var cloned = original.copy();
            cloned.next(); // 2
            cloned.next(); // 4
            Test_1.Test.isTrue(original.next());
            Test_1.Test.isEqual(original.value(), 4);
            cloned.reset();
            Test_1.Test.isTrue(original.next());
            Test_1.Test.isEqual(original.value(), 6);
            Test_1.Test.isFalse(original.next());
        });
        it("Cloned iterator is identical to original", function () {
            var original = instancer([2, 4, 6]);
            var cloned = original.copy();
            Test_1.Test.isTrue(original.next());
            Test_1.Test.isEqual(original.value(), 2);
            Test_1.Test.isTrue(cloned.next());
            Test_1.Test.isEqual(cloned.value(), 2);
            Test_1.Test.isTrue(original.next());
            Test_1.Test.isEqual(original.value(), 4);
            Test_1.Test.isTrue(cloned.next());
            Test_1.Test.isEqual(cloned.value(), 4);
            Test_1.Test.isTrue(original.next());
            Test_1.Test.isEqual(original.value(), 6);
            Test_1.Test.isTrue(cloned.next());
            Test_1.Test.isEqual(cloned.value(), 6);
            Test_1.Test.isFalse(original.next());
            Test_1.Test.isFalse(cloned.next());
        });
    }
})(IteratorUnitTest = exports.IteratorUnitTest || (exports.IteratorUnitTest = {}));

},{"../../src/Enumerables":3,"../../src/Iterators":4,"../Test":6}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Test_1 = require("./../Test");
var Collections_1 = require("./../../src/Collections");
var ListUnitTest;
(function (ListUnitTest) {
    function run() {
        describe("AsArray", asArray);
        describe("AsReadOnly", asReadOnly);
        describe("Copy", copy);
        describe("Clear", clear);
        describe("Get", get);
        describe("Push", push);
        describe("PushFront", pushFront);
        describe("PushRange", pushRange);
        describe("Pop", pop);
        describe("PopFront", popFront);
        describe("Remove", remove);
        describe("RemoveAt", removeAt);
        describe("Set", set);
        describe("IndexOf", indexOf);
        describe("Insert", insert);
    }
    ListUnitTest.run = run;
    function asArray() {
        it("Returns a reference, not a copy", function () {
            var array = [1, 2, 3];
            var list = new Collections_1.List(array);
            Test_1.Test.isArrayEqual(list.asArray(), array);
            array.push(245);
            Test_1.Test.isArrayEqual(list.asArray(), array);
        });
    }
    function asReadOnly() {
        it("Same object but different interface", function () {
            var list = new Collections_1.List(["hi", "yess"]);
            Test_1.Test.isEqual(list, list.asReadOnly());
        });
    }
    function copy() {
        it("Type is a List", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.isTrue(list instanceof Collections_1.List);
        });
        it("Returns a copy, not a reference", function () {
            var array = [1, 2, 3];
            var list = new Collections_1.List(array);
            var copy = list.copy();
            Test_1.Test.isArrayEqual(list.asArray(), copy.asArray());
            list.asArray().push(245);
            Test_1.Test.isArrayNotEqual(list.asArray(), copy.asArray());
            Test_1.Test.isArrayEqual(list.asArray(), [1, 2, 3, 245]);
            Test_1.Test.isArrayEqual(copy.asArray(), [1, 2, 3]);
        });
    }
    function clear() {
        it("Does nothing on empty list", function () {
            var list = new Collections_1.List();
            Test_1.Test.isArrayEqual(list.asArray(), []);
            list.clear();
            Test_1.Test.isArrayEqual(list.asArray(), []);
            list.clear();
            Test_1.Test.isArrayEqual(list.asArray(), []);
        });
        it("List is cleared", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.isArrayEqual(list.asArray(), [1, 2, 3]);
            list.clear();
            Test_1.Test.isArrayEqual(list.asArray(), []);
        });
    }
    function get() {
        it("Value is correct", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.isEqual(list.get(0), 1);
            Test_1.Test.isEqual(list.get(1), 2);
            Test_1.Test.isEqual(list.get(2), 3);
        });
        it("Undefined if invalid index", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.isEqual(list.get(-999), undefined);
            Test_1.Test.isEqual(list.get(-1), undefined);
            Test_1.Test.isEqual(list.get(3), undefined);
            Test_1.Test.isEqual(list.get(999), undefined);
        });
    }
    function push() {
        it("Adds element in back of the list", function () {
            var list = new Collections_1.List();
            list.push(2);
            Test_1.Test.isArrayEqual(list.asArray(), [2]);
            list.push(22);
            Test_1.Test.isArrayEqual(list.asArray(), [2, 22]);
            list.push(1);
            Test_1.Test.isArrayEqual(list.asArray(), [2, 22, 1]);
            list.push(4);
            Test_1.Test.isArrayEqual(list.asArray(), [2, 22, 1, 4]);
        });
    }
    function pushFront() {
        it("Adds element in front of the list", function () {
            var list = new Collections_1.List();
            list.pushFront(2);
            Test_1.Test.isArrayEqual(list.asArray(), [2]);
            list.pushFront(22);
            Test_1.Test.isArrayEqual(list.asArray(), [22, 2]);
            list.pushFront(1);
            Test_1.Test.isArrayEqual(list.asArray(), [1, 22, 2]);
            list.pushFront(4);
            Test_1.Test.isArrayEqual(list.asArray(), [4, 1, 22, 2]);
        });
    }
    function pushRange() {
        it("Empty range doesn't modify the original (array)", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.isEqual(list.pushRange([]), 3);
            Test_1.Test.isArrayEqual(list.asArray(), [1, 2, 3]);
        });
        it("Empty range doesn't modify the original (IQueryable)", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.isEqual(list.pushRange(new Collections_1.List()), 3);
            Test_1.Test.isArrayEqual(list.asArray(), [1, 2, 3]);
        });
        it("Value is correct (array)", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.isEqual(list.pushRange([22]), 4);
            Test_1.Test.isArrayEqual(list.asArray(), [1, 2, 3, 22]);
            Test_1.Test.isEqual(list.pushRange([24, 67]), 6);
            Test_1.Test.isArrayEqual(list.asArray(), [1, 2, 3, 22, 24, 67]);
        });
        it("Value is correct (IQueryable)", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.isEqual(list.pushRange(new Collections_1.List([22])), 4);
            Test_1.Test.isArrayEqual(list.asArray(), [1, 2, 3, 22]);
            Test_1.Test.isEqual(list.pushRange(new Collections_1.List([24, 67])), 6);
            Test_1.Test.isArrayEqual(list.asArray(), [1, 2, 3, 22, 24, 67]);
        });
    }
    function pop() {
        it("Removes and returns the element in back of the list", function () {
            var list = new Collections_1.List([1, 2, 3]);
            var element = list.pop();
            Test_1.Test.isEqual(element, 3);
            Test_1.Test.isArrayEqual(list.asArray(), [1, 2]);
            element = list.pop();
            Test_1.Test.isEqual(element, 2);
            Test_1.Test.isArrayEqual(list.asArray(), [1]);
            element = list.pop();
            Test_1.Test.isEqual(element, 1);
            Test_1.Test.isArrayEqual(list.asArray(), []);
        });
        it("Returns undefined in empty list", function () {
            var list = new Collections_1.List();
            var element = list.pop();
            Test_1.Test.isEqual(element, undefined);
            Test_1.Test.isArrayEqual(list.asArray(), []);
        });
    }
    function popFront() {
        it("Removes and returns the element in back of the list", function () {
            var list = new Collections_1.List([1, 2, 3]);
            var element = list.popFront();
            Test_1.Test.isEqual(element, 1);
            Test_1.Test.isArrayEqual(list.asArray(), [2, 3]);
            element = list.popFront();
            Test_1.Test.isEqual(element, 2);
            Test_1.Test.isArrayEqual(list.asArray(), [3]);
            element = list.popFront();
            Test_1.Test.isEqual(element, 3);
            Test_1.Test.isArrayEqual(list.asArray(), []);
        });
        it("Returns undefined in empty list", function () {
            var list = new Collections_1.List();
            var element = list.popFront();
            Test_1.Test.isEqual(element, undefined);
            Test_1.Test.isArrayEqual(list.asArray(), []);
        });
    }
    function remove() {
        it("Does nothing on empty list", function () {
            var list = new Collections_1.List();
            list.remove(6);
            list.remove(-6);
            Test_1.Test.isArrayEqual(list.asArray(), []);
        });
        it("Remove single element", function () {
            var list = new Collections_1.List([2, 3, 4, 5]);
            list.remove(3);
            Test_1.Test.isArrayEqual(list.asArray(), [2, 4, 5]);
            list.remove(6);
            Test_1.Test.isArrayEqual(list.asArray(), [2, 4, 5]);
            list.remove(4);
            Test_1.Test.isArrayEqual(list.asArray(), [2, 5]);
            list.remove(2);
            Test_1.Test.isArrayEqual(list.asArray(), [5]);
            list.remove(5);
            Test_1.Test.isArrayEqual(list.asArray(), []);
        });
        it("Remove element multiple times", function () {
            var list = new Collections_1.List([1, 1, 2, 3, 2, 5, 6, 6]);
            list.remove(1);
            Test_1.Test.isArrayEqual(list.asArray(), [2, 3, 2, 5, 6, 6]);
            list.remove(2);
            Test_1.Test.isArrayEqual(list.asArray(), [3, 5, 6, 6]);
            list.remove(6);
            Test_1.Test.isArrayEqual(list.asArray(), [3, 5]);
        });
    }
    function removeAt() {
        it("Exception if negative index", function () {
            var list = new Collections_1.List([6, 6, 6]);
            Test_1.Test.throwsException(function () { return list.removeAt(-1); });
            Test_1.Test.throwsException(function () { return list.removeAt(-50); });
            Test_1.Test.throwsException(function () { return list.removeAt(-9999); });
        });
        it("Exception if invalid index", function () {
            var list = new Collections_1.List([6, 6, 6]);
            Test_1.Test.throwsException(function () { return list.removeAt(3); });
            Test_1.Test.throwsException(function () { return list.removeAt(50); });
            Test_1.Test.throwsException(function () { return list.removeAt(9999); });
        });
        it("Deletes element by index", function () {
            var list = new Collections_1.List([2, 3, 4, 5]);
            list.removeAt(3);
            Test_1.Test.isArrayEqual(list.asArray(), [2, 3, 4]);
            list.removeAt(0);
            Test_1.Test.isArrayEqual(list.asArray(), [3, 4]);
            list.removeAt(1);
            Test_1.Test.isArrayEqual(list.asArray(), [3]);
            list.removeAt(0);
            Test_1.Test.isArrayEqual(list.asArray(), []);
        });
    }
    function set() {
        it("Exception if negative index", function () {
            var list = new Collections_1.List([6, 6, 6]);
            Test_1.Test.throwsException(function () { return list.set(-1, 666); });
            Test_1.Test.throwsException(function () { return list.set(-50, 666); });
            Test_1.Test.throwsException(function () { return list.set(-9999, 666); });
        });
        it("Initializes list if empty", function () {
            var list = new Collections_1.List();
            list.set(0, 33);
            Test_1.Test.isArrayEqual(list.asArray(), [33]);
        });
        it("Sets the correct index", function () {
            var list = new Collections_1.List([2, 4, 6, 8, 7]);
            list.set(0, 33);
            Test_1.Test.isArrayEqual(list.asArray(), [33, 4, 6, 8, 7]);
            list.set(3, 22);
            Test_1.Test.isArrayEqual(list.asArray(), [33, 4, 6, 22, 7]);
        });
        it("Resizes list if necessary", function () {
            var list = new Collections_1.List([2, 4, 6, 8, 7]);
            list.set(7, 33);
            Test_1.Test.isArrayEqual(list.asArray(), [2, 4, 6, 8, 7, undefined, undefined, 33]);
        });
    }
    function indexOf() {
        it("-1 in empty list", function () {
            var list = new Collections_1.List();
            Test_1.Test.isEqual(list.indexOf(666), -1);
            Test_1.Test.isEqual(list.indexOf(0), -1);
            Test_1.Test.isEqual(list.indexOf(-666), -1);
        });
        it("-1 if element not found", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.isEqual(list.indexOf(-999), -1);
            Test_1.Test.isEqual(list.indexOf(-1), -1);
            Test_1.Test.isEqual(list.indexOf(4), -1);
            Test_1.Test.isEqual(list.indexOf(999), -1);
        });
        it("Value is correct", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.isEqual(list.indexOf(2), 1);
            Test_1.Test.isEqual(list.indexOf(1), 0);
            Test_1.Test.isEqual(list.indexOf(3), 2);
        });
    }
    function insert() {
        it("Throws exception if index < 0", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.throwsException(function () { return list.insert(-3, 55); });
        });
        it("Throws exception if index > length", function () {
            var list = new Collections_1.List([1, 2, 3]);
            Test_1.Test.throwsException(function () { return list.insert(4, 55); });
        });
        it("Initializes empty list", function () {
            var list = new Collections_1.List();
            list.insert(0, 4);
            Test_1.Test.isArrayEqual(list.asArray(), [4]);
        });
        it("Moves other elements to fit the new one", function () {
            var list = new Collections_1.List([1, 2, 3]);
            list.insert(1, 55);
            Test_1.Test.isArrayEqual(list.asArray(), [1, 55, 2, 3]);
        });
    }
})(ListUnitTest = exports.ListUnitTest || (exports.ListUnitTest = {}));

},{"./../../src/Collections":1,"./../Test":6}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Test_1 = require("./../Test");
var Collections_1 = require("./../../src/Collections");
var StackUnitTest;
(function (StackUnitTest) {
    function run() {
        describe("Copy", copy);
        describe("Clear", clear);
        describe("Peek", peek);
        describe("Push", push);
        describe("Pop", pop);
    }
    StackUnitTest.run = run;
    function copy() {
        it("Type is a Stack", function () {
            var list = new Collections_1.Stack([1, 2, 3]);
            Test_1.Test.isTrue(list instanceof Collections_1.Stack);
        });
        it("Returns a copy, not a reference", function () {
            var array = [1, 2, 3];
            var stack = new Collections_1.Stack(array);
            var copy = stack.copy();
            Test_1.Test.isArrayEqual(stack.asArray(), copy.asArray());
            stack.asArray().push(245);
            Test_1.Test.isArrayNotEqual(stack.asArray(), copy.asArray());
            Test_1.Test.isArrayEqual(stack.asArray(), [1, 2, 3, 245]);
            Test_1.Test.isArrayEqual(copy.asArray(), [1, 2, 3]);
        });
    }
    function clear() {
        it("Does nothing on empty stack", function () {
            var stack = new Collections_1.Stack();
            Test_1.Test.isArrayEqual(stack.asArray(), []);
            stack.clear();
            Test_1.Test.isArrayEqual(stack.asArray(), []);
            stack.clear();
            Test_1.Test.isArrayEqual(stack.asArray(), []);
        });
        it("Stack is cleared", function () {
            var stack = new Collections_1.Stack([1, 2, 3]);
            Test_1.Test.isArrayEqual(stack.asArray(), [1, 2, 3]);
            stack.clear();
            Test_1.Test.isArrayEqual(stack.asArray(), []);
        });
    }
    function peek() {
        it("Returns the element in back of the stack", function () {
            var stack = new Collections_1.Stack([1, 2, 3]);
            var element = stack.peek();
            Test_1.Test.isEqual(element, 3);
            Test_1.Test.isArrayEqual(stack.asArray(), [1, 2, 3]);
            stack.pop();
            element = stack.peek();
            Test_1.Test.isEqual(element, 2);
            Test_1.Test.isArrayEqual(stack.asArray(), [1, 2]);
            element = stack.peek();
            Test_1.Test.isEqual(element, 2);
            Test_1.Test.isArrayEqual(stack.asArray(), [1, 2]);
            stack.pop();
            element = stack.peek();
            Test_1.Test.isEqual(element, 1);
            Test_1.Test.isArrayEqual(stack.asArray(), [1]);
        });
        it("Returns undefined in empty stack", function () {
            var stack = new Collections_1.Stack();
            var element = stack.peek();
            Test_1.Test.isEqual(element, undefined);
            Test_1.Test.isArrayEqual(stack.asArray(), []);
        });
    }
    function push() {
        it("Adds element in back of the stack", function () {
            var stack = new Collections_1.Stack();
            stack.push(2);
            Test_1.Test.isArrayEqual(stack.asArray(), [2]);
            stack.push(22);
            Test_1.Test.isArrayEqual(stack.asArray(), [2, 22]);
            stack.push(1);
            Test_1.Test.isArrayEqual(stack.asArray(), [2, 22, 1]);
            stack.push(4);
            Test_1.Test.isArrayEqual(stack.asArray(), [2, 22, 1, 4]);
        });
    }
    function pop() {
        it("Removes and returns the element in back of the stack", function () {
            var stack = new Collections_1.Stack([1, 2, 3]);
            var element = stack.pop();
            Test_1.Test.isEqual(element, 3);
            Test_1.Test.isArrayEqual(stack.asArray(), [1, 2]);
            element = stack.pop();
            Test_1.Test.isEqual(element, 2);
            Test_1.Test.isArrayEqual(stack.asArray(), [1]);
            element = stack.pop();
            Test_1.Test.isEqual(element, 1);
            Test_1.Test.isArrayEqual(stack.asArray(), []);
        });
        it("Returns undefined in empty stack", function () {
            var stack = new Collections_1.Stack();
            var element = stack.pop();
            Test_1.Test.isEqual(element, undefined);
            Test_1.Test.isArrayEqual(stack.asArray(), []);
        });
    }
})(StackUnitTest = exports.StackUnitTest || (exports.StackUnitTest = {}));

},{"./../../src/Collections":1,"./../Test":6}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils_1 = require("../../src/Utils");
var Test_1 = require("./../Test");
var UtilsUnitTest;
(function (UtilsUnitTest) {
    function run() {
        describe("Constructor", constructor);
        describe("Value", value);
        describe("Invalidate", invalidate);
    }
    UtilsUnitTest.run = run;
    function constructor() {
        it("Starts invalidated", function () {
            var c = new Utils_1.Cached();
            Test_1.Test.isFalse(c.isValid());
        });
    }
    function value() {
        it("Throws exception if invalid", function () {
            var c = new Utils_1.Cached();
            Test_1.Test.isFalse(c.isValid());
            Test_1.Test.throwsException(function () { var x = c.value; });
        });
        it("Validate on value set", function () {
            var c = new Utils_1.Cached();
            Test_1.Test.isFalse(c.isValid());
            c.value = 33;
            Test_1.Test.isTrue(c.isValid());
        });
        it("Get value", function () {
            var c = new Utils_1.Cached();
            c.value = 33;
            Test_1.Test.isEqual(c.value, 33);
        });
    }
    function invalidate() {
        it("Do nothing if already invalid", function () {
            var c = new Utils_1.Cached();
            Test_1.Test.isFalse(c.isValid());
            c.invalidate();
            c.invalidate();
            c.invalidate();
            Test_1.Test.isFalse(c.isValid());
        });
        it("Make invalid if it was valid", function () {
            var c = new Utils_1.Cached();
            Test_1.Test.isFalse(c.isValid());
            c.value = 33;
            Test_1.Test.isTrue(c.isValid());
            c.invalidate();
            Test_1.Test.isFalse(c.isValid());
        });
    }
})(UtilsUnitTest = exports.UtilsUnitTest || (exports.UtilsUnitTest = {}));

},{"../../src/Utils":5,"./../Test":6}]},{},[7]);
