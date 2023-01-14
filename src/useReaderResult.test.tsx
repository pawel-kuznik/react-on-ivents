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
});