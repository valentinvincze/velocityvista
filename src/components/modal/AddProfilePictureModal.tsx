"use client";

import {
  useActionState,
  useState,
  useEffect,
  useRef,
  startTransition,
  ReactNode,
  useCallback,
} from "react";
import Modal from "./Modal";
import {
  addProfilePicture,
  removeProfilePicture,
} from "@/app/dashboard/settings/action";

export default function AddProfilePictureModal({
  trigger,
  avatar_url,
  initials,
}: {
  trigger: ReactNode;
  avatar_url: string | undefined;
  initials: string;
}) {
  const [uploadState, uploadAction, isUploadPending] = useActionState(
    addProfilePicture,
    null,
  );
  const [removeState, removeAction, isRemovePending] = useActionState(
    removeProfilePicture,
    null,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      setFileError("");
    } else {
      setFileError("Only image files are allowed.");
    }
  };

  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [previewUrl]);

  useEffect(() => {
    if (uploadState?.success) {
      setIsOpen(false);
      handleReset();
    }
  }, [uploadState, handleReset]);

  useEffect(() => {
    if (removeState?.success) {
      setIsOpen(false);
      handleReset();
    }
  }, [removeState, handleReset]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar_url", file);
    startTransition(() => uploadAction(formData));
  };

  const displayUrl = previewUrl || avatar_url;

  return (
    <Modal trigger={trigger} isOpen={isOpen} setIsOpen={setIsOpen}>
      <form
        aria-label="Add Profile Picture Modal"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        noValidate
      >
        {displayUrl ? (
          <img src={displayUrl} className="rounded-full w-40 h-40 mx-auto" />
        ) : (
          <span className="rounded-full bg-svg text-placeholder w-30 h-30 text-4xl font-semibold flex items-center justify-center mx-auto">
            {initials}
          </span>
        )}
        {fileError && (
          <span className="text-sm text-red-500 font-semibold text-center">
            {fileError}
          </span>
        )}
        <div className="flex gap-2 justify-center">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="avatar_url"
              className="w-[180px] text-label border border-gray-200 text-sm py-2 px-3 rounded-lg cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:border-neutral-700 text-center"
            >
              {!previewUrl ? "+ Add Profile Picture" : "Chose a different file"}
            </label>
            <input
              id="avatar_url"
              className="appearance-none hidden sr-only"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={isUploadPending}
            />
          </div>
          {displayUrl && (
            <button
              type="button"
              disabled={isRemovePending}
              aria-busy={isRemovePending}
              className="w-[180px] text-label border border-gray-200 text-sm py-2 px-3 rounded-lg cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:border-neutral-700 text-center"
              onClick={() => {
                handleReset();
                if (avatar_url) {
                  startTransition(() => removeAction());
                }
              }}
            >
              Revert back to default
            </button>
          )}
        </div>
        {previewUrl && (
          <div className="flex justify-center gap-2">
            <button
              type="submit"
              disabled={isUploadPending}
              aria-busy={isUploadPending}
              className="w-[180px] text-label border border-gray-200 text-sm py-2 px-3 rounded-lg cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:border-neutral-700 text-center"
            >
              Confirm
            </button>
            <button
              type="button"
              disabled={isUploadPending}
              aria-busy={isUploadPending}
              className="w-[180px] text-label border border-gray-200 text-sm py-2 px-3 rounded-lg cursor-pointer transition-scale duration-300 ease-out hover:scale-103 active:scale-95 dark:border-neutral-700 text-center"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        )}
        <span className="text-sm text-label text-center mb-2">
          Velocity Vista - 2026
        </span>
      </form>
    </Modal>
  );
}
