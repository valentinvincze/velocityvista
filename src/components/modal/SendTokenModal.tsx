"use client";

import { sendToken } from "@/app/dashboard/admin/action";
import { ISendToken } from "@/types";
import {
  ReactNode,
  useActionState,
  useEffect,
  useState,
  startTransition,
} from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";

export default function SendTokenModal({ trigger }: { trigger: ReactNode }) {
  const [error, submitAction, isPending] = useActionState(sendToken, null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ISendToken>();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (error?.success) {
      setIsOpen(false);
      reset();
    }
  }, [error]);

  return (
    <Modal trigger={trigger} isOpen={isOpen} setIsOpen={setIsOpen}>
      <form
        aria-label="Send Token Modal"
        className="flex flex-col gap-3"
        onSubmit={handleSubmit((data) =>
          startTransition(() => submitAction(data)),
        )}
        noValidate
      >
        <div>
          <h2 className="text-xl font-medium mb-2">Send token</h2>
          <span className="font-light text-sm text-label">
            Dispatch an onboarding token.
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-xs uppercase font-medium text-label ml-1"
          >
            Email Address
          </label>
          <input
            className="w-full border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 placeholder:text-placeholder dark:focus:ring-neutral-500 dark:focus:border-neutral-600"
            type="email"
            id="email"
            placeholder="jane@velocityv.com"
            {...register("emailAddress", {
              required: "Email address is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            aria-required="true"
            aria-invalid={error || errors.emailAddress ? "true" : "false"}
            disabled={isPending}
          ></input>
          {errors.emailAddress && (
            <span className="text-xs text-red-500 font-medium ml-1">
              {errors.emailAddress.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full bg-black text-white border border-gray-200 font-medium rounded-lg p-2 mt-4 mb-2 cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:bg-white dark:text-black dark:border-neutral-700 dark:hover:bg-white"
        >
          Send token
        </button>
        <span className="text-sm text-label text-center mb-2">
          Velocity Vista - 2026
        </span>
      </form>
    </Modal>
  );
}
