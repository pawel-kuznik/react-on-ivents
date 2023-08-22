import { EmitterLike } from "@pawel-kuznik/iventy";
import { useEventPayload } from "./useEventPayload";
import { SuspenseLock } from "./SuspenseLock";
import { useState } from "react";

/**
 *  So this doesn't work cause react destroys everything till the <Suspense> tag.
 *  Meaning that the lock will be removed and we will never be able to send
 *  the message via promise.
 *  This is really problematic cause we can't really implement a suspense-aware
 *  payload waiter.
 */
export function useEventPayloadWait<TPayload>(emitter: EmitterLike, event: string) : TPayload {

    const [ lock ] = useState<SuspenseLock>(() => new SuspenseLock());
    const payload = useEventPayload<TPayload>(emitter, event, (event) => {
        console.log('on change', event);
        lock.trigger();
    });

    console.log('payload', payload);

    if (payload === undefined) throw lock.suspensePromise;
        
    return payload;
};