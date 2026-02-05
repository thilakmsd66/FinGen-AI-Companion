import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", score: 70 },
  { day: "Tue", score: 75 },
  { day: "Wed", score: 80 },
  { day: "Thu", score: 85 },
  { day: "Fri", score: 90 },
];

export default function AssessmentChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#0b3c5d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
