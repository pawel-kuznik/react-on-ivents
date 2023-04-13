import { Signal, SignalController } from "@pawel-kuznik/iventy";
import { useEffect, useState } from "react";

/**
 *  A hook to get the last signal payload. The hook will force a reload
 *  every time the signal activates and the payload changes. The change
 *  is dermined by the useState method (the Object.is).
 */
export function useSignalResult<TPayload>(target: SignalController<TPayload>|Signal<TPayload>) : TPayload|undefined {

    const [ payload, setPayload ] = useState<TPayload|undefined>();

    useEffect(() => {

        const signal = target instanceof SignalController ? target.signal : target;
        return signal.observe(setPayload);
    }, [ target ]);

    return payload;
}