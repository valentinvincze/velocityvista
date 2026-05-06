import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";
import { LChartProps } from "@/types";

function CustomLabel({
  cx,
  cy,
  value,
  stroke,
  offset,
  index,
  entries,
}: {
  cx?: number;
  cy?: number;
  value?: number;
  stroke: string;
  offset: number;
  index?: number;
  entries: { label: string; currentDayCount: number; lastDayCount: number }[];
}) {
  return (
    <text
      x={cx}
      y={
        (cy ?? 0) -
        (entries[index ?? 0].currentDayCount === 0 &&
        entries[index ?? 0].lastDayCount === 0
          ? offset
          : 10)
      }
      textAnchor="middle"
      fontSize={12}
      fill={stroke}
    >
      {value}
    </text>
  );
}

export default function LChart({ entries }: { entries: LChartProps }) {
  return (
    <ResponsiveContainer width="100%" height="100%" debounce={1}>
      <LineChart data={entries} margin={{ left: 15, right: 10, top: 20 }}>
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
          width={13}
          tick={{ fill: "var(--color-label)", fontSize: 12, dx: -13 }}
        />
        <Line
          type="monotone"
          dataKey="currentDayCount"
          stroke="var(--color-chart-line)"
          strokeWidth={4}
          dot={false}
          activeDot={
            <CustomLabel
              stroke="var(--color-chart-line)"
              offset={10}
              entries={entries}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="lastDayCount"
          stroke="var(--color-chart-line-muted)"
          strokeWidth={4}
          dot={false}
          activeDot={
            <CustomLabel
              stroke="var(--color-chart-line-muted)"
              offset={25}
              entries={entries}
            />
          }
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
