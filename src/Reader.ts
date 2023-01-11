import { AbortablePromise } from "./AbortablePromise";

export type ReaderFetch<TReturn, TParam> = (param: TParam) => Promise<TReturn>;

/**
 *  A Reader is a special object that allows reading from an async source
 *  and then present the data in a sync way. This approach is more suitable
 *  in react code than dealing with promises and async code in general.
 */
export class Reader<TReturn, TParam = void> {
 
    private _result: TReturn | undefined = undefined;
    private _promise: AbortablePromise<TReturn> | undefined;
    private _fetch: ReaderFetch<TReturn, TParam>;
    private _param: TParam | undefined = undefined;
    private _error: any;

    get error() : any { return this._error; }

    constructor(fetch: ReaderFetch<TReturn, TParam>) {
        this._fetch = fetch;
    }

    /**
     *  Read the data.
     */
    read(param: TParam) : TReturn {

        if (this._result === undefined) {

            this._promise = this.start(param);
            this._promise.then(result => {
                this._result = result;
            }, (reason: any) => {
                this._error = reason;
            });

            throw this._promise;
        }

        return this._result;
    }

    /**
     *  Start reading the data.
     */
    start(param: TParam) : AbortablePromise<TReturn> {

        if (!this._promise) this._promise = new AbortablePromise(this._fetch(param));
        return this._promise;
    }

    /**
     *  Reset the reader. 
     */
    reset() {

        if (this._promise) this._promise.abort();
        this._promise = undefined;
        this._error = undefined;
        this._param = undefined;
    }

    /**
     *  Reload the reader.
     */
    reload(param: TParam) : Promise<TReturn> {

        this.reset();
        return this.start(param);
    }
};