import { act, renderHook, waitFor } from '@testing-library/react';
import { Suspense } from 'react';
import { Reader } from './Reader';
import { useReaderResult } from './useReaderResult';

describe('useReaderResult()', () => {

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
            return (<Suspense fallback="loading">
                {children}
            </Suspense>);
        };

    it('should read data from reader', async () => {

        const reader = new Reader<number>(() => Promise.resolve(42));
        const result  = await act(() => renderHook(() => useReaderResult(reader), {
            wrapper: Wrapper
        }));

        await waitFor(() => {
            expect(result.result.current).toEqual(42);
        });
    });
    it('should pass the parameter', async () => {

        const reader = new Reader<number, number>((param: number) => Promise.resolve(param));
        const result = await act(() => renderHook(() => useReaderResult(reader, 42), {
            wrapper: Wrapper
        }));

        await waitFor(() => expect(result.result.current).toEqual(42));
    });
    it('should tell the reload when the reader reloads', async () => {

        let a = 1;

        const reader = new Reader<number>(() => Promise.resolve(a));
        const result = await act(() => renderHook(() => useReaderResult(reader), {
            wrapper: Wrapper
        }));

        await waitFor(() => expect(result.result.current).toEqual(1));

        a = 2;
        reader.reload();

        await waitFor(() => expect(result.result.current).toEqual(2));
    });
    it('should reload once per finished call from the reader', async () => {

        let count = 0;

        const reader = new Reader<number, string>((identifier: string) => Promise.resolve(++count));
        const result = await act(() => renderHook(() => useReaderResult(reader, 'test'), {
            wrapper: Wrapper
        }));

        await waitFor(() => expect(result.result.current).toEqual(1));
        await waitFor(() => expect(result.result.current).toEqual(1));
        await waitFor(() => expect(result.result.current).toEqual(1));
    });
});