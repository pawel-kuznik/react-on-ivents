import { useEffect, useState } from "react";
import { Reader } from "./Reader";

/**
 *  A hook that allows waiting for reader data and using it directly.
 */
function useReaderResult<TResult>(reader: Reader<TResult, void>) : TResult;
function useReaderResult<TResult, TParam>(reader: Reader<TResult, TParam>, param: TParam) : TResult;
function useReaderResult<TResult, TParam = any>(reader: Reader<TResult, any>, param?: any) : TResult | undefined {
    return reader.read(param);
};

export { useReaderResult };