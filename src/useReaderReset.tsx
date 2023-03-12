import { useEffect } from "react";
import { Reader } from "./Reader"

/**
 *  A hook to get access to a reset function of a reader and automatically 
 *  bind the reader to the lifecycle of the hook holder. Meaning that the
 *  reader automatically resets when the holder unmounts.
 */
export function useReaderReset(reader: Reader<any, any>) {

    useEffect(() => () => reader.reset(), []);

    return () => reader.reset();
};