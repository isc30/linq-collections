/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2019 Ivan Sanz Carasa. All rights reserved.
 */

// tslint:disable-next-line:no-any
export type Dynamic = any;
export type Indexer = number | string;
export type Primitive = number | string | boolean;
export type Selector<TIn, TOut> = (element: TIn) => TOut;
export type Predicate<T> = Selector<T, boolean>;
export type Action<T> = (element: T, index: number) => void;
