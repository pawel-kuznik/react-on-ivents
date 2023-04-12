import { Signal, SignalCallback, SignalController } from "@pawel-kuznik/iventy";
import { useEffect } from "react";

export function useSignal<TPayload>(target: Signal<TPayload>|SignalController<TPayload>, callback: SignalCallback<TPayload>) {

    useEffect(() => {
        
        const signal = target instanceof SignalController ? target.signal : target;

        return signal.observe(callback);
    }, []);
};