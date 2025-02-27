import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [timeRange, setTimeRange] = useState('3months');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);

      try {
        // In a real implementation, this would fetch data from an API
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock data
        const mockInterviews = generateMockInterviews();
        setInterviews(mockInterviews);

        // Apply initial filters
        applyFilters(mockInterviews, timeRange, industryFilter, sortOrder);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching interview history:", error);
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters(interviews, timeRange, industryFilter, sortOrder);
  }, [timeRange, industryFilter, sortOrder, interviews]);

  // Function to apply filters
  const applyFilters = (allInterviews, time, industry, order) => {
    if (!allInterviews.length) return;

    // Apply time filter
    let filtered = allInterviews;

    if (time !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();

      switch (time) {
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(
        interview => new Date(interview.date) >= cutoffDate
      );
    }

    // Apply industry filter
    if (industry !== 'all') {
      filtered = filtered.filter(
        interview => interview.industry === industry
      );
    }

    // Apply sort order
    filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return order === 'newest' 
        ? dateB - dateA  // newest first
        : dateA - dateB; // oldest first
    });

    setFilteredInterviews(filtered);
  };

  // Generate mock interviews
  const generateMockInterviews = () => {
    const interviews = [];
    const now = new Date();
    const industries = ['科技', '金融', '醫療', '教育', '零售'];
    const karenTypes = ['嚴格型', '細節型', '急躁型', '質疑型'];

    // Generate 20 mock interviews
    for (let i = 0; i < 20; i++) {
      const interviewDate = new Date(now);
      interviewDate.setDate(now.getDate() - i * 7); // One interview per week

      // Simulate gradual improvement
      const baseScore = 65;
      const improvement = Math.min(30, Math.floor(i / 2) * 2.5);
      const randomVariation = Math.random() * 10 - 5;

      const industry = industries[Math.floor(Math.random() * industries.length)];

      interviews.push({
        id: `interview-${i}`,
        date: interviewDate.toISOString(),
        formattedDate: interviewDate.toLocaleDateString('zh-TW'),
        industry: industry,
        karenType: karenTypes[Math.floor(Math.random() * karenTypes.length)],
        duration: `${15 + Math.floor(Math.random() * 20)}分鐘`,
        questionCount: 5 + Math.floor(Math.random() * 6),
        overallScore: Math.round(baseScore + improvement + randomVariation),
        industry_benchmark: Math.round(70 + Math.random() * 10 - 5),
        strengths: generateRandomStrengths(),
        weaknesses: generateRandomWeaknesses()
      });
    }

    return interviews;
  };

  // Helper functions to generate random strengths and weaknesses
  const generateRandomStrengths = () => {
    const strengths = [
      '溝通能力', '技術知識', '解決問題', '邏輯思維', '結構化回答', 
      '自信程度', '適應能力', '專業態度', '團隊協作', '創新思維'
    ];

    // Select 2-3 random strengths
    const count = 2 + Math.floor(Math.random() * 2);
    const shuffled = [...strengths].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const generateRandomWeaknesses = () => {
    const weaknesses = [
      '處理壓力', '具體例子', '時間管理', '反問技巧', '專業詞彙', 
      '表達節奏', '成就量化', '回答深度', '行業知識', '聆聽技巧'
    ];

    // Select 1-2 random weaknesses
    const count = 1 + Math.floor(Math.random() * 2);
    const shuffled = [...weaknesses].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Get unique industries for the filter
  const getUniqueIndustries = () => {
    if (!interviews.length) return [];

    const industries = new Set(interviews.map(interview => interview.industry));
    return Array.from(industries);
  };

  // Prepare data for the progress chart
  const prepareProgressChartData = () => {
    // Clone and sort by date ascending
    const sortedInterviews = [...filteredInterviews]
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return sortedInterviews.map(interview => ({
      date: new Date(interview.date).toLocaleDateString('zh-TW', {month: 'short', day: 'numeric'}),
      score: interview.overallScore,
      benchmark: interview.industry_benchmark
    }));
  };

  // Handle click on interview
  const handleInterviewClick = (interviewId) => {
    // In a real application, this would navigate to the interview detail page
    console.log("Viewing interview details for:", interviewId);
    alert(`查看面試 ${interviewId} 的詳細分析`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-full"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-4">加載面試歷史記錄中...</div>
      </div>
    );
  }

  // Empty state
  if (!interviews.length) {
    return (
      <div className="w-full bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="text-3xl text-gray-400 mb-2">📋</div>
        <h3 className="text-lg font-medium text-gray-600">尚無面試記錄</h3>
        <p className="text-gray-500 mt-2 mb-4">完成你的第一次模擬面試，獲取評分和分析。</p>
        <button className="bg-gradient-to-r from-amber-500 to-orange-400 text-white rounded-lg px-4 py-2 text-sm hover:shadow-md transition-shadow">
          開始模擬面試
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">面試歷史記錄</h1>
        <p className="text-gray-600">查看你的面試歷史和進步趨勢</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">時間範圍</label>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">產業</label>
            <select 
              className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="all">所有產業</option>
              {getUniqueIndustries().map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
            <select 
              className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">最新優先</option>
              <option value="oldest">最舊優先</option>
            </select>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">表現趨勢</h2>

        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={prepareProgressChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value) => [`${value}分`, '']}
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: 'none'
                }}
              />
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

      {/* Interview List */}
      <div className="bg-white rounded-lg shadow-sm p-4