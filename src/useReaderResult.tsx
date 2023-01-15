import {  useState } from "react";
import { Reader } from "./Reader";
import { useEventCallback } from "./useEventCallback";

/**
 *  A hook that allows waiting for reader data and using it directly.
 */
function useReaderResult<TResult>(reader: Reader<TResult, void>) : TResult;
function useReaderResult<TResult, TParam>(reader: Reader<TResult, TParam>, param: TParam) : TResult;
function useReaderResult<TResult, TParam = any>(reader: Reader<TResult, any>, param?: any) : TResult | undefined {

    const initialData = reader.read(param);

    const [ result, setResult ] = useState(initialData);

    useEventCallback(reader, 'done', () => {

        // we cast it cause we know that after the done callback is called we can
        // only have actual result.
        setResult(reader.result as TResult);
    });

    return result;
};

export { useReaderResult };