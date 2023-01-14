import { AbortablePromise } from "@pawel-kuznik/blindsight";

export type ReaderFetch<TReturn, TParam> = (param: TParam) => Promise<TReturn>;

export interface ReaderOptions<TParam> {

    /**
     *  A function that allows to compare two parameters when the read happens.
     *  By default the Reader will use `Object.is()`, as it's a also the default
     *  way to compare parameters in React.
     * 
     *  true - means both params are considered equal.
     *  false - means params are different.
     */
    paramsComparator?: (paramA: TParam, paramB: TParam) => boolean;
};

/**
 *  An internal reader settings that require all options.
 */
interface ReaderSettings<TParam> {
    paramsComparator: (paramA: TParam, paramB: TParam) => boolean;
};

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

    private _settings: ReaderSettings<TParam>;

    get result() : TReturn|undefined { return this._result; }
    get error() : any { return this._error; }

    constructor(fetch: ReaderFetch<TReturn, TParam>, options: ReaderOptions<TParam> = { }) {

        this._settings = {
            // set default settings
            paramsComparator: Object.is,

            // and override some of the settings with options
            ...options
        };

        this._fetch = fetch;
    }

    /**
     *  Read the data.
     */
    read(param: TParam) : TReturn {

        this.start(param);

        if (this._result === undefined) throw this._promise?.then();

        return this._result;
    }

    /**
     *  Start reading the data. The method returns a promise that resolves
     *  when the reading process is done (either resolves or rejects).
     */
    start(param: TParam) : Promise<TReturn|undefined> {

        if (!this._promise || (param !== this._param && this._param === undefined) || (this._param !== undefined && !this._settings.paramsComparator(param, this._param))) {

            // if we need to redo the read we need to reset the whole object as we will have different data.
            this.reset();

            this._param = param;

            this._promise = new AbortablePromise(this._fetch(param).then(result => {
                this._result = result;
                return result;
            }, reason => {
                this._error = reason;
                throw reason;
            }));
        }

        return this._promise.then(undefined, () => { return undefined; });
    }

    /**
     *  Reset the reader. 
     */
    reset() {

        if (this._promise) this._promise.abort();
        this._promise = undefined;
        this._error = undefined;
        this._param = undefined;
        this._result = undefined;
    }

    /**
     *  Reload the reader. Similar to `.start()` method, this method returns a promise
     *  that resolves when the reload process is done (either resolves or rejects);
     */
    reload(param: TParam) : Promise<TReturn|undefined> {

        this.reset();
        return this.start(param);
    }
};