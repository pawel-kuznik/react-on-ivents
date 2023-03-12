import { act, renderHook, waitFor } from "@testing-library/react";
import { Suspense } from "react";
import { Reader } from "./Reader";
import { useReaderReset } from "./useReaderReset";

describe('useReaderReset()', () => {

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
            return (<Suspense fallback="loading">
                {children}
            </Suspense>);
        };

    it('should reset the reader ', async () => {

        const reader = new Reader<number>(() => Promise.resolve(42));
        const result  = await act(() => renderHook(() => useReaderReset(reader), {
            wrapper: Wrapper
        }));

        const resetHandler = jest.fn();
        reader.on('reset', resetHandler);

        result.result.current();

        await waitFor(() => {
            expect(resetHandler).toBeCalled();
        });
    });
    it('should reset the reader on unmount', async () => {

        const reader = new Reader<number>(() => Promise.resolve(42));
        const result  = await act(() => renderHook(() => useReaderReset(reader), {
            wrapper: Wrapper
        }));

        const resetHandler = jest.fn();
        reader.on('reset', resetHandler);

        result.unmount();

        await waitFor(() => {
            expect(resetHandler).toBeCalled();
        });
    });
});