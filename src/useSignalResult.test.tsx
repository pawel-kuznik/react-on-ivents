import { SignalController } from "@pawel-kuznik/iventy";
import { act, renderHook } from "@testing-library/react";
import { useSignalResult } from "./useSignalResult";

describe('useSignalResult()', () => {

    it('should provide the data passed to signal', () => {

        const controller = new SignalController<number>();

        const { result } = renderHook(() => useSignalResult<number>(controller.signal));

        act(() => {
            controller.activate(42);
        });
        

        expect(result.current).toEqual(42);
    });
});