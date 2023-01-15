import { Emitter } from "@pawel-kuznik/iventy";
import { renderHook } from "@testing-library/react";
import { useEventCallback } from "./useEventCallback";

describe('useEventCallback()', () => {

    class FakeEmitter extends Emitter {
        // nothing special
    };

    const faker = new FakeEmitter();

    it('should fire installed callback', done => {

        renderHook(() => useEventCallback(faker, 'test', () => done()));
        faker.trigger('test');
    });
});