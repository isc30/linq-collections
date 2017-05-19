"use strict";

namespace Linq
{
    export class Cached<T>
    {
        private _isValid: boolean;
        private _value: T;

        public constructor()
        {
            this._isValid = false;
        }

        public invalidate(): void
        {
            this._isValid = false;
        }

        public isValid(): boolean
        {
            return this._isValid;
        }

        public getValue(): T
        {
            if (!this._isValid)
            {
                throw new Error("Trying to get value of invalid cache");
            }

            return this._value;
        }

        public setValue(value: T): void
        {
            this._value = value;
            this._isValid = true;
        }
    }
}