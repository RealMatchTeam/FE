import { useEffect, useState } from "react";

export default function useKeyboardOffset() {
  const [kb, setKb] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      // iOS에서 offsetTop이 0이 아닐 때가 있어서 보정
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKb(offset);
      document.documentElement.style.setProperty("--kb", `${offset}px`);
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);

    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return kb;
}
