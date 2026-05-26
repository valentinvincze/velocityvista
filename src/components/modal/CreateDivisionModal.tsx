"use client";

import {
  useActionState,
  useState,
  useEffect,
  startTransition,
  ReactNode,
} from "react";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import { logDivision } from "@/app/dashboard/admin/action";
import type { ICreateDivision } from "@/types";

export default function CreateDivisionModal({
  trigger,
}: {
  trigger: ReactNode;
}) {
  const [error, submitAction, isPending] = useActionState(logDivision, null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ICreateDivision>();

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
        aria-label="Create Division Modal"
        className="flex flex-col gap-3"
        onSubmit={handleSubmit((data) =>
          startTransition(() => submitAction(data)),
        )}
        noValidate
      >
        <div>
          <h2 className="text-xl font-medium mb-2">Create Division</h2>
          <span className="font-light text-sm text-label">
            Add a new division to the organisation.
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="div_name"
            className="text-xs uppercase font-medium text-label ml-1"
          >
            Division name
          </label>
          <input
            id="div_name"
            className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 dark:focus:ring-neutral-500 dark:focus:border-neutral-600 placeholder:text-placeholder"
            type="text"
            placeholder="e.g. B2B Channel"
            {...register("div_name", {
              required: "Division name is required",
            })}
            aria-required="true"
            disabled={isPending}
          ></input>
          {errors.div_name && (
            <span className="text-xs text-red-500 font-medium ml-1">
              {errors.div_name.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full bg-black text-white border border-gray-200 font-medium rounded-lg p-2 mt-4 mb-2 cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:bg-white dark:text-black dark:border-neutral-700 dark:hover:bg-white"
        >
          Create division
        </button>
        <span className="text-sm text-label text-center mb-2">
          Velocity Vista - 2026
        </span>
      </form>
    </Modal>
  );
}
