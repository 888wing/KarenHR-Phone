// src/lib/data/industryKeywords.js
export function getIndustryKeywords(industry, position) {
  // 各行業的關鍵詞庫
  const keywordsByIndustry = {
    tech: [
      'algorithm', '算法', 'API', 'backend', '後端', 'cloud', '雲服務', 'data structure',
      '數據結構', 'database', '數據庫', 'frontend', '前端', 'UX', 'UI', 'framework',
      '框架', 'architecture', '架構', 'scalability', '可擴展性', 'microservices', '微服務'
    ],
    finance: [
      'ROI', '投資回報率', 'asset', '資產', 'portfolio', '投資組合', 'liquidity', '流動性',
      'leverage', '槓桿', 'hedge', '對沖', 'derivative', '衍生品', 'equity', '股權',
      'valuation', '估值', 'risk management', '風險管理'
    ],
    healthcare: [
      'patient care', '病患護理', 'diagnosis', '診斷', 'treatment', '治療', 'clinical',
      '臨床', 'medical record', '病歷', 'protocol', '協議', 'wellness', '健康',
      'preventive', '預防性', 'therapeutic', '治療性'
    ],
    education: [
      'curriculum', '課程', 'assessment', '評估', 'pedagogy', '教學法', 'learning outcome',
      '學習成果', 'engagement', '參與度', 'instruction', '指導', 'differentiation',
      '差異化教學', 'rubric', '評分標準'
    ],
    retail: [
      'customer experience', '顧客體驗', 'merchandising', '商品陳列', 'inventory', '庫存',
      'POS', '銷售點', 'conversion rate', '轉化率', 'foot traffic', '客流量',
      'omnichannel', '全渠道', 'visual merchandising', '視覺營銷'
    ]
  };

  // 返回行業詞庫或默認詞庫
  return keywordsByIndustry[industry] || [];
}
```