import { Reader } from "./Reader";
import { useReaderReset } from "./useReaderReset";
import { useReaderResult } from "./useReaderResult";

export interface UseRenderReturn<TResult> {
    result: TResult;
    reset: () => void;
};


/**
 *  This is a hook that bind the reader to the lifecycle of the hook holder 
 *  and exposes helper functions and result of the reading to the hook holder.
 */
function useReader<TResult>(reader: Reader<TResult, void>) : UseRenderReturn<TResult> ;
function useReader<TResult, TParam>(reader: Reader<TResult, TParam>, param: TParam) : UseRenderReturn<TResult> ;
function useReader<TResult, TParam = any>(reader: Reader<TResult, any>, param?: any) : UseRenderReturn<TResult> {

    const result = useReaderResult(reader, param);
    const reset = useReaderReset(reader);

    return {
        result,
        reset
    };
};

export { useReader };
