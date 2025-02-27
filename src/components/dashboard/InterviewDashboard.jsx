import React, { useState, useEffect } from "react";
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
  Cell,
  PieChart,
  Pie,
} from "recharts";

const InterviewDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("3months");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [interviews, setInterviews] = useState([]);

  // Fetch user data on component mount
  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockUserData = {
          name: "User",
          totalInterviews: 12,
          averageScore: 78,
          industryBenchmark: 71,
          improvementRate: 14.5,
          strengths: [
            { category: "溝通能力", score: 85 },
            { category: "技術知識", score: 82 },
          ],
          weaknesses: [
            { category: "處理壓力", score: 65 },
            { category: "結構化回答", score: 68 },
          ],
          interviewHistory: generateMockInterviewHistory(),
        };

        setUserData(mockUserData);
        setInterviews(mockUserData.interviewHistory);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate mock interview history data
  const generateMockInterviewHistory = () => {
    const history = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const interviewDate = new Date(now);
      interviewDate.setMonth(now.getMonth() - i);

      // Simulate improvement over time
      const baseScore = 65;
      const improvement = Math.min(25, i * 2.5);
      const randomVariation = Math.random() * 10 - 5;

      history.push({
        id: `interview-${i}`,
        date: interviewDate.toISOString(),
        formattedDate: `${interviewDate.getFullYear()}/${interviewDate.getMonth() + 1}/${interviewDate.getDate()}`,
        industry: ["科技", "金融", "醫療", "教育", "零售"][
          Math.floor(Math.random() * 5)
        ],
        karenType: ["嚴格型", "細節型", "急躁型", "質疑型"][
          Math.floor(Math.random() * 4)
        ],
        overallScore: Math.round(baseScore + improvement + randomVariation),
        scores: {
          relevance: Math.round(
            baseScore + improvement + Math.random() * 10 - 5,
          ),
          clarity: Math.round(baseScore + improvement + Math.random() * 10 - 5),
          confidence: Math.round(
            baseScore + improvement + Math.random() * 10 - 5,
          ),
          technical: Math.round(
            baseScore + improvement + Math.random() * 10 - 5,
          ),
          communication: Math.round(
            baseScore + improvement + Math.random() * 10 - 5,
          ),
        },
        benchmark: Math.round(70 + Math.random() * 10 - 5),
      });
    }

    return history;
  };

  // Filter interviews based on selected time range
  const getFilteredInterviews = () => {
    if (!interviews.length) return [];

    const now = new Date();
    let cutoffDate = new Date();

    switch (timeRange) {
      case "month":
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case "3months":
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case "year":
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return interviews;
    }

    return interviews.filter(
      (interview) => new Date(interview.date) >= cutoffDate,
    );
  };

  const filteredInterviews = getFilteredInterviews();

  // Prepare chart data
  const prepareProgressChartData = () => {
    return filteredInterviews.map((interview) => ({
      date: new Date(interview.date).toLocaleDateString("zh-TW", {
        month: "short",
        day: "numeric",
      }),
      score: interview.overallScore,
      benchmark: interview.benchmark,
    }));
  };

  // Prepare skill radar data
  const prepareSkillRadarData = () => {
    if (!userData || filteredInterviews.length === 0) return [];

    // Use the latest interview for the radar chart
    const latestInterview = filteredInterviews[filteredInterviews.length - 1];

    return [
      {
        skill: "回答相關性",
        value: latestInterview.scores.relevance,
        fullMark: 100,
      },
      {
        skill: "表達清晰度",
        value: latestInterview.scores.clarity,
        fullMark: 100,
      },
      {
        skill: "自信程度",
        value: latestInterview.scores.confidence,
        fullMark: 100,
      },
      {
        skill: "技術知識",
        value: latestInterview.scores.technical,
        fullMark: 100,
      },
      {
        skill: "溝通技巧",
        value: latestInterview.scores.communication,
        fullMark: 100,
      },
    ];
  };

  // Prepare strengths and weaknesses data
  const prepareStrengthsWeaknesses = () => {
    if (!userData) return { strengths: [], weaknesses: [] };

    return {
      strengths: userData.strengths,
      weaknesses: userData.weaknesses,
    };
  };

  // Prepare industry comparison data
  const prepareIndustryComparison = () => {
    if (!filteredInterviews.length) return [];

    // Group by industry and calculate average scores
    const industryScores = {};
    filteredInterviews.forEach((interview) => {
      if (!industryScores[interview.industry]) {
        industryScores[interview.industry] = {
          total: interview.overallScore,
          count: 1,
          benchmark: interview.benchmark,
        };
      } else {
        industryScores[interview.industry].total += interview.overallScore;
        industryScores[interview.industry].count += 1;
      }
    });

    return Object.keys(industryScores).map((industry) => ({
      industry,
      userScore: Math.round(
        industryScores[industry].total / industryScores[industry].count,
      ),
      benchmark: industryScores[industry].benchmark,
    }));
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="p-4 max-w-sm w-full">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-gray-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-2 bg-gray-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-gray-500">正在加載數據...</div>
        </div>
      </div>
    );
  }

  // Render empty state if no data
  if (!userData || filteredInterviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <div className="text-3xl text-gray-400 mb-2">📊</div>
        <h3 className="text-lg font-medium text-gray-600">暫無面試數據</h3>
        <p className="text-gray-500 mt-2 text-center max-w-md">
          完成你的第一次模擬面試，獲取詳細分析和進步趨勢報告。
        </p>
        <button className="mt-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-400 text-white rounded-full hover:shadow-lg transition-all">
          開始模擬面試
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">面試表現儀表板</h1>
          <p className="text-gray-600">
            查看你的面試表現數據、進步趨勢和個性化改進建議
          </p>
        </div>

        <div className="flex gap-2">
          <select
            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="month">過去一個月</option>
            <option value="3months">過去三個月</option>
            <option value="6months">過去六個月</option>
            <option value="year">過去一年</option>
            <option value="all">所有時間</option>
          </select>

          <button className="bg-gradient-to-r from-amber-500 to-orange-400 text-white rounded-md px-4 py-1.5 text-sm hover:shadow-md transition-shadow">
            新面試
          </button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 ${
                activeTab === "overview"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              概覽
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 ${
                activeTab === "progress"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("progress")}
            >
              進步趨勢
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 ${
                activeTab === "strengths"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("strengths")}
            >
              強弱項分析
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 ${
                activeTab === "industry"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("industry")}
            >
              行業對比
            </button>
          </li>
          <li>
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 ${
                activeTab === "history"
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("history")}
            >
              面試歷史
            </button>
          </li>
        </ul>
      </div>

      {/* Dashboard Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100">
                <h3 className="text-gray-500 text-sm font-medium">
                  總面試次數
                </h3>
                <p className="text-3xl font-bold text-gray-800">
                  {userData.totalInterviews}
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100">
                <h3 className="text-gray-500 text-sm font-medium">平均分數</h3>
                <p className="text-3xl font-bold text-gray-800">
                  {userData.averageScore}/100
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  行業基準: {userData.industryBenchmark}/100
                </p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100">
                <h3 className="text-gray-500 text-sm font-medium">進步率</h3>
                <p className="text-3xl font-bold text-green-600">
                  +{userData.improvementRate}%
                </p>
                <p className="text-xs text-gray-500 mt-1">相比三個月前</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-100">
                <h3 className="text-gray-500 text-sm font-medium">上次面試</h3>
                <p className="text-3xl font-bold text-gray-800">
                  {filteredInterviews.length > 0
                    ? new Date(
                        filteredInterviews[filteredInterviews.length - 1].date,
                      ).toLocaleDateString("zh-TW")
                    : "無"}
                </p>
              </div>
            </div>

            {/* Progress Chart */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                分數趨勢
              </h3>
              <div className="h-72 bg-gray-50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={prepareProgressChartData()}>
                    <defs>
                      <linearGradient
                        id="colorScore"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#e6b17a"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#e6b17a"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}分`, "分數"]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        border: "none",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#e6b17a"
                      fillOpacity={1}
                      fill="url(#colorScore)"
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      stroke="#aaa"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skills Radar Chart */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                能力評分分佈
              </h3>
              <div className="h-80 bg-gray-50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="80%" data={prepareSkillRadarData()}>
                    <PolarGrid gridType="polygon" />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis
                      domain={[0, 100]}
                      tick={{ fill: "#666" }}
                      axisLine={false}
                    />
                    <Radar
                      name="分數"
                      dataKey="value"
                      stroke="#d8365d"
                      fill="#d8365d"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}分`, "分數"]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        border: "none",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">優勢</h3>
                <div className="space-y-3">
                  {userData.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="bg-green-50 border border-green-100 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">
                          {strength.category}
                        </span>
                        <span className="text-green-600 font-bold">
                          {strength.score}分
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{ width: `${strength.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">弱點</h3>
                <div className="space-y-3">
                  {userData.weaknesses.map((weakness, index) => (
                    <div
                      key={index}
                      className="bg-red-50 border border-red-100 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">
                          {weakness.category}
                        </span>
                        <span className="text-red-600 font-bold">
                          {weakness.score}分
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-red-500 h-2.5 rounded-full"
                          style={{ width: `${weakness.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Trends Tab */}
        {activeTab === "progress" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">
              長期進步趨勢分析
            </h2>

            {/* Score Trend Chart */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                分數趨勢
              </h3>
              <div className="h-80 bg-gray-50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={prepareProgressChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}分`, "分數"]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="你的分數"
                      stroke="#e6b17a"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="benchmark"
                      name="行業基準"
                      stroke="#aaa"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Skill Progression */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                能力進步跟踪
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.keys(filteredInterviews[0].scores).map(
                  (skill, index) => {
                    // Get first and last score for each skill
                    const firstScore = filteredInterviews[0].scores[skill];
                    const lastScore =
                      filteredInterviews[filteredInterviews.length - 1].scores[
                        skill
                      ];
                    const change = lastScore - firstScore;
                    const isPositive = change >= 0;

                    const skillNameMap = {
                      relevance: "回答相關性",
                      clarity: "表達清晰度",
                      confidence: "自信程度",
                      technical: "技術知識",
                      communication: "溝通技巧",
                    };

                    return (
                      <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-200 p-4"
                      >
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          {skillNameMap[skill] || skill}
                        </h4>
                        <div className="flex items-end space-x-2">
                          <span className="text-2xl font-bold text-gray-800">
                            {lastScore}
                          </span>
                          <span
                            className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
                          >
                            {isPositive ? `+${change}` : change}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full ${isPositive ? "bg-green-500" : "bg-red-500"}`}
                            style={{ width: `${lastScore}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Milestone Progress */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                里程碑進度
              </h3>
              <div className="relative">
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 absolute top-6 z-0"></div>

                {/* Milestone points */}
                <div className="flex justify-between relative z-10">
                  {[60, 70, 80, 90, 100].map((milestone, index) => {
                    const latestScore =
                      filteredInterviews[filteredInterviews.length - 1]
                        .overallScore;
                    const isAchieved = latestScore >= milestone;
                    const isNext =
                      !isAchieved &&
                      latestScore >=
                        (index > 0 ? [60, 70, 80, 90, 100][index - 1] : 0);

                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                            isAchieved
                              ? "bg-green-500 text-white"
                              : isNext
                                ? "bg-amber-500 text-white"
                                : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {milestone}
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {index === 0
                            ? "初級"
                            : index === 1
                              ? "中級"
                              : index === 2
                                ? "高級"
                                : index === 3
                                  ? "專家"
                                  : "大師"}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Fill progress bar based on latest score */}
                <div
                  className="h-4 bg-green-500 rounded-full absolute top-6 left-0 z-0"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((filteredInterviews[filteredInterviews.length - 1].overallScore - 60) / 40) * 100))}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Strengths and Weaknesses Tab */}
        {activeTab === "strengths" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">強弱項分析</h2>

            {/* Strengths and Weaknesses Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  您的優勢
                </h3>
                <div className="space-y-4">
                  {userData.strengths.map((strength, index) => (
                    <div
                      key={index}
                      className="bg-white border border-green-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-gray-800">
                          {strength.category}
                        </h4>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          {strength.score}分
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {getStrengthDescription(strength.category)}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full"
                          style={{ width: `${strength.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  需要改進的領域
                </h3>
                <div className="space-y-4">
                  {userData.weaknesses.map((weakness, index) => (
                    <div
                      key={index}
                      className="bg-white border border-red-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-gray-800">
                          {weakness.category}
                        </h4>
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          {weakness.score}分
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {getWeaknessDescription(weakness.category)}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-red-500 h-3 rounded-full"
                          style={{ width: `${weakness.score}%` }}
                        ></div>
                      </div>
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          改進建議:
                        </h5>
                        <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                          {getImprovementSuggestions(weakness.category).map(
                            (suggestion, i) => (
                              <li key={i}>{suggestion}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparison with Previous Interviews */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                能力變化追蹤
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={getSkillComparisonData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}分`, ""]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="首次面試" fill="#e6aa63" />
                    <Bar dataKey="當前水平" fill="#d8365d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Industry Comparison Tab */}
        {activeTab === "industry" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">行業標準對比</h2>

            {/* Overall Comparison */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                整體表現對比
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={prepareIndustryComparison()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="industry" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={(value) => [`${value}分`, ""]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="userScore" name="你的平均分" fill="#e6aa63" />
                    <Bar dataKey="benchmark" name="行業基準" fill="#aaaaaa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Percentile Ranking */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                行業百分位排名
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-base font-medium text-gray-700 mb-3">
                    總體表現百分位
                  </h4>
                  <div className="flex items-center justify-center h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "您的位置", value: 75, fill: "#e6aa63" },
                            { name: "剩餘", value: 25, fill: "#f3f4f6" },
                          ]}
                          cx="50%"
                          cy="50%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={0}
                          dataKey="value"
                        >
                          <Cell key={`cell-0`} fill="#e6aa63" />
                          <Cell key={`cell-1`} fill="#f3f4f6" />
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [
                            name === "您的位置" ? `前${value}%` : null,
                            name,
                          ]}
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            border: "none",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-gray-500 text-sm">
                      您的面試表現優於
                      <span className="font-bold text-amber-600">75%</span>
                      的候選人
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="text-base font-medium text-gray-700 mb-3">
                    各類能力百分位
                  </h4>
                  <div className="space-y-4">
                    {getPercentileData().map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.skill}</span>
                          <span className="font-medium text-gray-800">
                            前{item.percentile}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-500 h-2 rounded-full"
                            style={{ width: `${item.percentile}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Industry Requirements */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                行業需求與趨勢
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border-r border-gray-200 pr-4">
                    <h4 className="text-base font-medium text-gray-700 mb-2">
                      核心能力需求
                    </h4>
                    <ul className="space-y-2">
                      {getIndustryRequirements().skills.map((skill, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                          <span className="text-gray-600 text-sm">{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-r border-gray-200 px-4">
                    <h4 className="text-base font-medium text-gray-700 mb-2">
                      熱門面試主題
                    </h4>
                    <ul className="space-y-2">
                      {getIndustryRequirements().topics.map((topic, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          <span className="text-gray-600 text-sm">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pl-4">
                    <h4 className="text-base font-medium text-gray-700 mb-2">
                      行業趨勢關鍵詞
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getIndustryRequirements().keywords.map(
                        (keyword, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full"
                          >
                            {keyword}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interview History Tab */}
        {activeTab === "history" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">面試歷史記錄</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      日期
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      產業
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      面試官類型
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      總分
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      行業基準
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterviews.map((interview, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(interview.date).toLocaleDateString("zh-TW")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {interview.industry}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {interview.karenType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-sm rounded-full ${
                            interview.overallScore >= 80
                              ? "bg-green-100 text-green-800"
                              : interview.overallScore >= 70
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {interview.overallScore}分
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {interview.benchmark}分
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-amber-600 hover:text-amber-900 mr-3">
                          查看詳情
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          導出報告
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Helper functions for descriptions and suggestions
  function getStrengthDescription(category) {
    const descriptions = {
      溝通能力: "你能清晰地表達自己的想法，在回答問題時結構清晰且有條理。",
      技術知識: "你在專業領域展現了紮實的知識基礎和深入理解。",
      解決問題: "你能以邏輯性和創造力解決問題，採用有效的分析方法。",
      適應能力: "你在各種情境下都能保持冷靜，迅速調整策略。",
      領導能力: "你善於引導團隊，並能有效分配資源達成目標。",
    };
    return (
      descriptions[category] || "你在此方面表現優異，能夠充分展示相關能力。"
    );
  }

  function getWeaknessDescription(category) {
    const descriptions = {
      處理壓力: "在高壓情境下，你的回答可能缺乏結構性和深度。",
      結構化回答: "你的回答有時缺乏明確的開始、中間和結束結構。",
      具體例子: "在回答中缺少足夠的具體例子來支持你的觀點。",
      時間管理: "你的回答有時過長或過短，未能在適當時間內表達主要觀點。",
      反問技巧: "在面試中較少主動提問或與面試官互動。",
    };
    return descriptions[category] || "這個領域有提升空間，需要更多練習和準備。";
  }

  function getImprovementSuggestions(category) {
    const suggestions = {
      處理壓力: [
        "練習在時間限制下回答問題",
        "準備應對意外問題的策略",
        "學習深呼吸和放鬆技巧",
        "多參加模擬壓力面試練習",
      ],
      結構化回答: [
        "使用STAR方法(情境-任務-行動-結果)來組織回答",
        "確保每個回答有明確的開始、中間和結束",
        "準備結構化的回答模板",
        "練習簡潔明了地總結主要觀點",
      ],
      具體例子: [
        "為每個主要技能準備2-3個具體的工作例子",
        "使用數據和指標來量化你的成就",
        "練習講述有細節但不冗長的故事",
        "建立個人成就資料庫以便快速回憶",
      ],
      時間管理: [
        "練習在90秒內完成標準問題回答",
        "錄製並計時你的回答以找出冗長部分",
        "識別並消除回答中的贅述",
        "設定明確的回答結構以防止偏題",
      ],
      反問技巧: [
        "準備3-5個針對公司或職位的智慧問題",
        "學習識別提問的最佳時機",
        "練習將提問與你的技能和經驗相連",
        "研究如何通過提問展示你的研究和興趣",
      ],
    };
    return (
      suggestions[category] || [
        "進行更多有針對性的練習",
        "尋求專業指導和反饋",
        "觀看或學習優秀面試者的表現",
        "制定明確的改進計劃和目標",
      ]
    );
  }

  function getSkillComparisonData() {
    if (filteredInterviews.length < 2) return [];

    const firstInterview = filteredInterviews[0];
    const latestInterview = filteredInterviews[filteredInterviews.length - 1];

    return [
      {
        name: "相關性",
        首次面試: firstInterview.scores.relevance,
        當前水平: latestInterview.scores.relevance,
      },
      {
        name: "清晰度",
        首次面試: firstInterview.scores.clarity,
        當前水平: latestInterview.scores.clarity,
      },
      {
        name: "自信心",
        首次面試: firstInterview.scores.confidence,
        當前水平: latestInterview.scores.confidence,
      },
      {
        name: "技術性",
        首次面試: firstInterview.scores.technical,
        當前水平: latestInterview.scores.technical,
      },
      {
        name: "溝通力",
        首次面試: firstInterview.scores.communication,
        當前水平: latestInterview.scores.communication,
      },
    ];
  }

  function getPercentileData() {
    return [
      { skill: "相關性", percentile: 82 },
      { skill: "清晰度", percentile: 75 },
      { skill: "自信心", percentile: 68 },
      { skill: "技術知識", percentile: 88 },
      { skill: "溝通能力", percentile: 72 },
    ];
  }

  function getIndustryRequirements() {
    // This would ideally come from an API based on the user's target industry
    return {
      skills: [
        "問題解決能力",
        "團隊協作",
        "溝通表達",
        "批判性思維",
        "適應變化能力",
      ],
      topics: [
        "跨部門協作經驗",
        "遠程工作效率",
        "技術轉型案例",
        "危機處理能力",
        "持續學習態度",
      ],
      keywords: [
        "數據驅動",
        "敏捷開發",
        "用戶體驗",
        "系統思維",
        "設計思考",
        "跨文化溝通",
        "領導力",
        "創新思維",
      ],
    };
  }
};

export default InterviewDashboard;
