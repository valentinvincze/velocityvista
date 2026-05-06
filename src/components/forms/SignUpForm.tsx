"use client";

import { useActionState, startTransition, useState } from "react";
import type { SignUpFormProps, ISignUpForm } from "@/types";
import { signUpNewUser } from "@/app/auth/signup/action";
import { TiArrowSortedDown } from "react-icons/ti";
import { useForm } from "react-hook-form";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function SignUpForm({ options }: SignUpFormProps) {
  const [error, submitAction, isPending] = useActionState(signUpNewUser, null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<ISignUpForm>({ defaultValues: { role: "", division: "" } });
  const [showPassword, setShowPassword] = useState(false);

  const role = watch("role");

  const divisionOptions = options.map((option) => (
    <option key={option.id} value={option.id}>
      {option.name}
    </option>
  ));

  return (
    <form
      aria-label="Sign up form"
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((data) =>
        startTransition(() => submitAction(data)),
      )}
      noValidate
    >
      <div className="mb-4">
        <h2 className="text-xl font-medium">New user registration</h2>
        <span className="font-light text-sm text-label">
          All fields are required unless indicated otherwise.
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label
            htmlFor="name"
            className="text-xs uppercase font-medium text-label ml-1"
          >
            Full Name
          </label>
          <input
            className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 placeholder:text-placeholder dark:focus:ring-neutral-500 dark:focus:border-neutral-600"
            type="text"
            id="name"
            placeholder="Jane Smith"
            {...register("fullName", { required: "Full name is required" })}
            aria-required="true"
            disabled={isPending}
          ></input>
          {errors.fullName && (
            <span className="text-xs text-red-500 font-medium ml-1">
              {errors.fullName.message}
            </span>
          )}
        </div>
        <div>
          <label
            htmlFor="jobtitle"
            className="text-xs uppercase font-medium text-label ml-1"
          >
            Job Title
          </label>
          <input
            className="border border-gray-200 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 placeholder:text-placeholder dark:focus:ring-neutral-500 dark:focus:border-neutral-600"
            type="text"
            id="jobtitle"
            placeholder="Sales Rep"
            {...register("jobTitle", { required: "Job title is required" })}
            aria-required="true"
            disabled={isPending}
          ></input>
          {errors.jobTitle && (
            <span className="text-xs text-red-500 font-medium ml-1">
              {errors.jobTitle.message}
            </span>
          )}
        </div>
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
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label
            htmlFor="role-select"
            className="text-xs uppercase font-medium text-label ml-1"
          >
            Role
          </label>
          <div className="relative">
            <select
              id="role-select"
              {...register("role", { required: "Please select a role" })}
              className="appearance-none w-full border border-gray-200 rounded-lg px-2 py-2 text-label focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 dark:text-white dark:focus:ring-neutral-500 dark:focus:border-neutral-600"
            >
              <option value="" disabled hidden>
                Select Role
              </option>
              <option value="rep">Sales Rep</option>
              <option value="admin">Admin</option>
              <option value="coo">Chief Operating Officer</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <TiArrowSortedDown className="w-4 h-4 fill-gray-500 dark:fill-gray-400" />
            </div>
          </div>
          {errors.role && (
            <span className="text-xs text-red-500 font-medium ml-1">
              {errors.role.message}
            </span>
          )}
          {role === "rep" && (
            <span className="text-placeholder text-xs ml-1">
              Access only to assigned division
            </span>
          )}
          {role === "admin" && (
            <span className="text-placeholder text-xs ml-1">
              Manage users within division
            </span>
          )}
          {role === "coo" && (
            <span className="text-placeholder text-xs ml-1">
              Full access across the organisation
            </span>
          )}
        </div>
        <div>
          <label
            htmlFor="division-select"
            className="text-xs uppercase font-medium text-label ml-1"
          >
            Division
          </label>
          <div className="relative">
            <select
              id="division-select"
              {...register("division", {
                required: role !== "coo" ? "Please select a division" : false,
              })}
              disabled={role === "coo"}
              className="appearance-none w-full border border-gray-200 rounded-lg px-2 py-2 text-label focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 dark:border-neutral-700 dark:text-white dark:focus:ring-neutral-500 dark:focus:border-neutral-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <option value="" disabled hidden>
                Select division
              </option>
              {divisionOptions}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <TiArrowSortedDown className="w-4 h-4 fill-gray-500 dark:fill-gray-400" />
            </div>
          </div>
          {errors.division && (
            <span className="text-xs text-red-500 font-medium ml-1">
              {errors.division.message}
            </span>
          )}
          {role === "coo" && (
            <span className="text-placeholder text-xs ml-1">
              COO operates across all divisions
            </span>
          )}
        </div>
      </div>
      {error && (
        <div role="alert" className="text-red-500 font-medium mt-2 ml-1">
          {error.error}
        </div>
      )}
      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full bg-black text-white border border-gray-200 font-medium rounded-lg p-2 mt-2 mb-4 cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:bg-white dark:text-black dark:border-neutral-700 dark:hover:bg-white"
      >
        Register account
      </button>
      <span className="text-sm text-label text-center">
        Velocity Vista - 2026
      </span>
    </form>
  );
}
