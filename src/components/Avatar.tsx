import AddProfilePictureModal from "@/components/modal/AddProfilePictureModal";

export default function Avatar({
  initials,
  avatar_url,
}: {
  initials: string;
  avatar_url: string | undefined;
}) {
  return (
    <AddProfilePictureModal
      trigger={
        avatar_url ? (
          <img src={`${avatar_url}`} className="rounded-full w-9 h-9"></img>
        ) : (
          <span className="rounded-full bg-svg text-placeholder w-9 h-9 text-xs font-semibold flex items-center justify-center cursor-pointer">
            {initials}
          </span>
        )
      }
      avatar_url={avatar_url}
      initials={initials}
    />
  );
}
