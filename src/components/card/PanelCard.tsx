export default function PanelCard({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <div className="flex-1 border border-gray-200 bg-card rounded-3xl dark:border-neutral-700 flex flex-col gap-4 justify-center p-8">
      <h4 className="text-label uppercase">{title}</h4>
      <span className="text-7xl">{count}</span>
    </div>
  );
}
