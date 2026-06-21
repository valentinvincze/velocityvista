import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import { LW5BChartProps } from "@/types";

const format = (num: number) => {
  if (num >= 1000) return `$${Math.round(num / 1000)}k`;
  return `$${num}`;
};

const W5_BAR_COLORS = [
  "var(--color-w5bar-1)",
  "var(--color-w5bar-2)",
  "var(--color-w5bar-3)",
  "var(--color-w5bar-4)",
  "var(--color-w5bar-5)",
];

function CustomBar({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index = 0,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={W5_BAR_COLORS[index] ?? W5_BAR_COLORS[W5_BAR_COLORS.length - 1]}
      rx={4}
    />
  );
}

function CustomBarLabel({
  x,
  y,
  width,
  index,
  entries,
}: {
  x?: number;
  y?: number;
  width?: number;
  index?: number;
  entries: LW5BChartProps;
}) {
  if (
    x === undefined ||
    y === undefined ||
    width === undefined ||
    index === undefined
  )
    return null;

  const parts = entries[index].label.split(" ");
  const initials =
    parts.length > 1
      ? `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
      : parts[0].charAt(0);

  const size = 36;
  const avatarX = x + width / 2 - size / 2;
  const avatarY = y - size - 10;

  return (
    <foreignObject x={avatarX} y={avatarY} width={size} height={size}>
      {entries[index].avatar_url ? (
        <img
          src={`${entries[index].avatar_url}`}
          className="rounded-full w-9 h-9"
        ></img>
      ) : (
        <div className="rounded-full bg-svg text-placeholder w-9 h-9 text-xs font-semibold flex items-center justify-center">
          {initials}
        </div>
      )}
    </foreignObject>
  );
}

export default function LW5BChart({ entries }: { entries: LW5BChartProps }) {
  return (
    <ResponsiveContainer width="100%" height="100%" debounce={1}>
      <BarChart data={entries} margin={{ left: 15, right: 10, top: 56 }}>
        <CartesianGrid
          horizontal
          vertical={false}
          stroke="var(--color-chart-grid)"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "var(--color-label)", fontSize: 12, dy: 8 }}
        />
        <YAxis
          allowDecimals={false}
          axisLine={false}
          tickLine={false}
          width={40}
          tick={{ fill: "var(--color-label)", fontSize: 12 }}
          tickFormatter={(num: number) => format(num)}
        />
        <Bar
          dataKey="amount"
          label={<CustomBarLabel entries={entries} />}
          shape={<CustomBar />}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
