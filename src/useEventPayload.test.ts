import { Emitter, Event } from "@pawel-kuznik/iventy";
import { act, renderHook } from "@testing-library/react";
import { useEventPayload } from "./useEventPayload";

describe('useEventPayload()', () => {

    class FakeEmitter extends Emitter {
        // nothing special
    };

    const faker = new FakeEmitter();

    it('should provide payload', () => {

        const status = renderHook(() => useEventPayload(faker, 'test'));
        act(() => { faker.trigger(new Event('test', 3)) });

        expect(status.result.current).toEqual(3);
    });

    it('should fire installed callback', done => {

        renderHook(() => useEventPayload(faker, 'test', () => done()));
        act(() => { faker.trigger('test'); });
    });

    it('should change data when new events arrive', async () => {

        const { result } = renderHook(() => useEventPayload(faker, 'test'));
        await act(() => faker.trigger(new Event('test', 3)));

        expect(result.current).toEqual(3);

        await act(() => faker.trigger(new Event('test', 6)));
        
        expect(result.current).toEqual(6);
    });
});