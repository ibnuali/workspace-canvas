import { useEffect, useState } from "react";
import { useYjsRoom } from "./yjs/useYjsRoom";

export default function App() {
  const { doc, connected } = useYjsRoom("test-room");
  const [value, setValue] = useState("");

  const yText = doc.getText("shared-text");

  useEffect(() => {
    const updateText = () => {
      setValue(yText.toString());
    };

    yText.observe(updateText);
    updateText();

    return () => {
      yText.unobserve(updateText);
    };
  }, [yText]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    doc.transact(() => {
      yText.delete(0, yText.length);
      yText.insert(0, newValue);
    });
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Yjs + Hono Collaboration</h2>
      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      <textarea
        value={value}
        onChange={handleChange}
        rows={10}
        cols={50}
      />
    </div>
  );
}