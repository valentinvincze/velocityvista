"use client";

import { useRef, useEffect } from "react";
import type { ModalProps } from "@/types";

export default function Modal({
  trigger,
  isOpen,
  setIsOpen,
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
    } else {
      if (ref.current?.open) ref.current.close();
    }
  }, [isOpen]);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>
      <dialog
        ref={ref}
        onClose={() => setIsOpen(false)}
        onClick={() => setIsOpen(false)}
        className="rounded-2xl shadow-2xl p-6 w-full max-w-md backdrop:bg-black/50 backdrop:backdrop-blur-sm fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-200 dark:border-neutral-700 bg-form"
      >
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      </dialog>
    </>
  );
}
