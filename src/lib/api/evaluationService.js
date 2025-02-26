export const evaluateInterview = async (messages, context) => {
  // 模擬評估
  return {
    score: 85,
    feedback: "整體表現不錯"
  };
};

export const saveEvaluationResult = async (userId, sessionId, result) => {
  // 模擬儲存結果
  console.log("儲存評估結果:", result);
}; 