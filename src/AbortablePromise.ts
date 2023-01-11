/**
 *  This is a special variation on a promise that allows for aborting
 *  the promies and not handling the whatever result is coming from it.
 */
export class AbortablePromise<TResult> implements Promise<TResult> {

    private _aborted: boolean = false;

    private _promise: Promise<TResult>;

    get [Symbol.toStringTag](): string { return 'AbortablePromise'; }

    constructor (promise: Promise<TResult>) {
        this._promise = promise;
    }

    then<TResult1 = TResult, TResult2 = never>(onfulfilled?: ((value: TResult) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): AbortablePromise<TResult1 | TResult2> {
        return new AbortablePromise<TResult>(new Promise((resolve: any, reject: any) => {
            this._promise.then(result => {
                if (!this._aborted) resolve(result);
            }, reason => {
                if (!this._aborted) reject(reason);
            });
        })).then(onfulfilled, onrejected);
    }

    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined): Promise<TResult | TResult> {    
        return this.then(undefined, onrejected);
    }

    finally(onfinally?: (() => void) | null | undefined): Promise<TResult> {
        return this.then(result => {
            onfinally?.();
            return result;
        }, reason => {
            onfinally?.();
            throw reason;
        });
    }

    abort() {
        this._aborted = true;
    }
};