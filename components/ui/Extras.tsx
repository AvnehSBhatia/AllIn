"use client";
import { useEffect } from "react";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let greeted = false;

/** Small human touches: tab title when hidden, a note for people who open devtools, the Konami code. */
export function Extras() {
  useEffect(() => {
    if (!greeted) {
      greeted = true;
      console.log(
        "%c♠ ALL IN %c\nYou opened the console. Good instinct; most tells are in the details.\nThere are four aces hidden on this page.",
        "font: 600 16px Georgia, serif; color: #d6b25e",
        "font: 12px ui-monospace, monospace; color: #9fb8ad",
      );
    }
    const original = document.title;
    const vis = () => (document.title = document.hidden ? "Your seat is waiting · ALL IN" : original);
    document.addEventListener("visibilitychange", vis);

    let i = 0;
    const key = (e: KeyboardEvent) => {
      i = e.key === KONAMI[i] ? i + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (i === KONAMI.length) {
        i = 0;
        window.dispatchEvent(new Event("allin:rain"));
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("keydown", key);
    };
  }, []);
  return null;
}
