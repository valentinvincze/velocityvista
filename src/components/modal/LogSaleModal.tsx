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
import { logSale } from "@/app/dashboard/action";
import type { ILogSale } from "@/types";
import { TiArrowSortedDown } from "react-icons/ti";

export default function LogSaleModal({ trigger }: { trigger: ReactNode }) {
  const [error, submitAction, isPending] = useActionState(logSale, null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<ILogSale>({ defaultValues: { status: "" } });

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
        aria-label="Log Sale Modal"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((data) =>
          startTransition(() => submitAction(data)),
        )}
        noValidate
      >
        <div>
          <h2 className="text-xl font-medium mb-2">Log Sale</h2>
          <span className="font-light text-sm text-label">
            All fields are required unless indicated otherwise.
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label
              htmlFor="amount"
              className="text-xs uppercase font-medium text-label ml-1"
            >
              Amount
            </label>
            <input
              className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700  dark:focus:ring-neutral-500 dark:focus:border-neutral-600"
              type="number"
              id="amount"
              placeholder="8750"
              {...register("amount", {
                valueAsNumber: true,
                required: "Amount is required",
              })}
              aria-required="true"
              disabled={isPending}
            ></input>
            {errors.amount && (
              <span className="text-xs text-red-500 font-medium ml-1">
                {errors.amount.message}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="title"
              className="text-xs uppercase font-medium text-label ml-1"
            >
              Title
            </label>
            <input
              className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 dark:focus:ring-neutral-500 dark:focus:border-neutral-600"
              type="text"
              id="title"
              placeholder="Initech License"
              {...register("title", { required: "Title is required" })}
              aria-required="true"
              disabled={isPending}
            ></input>
            {errors.title && (
              <span className="text-xs text-red-500 font-medium ml-1">
                {errors.title.message}
              </span>
            )}
          </div>
        </div>
        <div>
          <label
            htmlFor="status-select"
            className="text-xs uppercase font-medium text-label ml-1"
          >
            Status
          </label>
          <div className="relative">
            <select
              id="status-select"
              {...register("status", {
                required: "Please select a status",
              })}
              className="appearance-none w-full border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 dark:focus:ring-neutral-500 dark:focus:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <option value="" disabled hidden>
                Select status
              </option>
              <option value="secured">Secured</option>
              <option value="lost">Lost</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <TiArrowSortedDown className="w-4 h-4 fill-gray-500 dark:fill-gray-400" />
            </div>
          </div>
          {errors.status && (
            <span className="text-xs text-red-500 font-medium ml-1">
              {errors.status.message}
            </span>
          )}
        </div>
        <div className="w-full flex flex-col">
          <label
            htmlFor="date"
            className="text-xs uppercase font-medium text-label ml-1 mb-1"
          >
            Closing Date
          </label>
          <input
            className="border border-gray-200 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 placeholder:text-placeholder dark:focus:ring-neutral-500 dark:focus:border-neutral-600"
            type="date"
            id="date"
            max={new Date().toISOString().split("T")[0]}
            {...register("closing_date", { required: "Date is required" })}
            aria-required="true"
            disabled={isPending}
          ></input>
          {errors.closing_date && (
            <span className="text-xs text-red-500 font-medium mt-1.5 ml-1">
              {errors.closing_date.message}
            </span>
          )}
        </div>
        {error && !error?.success && (
          <div role="alert" className="text-red-500 font-medium mt-2">
            {error.error}
          </div>
        )}
        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="w-full bg-black text-white border border-gray-200 font-medium rounded-lg p-2 mt-4 mb-2 cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:bg-white dark:text-black dark:border-neutral-700 dark:hover:bg-white"
        >
          Submit Sale
        </button>
        <span className="text-sm text-label text-center mb-4">
          Velocity Vista - 2026
        </span>
      </form>
    </Modal>
  );
}
