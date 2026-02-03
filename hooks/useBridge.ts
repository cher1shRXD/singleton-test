"use client";

import { useEffect, useRef, useCallback } from "react";
import { getBridge, type BridgeMessage, type MessageHandler, type MessageType } from "@/lib/bridge";

export const useBridge = () => {
  const bridge = useRef(getBridge());

  const on = useCallback(<T = unknown>(type: MessageType, handler: MessageHandler<T>) => {
    return bridge.current.on(type, handler);
  }, []);

  const off = useCallback(<T = unknown>(type: MessageType, handler: MessageHandler<T>) => {
    bridge.current.off(type, handler);
  }, []);

  const postMessage = useCallback((message: BridgeMessage) => {
    bridge.current.postMessage(message);
  }, []);

  const requestCamera = useCallback(() => {
    bridge.current.requestCamera();
  }, []);

  return {
    on,
    off,
    postMessage,
    requestCamera,
  };
};

export const useBridgeEvent = <T = unknown>(
  type: MessageType,
  handler: MessageHandler<T>
) => {
  const bridge = useRef(getBridge());

  useEffect(() => {
    const unsubscribe = bridge.current.on(type, handler);
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);
};
