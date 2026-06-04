import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import { LB5BChartProps } from "@/types";

const format = (num: number) => {
  if (num >= 1000) return `$${Math.round(num / 1000)}k`;
  return `$${num}`;
};

const BAR_COLORS = [
  "var(--color-bar-1)",
  "var(--color-bar-2)",
  "var(--color-bar-3)",
  "var(--color-bar-4)",
  "var(--color-bar-4)",
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
      fill={BAR_COLORS[index] ?? BAR_COLORS[BAR_COLORS.length - 1]}
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
  entries: LB5BChartProps;
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
      <div className="rounded-full bg-svg text-placeholder w-9 h-9 text-xs font-semibold flex items-center justify-center">
        {initials}
      </div>
    </foreignObject>
  );
}

export default function LB5BChart({ entries }: { entries: LB5BChartProps }) {
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
          tick={{ fill: "var(--color-label)", fontSize: 12, dy: 12 }}
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
