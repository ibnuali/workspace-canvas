import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";

export function useYjsRoom(roomId: string) {
  const docRef = useRef<Y.Doc>();
  const wsRef = useRef<WebSocket>();
  const [connected, setConnected] = useState(false);

  if (!docRef.current) {
    docRef.current = new Y.Doc();
  }

  useEffect(() => {
    const doc = docRef.current!;
    const ws = new WebSocket(`ws://localhost:3000/ws/${roomId}`);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onmessage = (event) => {
      const update = new Uint8Array(event.data);
      Y.applyUpdate(doc, update);
    };

    doc.on("update", (update: Uint8Array) => {
      ws.send(update);
    });

    wsRef.current = ws;

    return () => {
      ws.close();
      doc.destroy();
    };
  }, [roomId]);

  return {
    doc: docRef.current,
    connected,
  };
}