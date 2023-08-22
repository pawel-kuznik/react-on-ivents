import { EmitterLike, Event, EventHandler } from "@pawel-kuznik/iventy";
import { useState } from "react";
import { useEventCallback } from "./useEventCallback";

/**
 *  This is a hook that traps the last payload a specific event.
 */
export function useEventPayload<TPayload>(emitter: EmitterLike, event: string, callback: EventHandler|undefined = undefined) : TPayload|undefined {

    const [ payload, setPayload ] = useState<TPayload|undefined>(undefined);

    useEventCallback(emitter, event, (event: Event<TPayload>) => {
        setPayload(event.data);
        if (callback) callback(event);
    });

    return payload;
};