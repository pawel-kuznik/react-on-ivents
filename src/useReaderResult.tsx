import {  startTransition, useState } from "react";
import { Reader } from "./Reader";
import { useEventCallback } from "./useEventCallback";

/**
 *  A hook that allows waiting for reader data and using it directly.
 *  The hook will force a component reload every time the result changes.
 *  However, the hook will not force reload when the reader enters
 *  a loading state after first successful render.
 */
function useReaderResult<TResult>(reader: Reader<TResult, void>) : TResult;
function useReaderResult<TResult, TParam>(reader: Reader<TResult, TParam>, param: TParam) : TResult;
function useReaderResult<TResult, TParam = any>(reader: Reader<TResult, any>, param?: TParam) : TResult | undefined {

    const initialData = reader.read(param);

    const [ result, setResult ] = useState(initialData);

    useEventCallback(reader, 'done', () => {

        startTransition(() => {
            // we cast it cause we know that after the done callback is called we can
            // only have actual result.
            setResult(reader.result as TResult);
        });
    });

    return result;
};

export { useReaderResult };