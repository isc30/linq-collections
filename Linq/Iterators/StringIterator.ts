"use strict";

namespace Linq
{
    export class StringIterator implements IIterator<string>
    {
        private readonly _source: string;
        private _currentValue: string;
        private _currentSource: string;

        public constructor(source: string)
        {
            this._source = source;

            this.reset();
        }

        public clone(): IIterator<string>
        {
            return new StringIterator(this._source);
        }

        public reset(): void
        {
            this._currentSource = this._source;
            this._currentValue = "";
        }

        public next(): boolean
        {
            this._currentValue = this._currentSource.charAt(0);
            this._currentSource = this._currentSource.substring(1);

            return this._currentValue !== "";
        }

        public value(): string
        {
            if (this._currentValue === "")
            {
                throw new Error("Out of bounds");
            }

            return this._currentValue;
        }
    }
}