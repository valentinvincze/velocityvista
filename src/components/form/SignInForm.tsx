"use client";
import { useActionState, startTransition, useState } from "react";
import type { ISignInForm } from "@/types";
import { signInUser } from "@/app/auth/signin/action";
import { useForm } from "react-hook-form";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function SignInForm() {
  const [error, submitAction, isPending] = useActionState(signInUser, null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ISignInForm>();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((data) =>
        startTransition(() => submitAction(data)),
      )}
      aria-label="Sign in form"
      noValidate
    >
      <div className="mb-4">
        <h2 className="text-xl font-medium ml-1">Welcome back</h2>
        <span className="font-light text-sm text-label ml-1">
          Enter your credentials to access your workspace.
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
              message: "Invalid email address",
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
      <div className="flex flex-col gap-1">
        <label
          htmlFor="password"
          className="text-xs uppercase font-medium text-label ml-1"
        >
          Password
        </label>
        <div className="relative">
          <input
            className="w-full border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 placeholder:text-placeholder dark:focus:ring-neutral-500 dark:focus:border-neutral-600"
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Min. 8 characters"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            aria-required="true"
            aria-invalid={error || errors.password ? "true" : "false"}
            disabled={isPending}
          ></input>

          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? (
              <IoMdEyeOff className="w-4 h-4 fill-gray-500 dark:fill-gray-400" />
            ) : (
              <IoMdEye className="w-4 h-4 fill-gray-500 dark:fill-gray-400" />
            )}
          </button>
          {errors.password && (
            <span className="text-xs text-red-500 font-medium ml-1">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>
      <hr className="border-gray-200 my-2 dark:border-neutral-700" />
      {error && (
        <div role="alert" className="text-red-500 font-medium mt-2 ml-1">
          {error.error}
        </div>
      )}
      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full bg-black text-white border border-gray-200 font-medium rounded-lg p-2 mt-2 mb-4 cursor-pointer transition-scale duration-300 ease-out hover:scale-102 active:scale-95 dark:bg-white dark:text-black dark:border-neutral-700 dark:hover:bg-white"
      >
        Sign in
      </button>
      <span className="text-sm text-label text-center">
        Velocity Vista - 2026
      </span>
    </form>
  );
}
