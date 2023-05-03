import { Emitter } from "@pawel-kuznik/iventy";

/**
 *  This is a class that can be used in a reader to provide a constant stream of
 *  data or updates for given set of paramerts.
 */
export abstract class ReaderStream<TReturn, TParams = void> extends Emitter {

    /**
     *  An abstract method to fetch the return of specific data depending
     *  on fiven params. 
     */
    abstract fetch(params: TParams) : Promise<TReturn>;

    /**
     *  A method to tell the reader that data updated on given params.
     */
    update(result: TReturn, params: TParams) {

        this.trigger('update', { result, params });
    }
};
