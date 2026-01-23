import { useEffect, useState } from "react";

export default function Counter() {
  const [appleCount, setAppleCount] = useState(0);
  const [orangeCount, setOrangeCount] = useState(0);

  // Alternatives Beispiel: Timer!
  useEffect(() => {
    const currentTitle = window.document.title;

    console.log("Effect running!", new Date().toLocaleTimeString());
    window.document.title = `${appleCount} apples`;

    return () => {
      console.log("Clean up!");
      window.document.title = currentTitle;
    };
  }, [appleCount]);

  return (
    <div className={"flex items-center gap-x-2"}>
      Apple Counter: {appleCount}
      Orange Counter: {orangeCount}
      <button
        className={"primary"}
        onClick={() => setOrangeCount(orangeCount + 1)}
      >
        Increase Orange!
      </button>
      <button
        className={"primary"}
        onClick={() => setAppleCount(appleCount + 1)}
      >
        Increase Apple!
      </button>
    </div>
  );
}
