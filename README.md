[![npm version](https://img.shields.io/npm/v/linq-collections.svg)](https://npmjs.org/package/linq-collections)
[![npm downloads](https://img.shields.io/npm/dt/linq-collections.svg)](https://npmjs.org/package/linq-collections)
[![package dependencies](https://img.shields.io/david/isc30/linq-collections.svg)](https://npmjs.org/package/linq-collections)
[![build status](https://travis-ci.org/isc30/linq-collections.svg?branch=master)](https://travis-ci.org/isc30/linq-collections)
[![coverage](https://coveralls.io/repos/github/isc30/linq-collections/badge.svg?branch=master)](https://coveralls.io/github/isc30/linq-collections?branch=master)
<!-- [![package dev-dependencies](https://img.shields.io/david/dev/isc30/linq-collections.svg)](https://npmjs.org/package/linq-collections) -->

Strongly typed *Linq* implementation for *Javascript* and *TypeScript* (*ECMAScript 5*)<br />
Includes collections: List, Dictionary, ...

## Intellisense friendly
Every single method has **complete** type definitions available.<br />
If you use TypeScript, its purely is based in **generics**.<br /><br />
[Insert motivational GIF with intellisense in action]

## Browser compatibility: ~100%
Using **ECMAScript 5**, it has **~100% compatibility** with nodejs and all browsers (22/09/2017)<br /><br />
![compatibility](https://raw.githubusercontent.com/isc30/linq-collections/master/assets/compatibility.jpg)

## Performance
*Linq-Collections* uses custom **iterators** and **deferred execution** mechanisms that ensure **BLAZING FAST** operations, outperforming any other popular library. Its also optimized to work with **minimal CPU and RAM usage**.

## Why use it?
If previous reasons aren't enought, here are few more:
- **Javascript && TypeScript compatible** - You can use it with JS or TypeScript (contains .d.ts definitions)
- **No dependencies** - Pure and lightweight
- **100% browser/nodejs support** - Stop caring about compatibility, it works everywhere!
- **Strongly typed** - Developed in TypeScript, it uses no 'any' or dirty code. Everything is based in generics and strongly typed
- **Best performance** - Deferred execution with custom iterators make the difference. Currently the fastest library.
- **Works out of the box** - *'npm install linq-collections'* is the hardest thing you'll need to do
- **Collections** - Including many type of collections (list, dictionary, ...) with linq integrated inside. As in C#
- **Strict standard** - Strictly implementing [microsoft's official linq definition](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/classification-of-standard-query-operators-by-manner-of-execution) (you can check it for exceptions, behavior, etc)
- **Deeply tested** - Each new version is passing tons of quality tests before being released

## Using the package
Interfaces for this library are already designed. New versions won't break any old code.
We strongly recommend using `*` for version selector
```json
dependencies {
    "linq-collections": "*"
}
```

## How to run tests
This library uses `mocha` with custom assertion helper for testing.<br />
Use `nyc mocha` to run the tests and coverage.

## Under active development
This project is activelly being developed and improved by Ivan Sanz (isc30)<br />
https://github.com/isc30/linq-collections
