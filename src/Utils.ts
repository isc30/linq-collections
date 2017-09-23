/*
 * Created by Ivan Sanz (@isc30)
 * Copyright © 2017 Ivan Sanz Carasa. All rights reserved.
*/

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

    public get value(): T
    {
        if (!this._isValid)
        {
            throw new Error("Trying to get value of invalid cache");
        }

        return this._value;
    }

    public set value(value: T)
    {
        this._value = value;
        this._isValid = true;
    }
}
