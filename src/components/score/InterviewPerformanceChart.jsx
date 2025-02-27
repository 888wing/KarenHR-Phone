import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const InterviewPerformanceChart = ({
  evaluationHistory,
  performanceHistory,
  currentScores,
}) => {
  // 使用傳入的數據或默認數據
  const chartData = performanceHistory || [
    {
      date: "2/15",
      score: 68,
      clarity: 65,
      confidence: 60,
      relevance: 75,
      technical: 70,
    },
    {
      date: "2/22",
      score: 75,
      clarity: 70,
      confidence: 72,
      relevance: 80,
      technical: 75,
    },
    {
      date: "3/01",
      score: 82,
      clarity: 83,
      confidence: 75,
      relevance: 85,
      technical: 80,
    },
    {
      date: "3/08",
      score: 78,
      clarity: 85,
      confidence: 80,
      relevance: 75,
      technical: 72,
    },
    {
      date: "3/15",
      score: 88,
      clarity: 90,
      confidence: 85,
      relevance: 88,
      technical: 85,
    },
    {
      date: "3/22",
      score: 96,
      clarity: 95,
      confidence: 92,
      relevance: 95,
      technical: 97,
    },
  ];

  // 當前面試詳細評分數據
  const detailScores = currentScores || [
    { category: "回答清晰度", value: 95 },
    { category: "自信程度", value: 92 },
    { category: "內容相關性", value: 95 },
    { category: "技術知識", value: 97 },
    { category: "溝通技巧", value: 94 },
  ];

  return (
    <div className="space-y-6">
      {/* 總體表現趨勢圖 */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">表現趨勢</h3>
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E6AA63" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#E6AA63" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff2b3",
                  borderRadius: "8px",
                  border: "none",
                }}
                formatter={(value) => [`${value}分`, "得分"]}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#E6AA63"
                fillOpacity={1}
                fill="url(#colorScore)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 最近一次面試能力雷達圖 */}
      <div>
        <h3 className="text-lg font-medium mb-2">能力分析</h3>
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart outerRadius={90} data={detailScores}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Radar
                name="表現"
                dataKey="value"
                stroke="#D8365D"
                fill="#D8365D"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff2b3",
                  borderRadius: "8px",
                  border: "none",
                }}
                formatter={(value) => [`${value}分`, "評分"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 詳細分項能力柱狀圖 */}
      <div>
        <h3 className="text-lg font-medium mb-2">詳細評分</h3>
        <div className="bg-white p-2 rounded-lg shadow-sm">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={detailScores}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                scale="point"
                padding={{ left: 10, right: 10 }}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff2b3",
                  borderRadius: "8px",
                  border: "none",
                }}
                formatter={(value) => [`${value}分`, "評分"]}
              />
              <Bar dataKey="value" fill="#E6AA63" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style jsx>{`
        .space-y-6 > * + * {
          margin-top: 1.5rem;
        }

        .shadow-sm {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .rounded-lg {
          border-radius: 0.5rem;
        }

        .text-lg {
          font-size: 1.125rem;
          line-height: 1.75rem;
        }

        .font-medium {
          font-weight: 500;
        }

        .mb-2 {
          margin-bottom: 0.5rem;
        }

        .mb-6 {
          margin-bottom: 1.5rem;
        }

        .p-2 {
          padding: 0.5rem;
        }

        .bg-white {
          background-color: white;
        }
      `}</style>
    </div>
  );
};

export default InterviewPerformanceChart;
