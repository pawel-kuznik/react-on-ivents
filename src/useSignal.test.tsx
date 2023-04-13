import { SignalController } from "@pawel-kuznik/iventy";
import { renderHook } from "@testing-library/react";
import { useSignal } from "./useSignal";

describe('useSignal()', () => {

    it('should fire installed callback', done => {

        const controller = new SignalController<number>();

        renderHook(() => useSignal(controller, (payload: number) => {

            expect(payload).toEqual(42);
            done();
        }));

        controller.activate(42);
    });
});