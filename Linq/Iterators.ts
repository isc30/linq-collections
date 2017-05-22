export interface IIterator<TElement>
{
    clone(): IIterator<TElement>;
    reset(): void;
    next(): boolean;
    value(): TElement;
}

export class ArrayIterator<TElement> implements IIterator<TElement>
{
    protected readonly source: TElement[];
    private _index: number;

    public constructor(source: TElement[])
    {
        this.source = source;

        this.reset();
    }

    public clone(): IIterator<TElement>
    {
        return new ArrayIterator<TElement>(this.source);
    }

    public reset(): void
    {
        this._index = -1;
    }

    private isValidIndex(): boolean
    {
        return this._index >= 0 && this._index < this.source.length;
    }

    public next(): boolean
    {
        ++this._index;

        return this.isValidIndex();
    }

    public value(): TElement
    {
        if (!this.isValidIndex())
        {
            throw new Error("Out of bounds");
        }

        return this.source[this._index];
    }
}

export class StringIterator implements IIterator<string>
{
    protected readonly source: string;
    private _currentValue: string;
    private _currentSource: string;

    public constructor(source: string)
    {
        this.source = source;

        this.reset();
    }

    public clone(): IIterator<string>
    {
        return new StringIterator(this.source);
    }

    public reset(): void
    {
        this._currentSource = this.source;
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

export class CombinedIterator<TElement> implements IIterator<TElement>
{
    private readonly _first: IIterator<TElement>;
    private readonly _second: IIterator<TElement>;
    private _isFirstFinished: boolean;

    public constructor(first: IIterator<TElement>, second: IIterator<TElement>)
    {
        this._first = first;
        this._second = second;
        this._isFirstFinished = false;

        this.reset();
    }

    public clone(): IIterator<TElement>
    {
        return new CombinedIterator<TElement>(this._first.clone(), this._second.clone());
    }

    public reset(): void
    {
        this._first.reset();
        this._second.reset();
        this._isFirstFinished = false;
    }

    public next(): boolean
    {
        const hasValue = !this._isFirstFinished
            ? this._first.next()
            : this._second.next();

        if (!hasValue && !this._isFirstFinished)
        {
            this._isFirstFinished = true;

            return this.next();
        }

        return hasValue;
    }

    public value(): TElement
    {
        return !this._isFirstFinished
            ? this._first.value()
            : this._second.value();
    }
}
