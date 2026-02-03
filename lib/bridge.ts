type MessageType = 
  | "CAMERA_REQUEST"
  | "CAMERA_PHOTO"
  | "CAMERA_ERROR"
  | "READY"
  | string;

interface BridgeMessage<T = unknown> {
  type: MessageType;
  data?: T;
  error?: string;
}

type MessageHandler<T = unknown> = (data: T) => void;

class WebViewBridge {
  private listeners: Map<MessageType, Set<MessageHandler<unknown>>> = new Map();
  private isReady = false;
  private messageQueue: BridgeMessage[] = [];

  constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  private init() {
    // Listen for messages from native (React Native WebView)
    window.addEventListener("message", this.handleMessage);
    document.addEventListener("message", this.handleMessage as EventListener);

    // Notify native that web is ready
    this.postMessage({ type: "READY" });
  }

  private handleMessage = (event: MessageEvent) => {
    try {
      const message: BridgeMessage = 
        typeof event.data === "string" 
          ? JSON.parse(event.data) 
          : event.data;

      const { type, data, error } = message;

      // Execute all listeners for this message type
      const handlers = this.listeners.get(type);
      if (handlers) {
        handlers.forEach((handler) => {
          handler(error ? { error } : data);
        });
      }

      // Also execute wildcard listeners
      const wildcardHandlers = this.listeners.get("*");
      if (wildcardHandlers) {
        wildcardHandlers.forEach((handler) => {
          handler(message);
        });
      }
    } catch (error) {
      console.error("Failed to parse bridge message:", error);
    }
  };

  public on<T = unknown>(type: MessageType, handler: MessageHandler<T>) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler as MessageHandler<unknown>);

    // Return unsubscribe function
    return () => {
      const handlers = this.listeners.get(type);
      if (handlers) {
        handlers.delete(handler as MessageHandler<unknown>);
        if (handlers.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  public off<T = unknown>(type: MessageType, handler: MessageHandler<T>) {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.delete(handler as MessageHandler<unknown>);
      if (handlers.size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  public postMessage(message: BridgeMessage) {
    if (typeof window === "undefined") return;

    const stringifiedMessage = JSON.stringify(message);

    // Try to send to React Native WebView
    const w = window as typeof window & { ReactNativeWebView?: { postMessage: (msg: string) => void } };
    if (w.ReactNativeWebView) {
      w.ReactNativeWebView.postMessage(stringifiedMessage);
    } 
    // Fallback for web-to-web communication (e.g., iframe)
    else if (window.parent !== window) {
      window.parent.postMessage(stringifiedMessage, "*");
    }
    // Development/testing mode
    else {
      console.log("[Bridge] Sent:", message);
    }
  }

  public requestCamera() {
    this.postMessage({ type: "CAMERA_REQUEST" });
  }

  public destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.handleMessage);
      document.removeEventListener("message", this.handleMessage as EventListener);
    }
    this.listeners.clear();
  }
}

// Singleton instance
let bridgeInstance: WebViewBridge | null = null;

export const getBridge = (): WebViewBridge => {
  if (!bridgeInstance) {
    bridgeInstance = new WebViewBridge();
  }
  return bridgeInstance;
};

export const destroyBridge = () => {
  if (bridgeInstance) {
    bridgeInstance.destroy();
    bridgeInstance = null;
  }
};

export type { BridgeMessage, MessageHandler, MessageType };
