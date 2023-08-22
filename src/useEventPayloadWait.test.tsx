import { Emitter, Event } from "@pawel-kuznik/iventy";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useEventPayloadWait } from "./useEventPayloadWait";
import { Suspense } from "react";

xdescribe('useEventPayloadWait()', () => {

    class FakeEmitter extends Emitter {
        // nothing special
    };

    const faker = new FakeEmitter();

    // note testing-library doesn't have enough of capabilities to
    // test this hook property. Mostly cause it's trying to shoot itself
    // into foot by reinventing JS execution. I guess it follows react
    // general design, so... uhh.
    // @see https://github.com/testing-library/react-hooks-testing-library/issues/20
    // there is an improvement proposed, but they didn't actually implement it.


    it('should provide payload', async () => {

        const status = renderHook(() => useEventPayloadWait(faker, 'test'), {
            wrapper: ({ children }) => (<Suspense fallback="loading">{children}</Suspense>)
        });
        await act(() => { faker.trigger(new Event('test', 3)) });

        await waitFor(() => expect(status.result.current).toEqual(3), { 
            timeout: 2000
        });
    });
});