import { AbortablePromise } from "@pawel-kuznik/blindsight";
import { Emitter, EmitterLike, EventHandler, Signal } from "@pawel-kuznik/iventy";
import { EventHandlerUninstaller } from "@pawel-kuznik/iventy/build/lib/Channel";

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

    /**
     *  A signal that can be passed to the reader that will internally force
     *  the reader to reload when the signal activates. 
     */
    reloadSignal?: Signal<TParam>;
};

/**
 *  An internal reader settings that require all options.
 */
interface ReaderSettings<TParam> {
    paramsComparator: (paramA: TParam, paramB: TParam) => boolean;
    reloadSignal?: Signal<TParam>;
};

/**
 *  A Reader is a special object that allows reading from an async source
 *  and then present the data in a sync way. This approach is more suitable
 *  in react code than dealing with promises and async code in general.
 * 
 *  This class, in addition to providing data, also emits events for when
 *  the reader enters particular phases:
 * 
 *  @event start    - this event triggers when reader starts loading data
 *  @event done     - this event triggers when reader loads data without an error.
 *  @event error    - this event triggers when reader receives and error from 
 *                  the fetch function.
 *  @event reset    - this event triggers when reader resets its internal state.
 */
export class Reader<TReturn, TParam = void> implements EmitterLike {

    private _emitter: Emitter = new Emitter();
 
    private _result: TReturn | undefined = undefined;
    private _promise: AbortablePromise<TReturn> | undefined;
    private _fetch: ReaderFetch<TReturn, TParam>;
    private _param: TParam | undefined = undefined;
    private _error: any;

    private _settings: ReaderSettings<TParam>;

    private _reloadUninstaller: () => void = () => { };

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

        if (this._settings.reloadSignal) {
            this._reloadUninstaller = this._settings.reloadSignal.observe(params => {
                this.reload(params);
            });
        }
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

            this._emitter.trigger('start');

            this._param = param;

            this._promise = this.wrapPromise(this._fetch(param));
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

        this._emitter.trigger('reset');
    }

    /**
     *  Reload the reader. Similar to `.start()` method, this method returns a promise
     *  that resolves when the reload process is done (either resolves or rejects);
     */
    reload(param: TParam) : Promise<TReturn|undefined> {

        this.reset();
        return this.start(param);
    }

    /**
     *  Dispose the resources reader allocated.
     */
    dispose() {

        if (this._promise) this._promise.abort();
        this._promise = undefined;
        this._error = undefined;
        this._param = undefined;
        this._result = undefined;

        this._reloadUninstaller();
    }

    private wrapPromise(promise: Promise<TReturn>) : AbortablePromise<TReturn> {

        return new AbortablePromise(promise.then(result => {
            this._result = result;
            this._emitter.trigger('done');
            return result;
        }, reason => {
            this._error = reason;
            this._emitter.trigger('error');
            throw reason;
        }));
    }

    
    // Methods required by EmitterLike interface

    handle(name: string, callback: EventHandler): EventHandlerUninstaller {
        return this._emitter.handle(name, callback);
    }
    on(name: string, callback: EventHandler): EmitterLike {
        this._emitter.on(name, callback);
        return this;
    }
    off(name: string, callback: EventHandler | null): EmitterLike {
        this._emitter.off(name, callback);
        return this;
    }
};