import { EmitterLike, EventHandler } from "@pawel-kuznik/iventy";
import { useEffect } from "react";

/**
 *  This is a hook that allows creation of an event callback bound to specific
 *  event emitter and the component.
 */
export function useEventCallback(emitter: EmitterLike, event: string, handler: EventHandler) {

    useEffect(() => {
        return emitter.handle(event, handler);
    }, [ emitter, event, handler ]);
};