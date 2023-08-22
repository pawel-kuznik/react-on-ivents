/**
 *  This is a somewhat silly mechanism to create a sync lock that
 *  can be used to interface a callback async API with a promise-based
 *  syspense API within react code. It's silly, but it's one of those
 *  things that you do when programming with react.
 */
export class SuspenseLock {

    private _promise: Promise<any>;
    private _trigger: (r: any) => void;

    get trigger() : () => void { return () => this._trigger; }
    get suspensePromise() : Promise<any> { return this._promise; }

    constructor() {
        this._trigger = () => { };
        this._promise = new Promise(r => {
            this._trigger = r;
        });
    }
};