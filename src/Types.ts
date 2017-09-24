/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/

export type Primitive = number | string | boolean;
export type Selector<TElement, TOut> = (element: TElement) => TOut;
export type Predicate<TElement> = Selector<TElement, boolean>;
export type Aggregator<TElement, TValue> = (previous: TValue, current: TElement) => TValue;
export type Action<TElement> = (element: TElement, index: number) => void;
