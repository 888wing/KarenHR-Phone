// src/lib/api/aiService.js

/**
 * 本地生成面試官回應的函數 (API失敗時的備用方案)
 * @param {Array} messages - 對話歷史
 * @param {String} personality - Karen類型
 * @param {String} language - 語言 (zh或en)
 * @returns {Object} - 生成的回應
 */
export function generateKarenResponse(messages, personality, language = "zh") {
  // 獲取語言相關的問題和回應
  const responses =
    language === "en" ? getEnglishResponses() : getChineseResponses();

  // 檢查消息數量
  const userMessages = messages.filter((m) => m.sender === "user");

  // 生成回應
  let response = "";

  // 如果是第一條消息（沒有用戶消息）
  if (userMessages.length === 0) {
    // 初始問候語
    response = responses.greeting;
  }
  // 如果是第一條用戶消息的回應
  else if (userMessages.length === 1) {
    // 根據面試官類型選擇第一個主要問題
    const firstQuestions = responses.firstQuestions;
    response = firstQuestions[personality] || firstQuestions.strict;
  }
  // 對一般問題的回應
  else if (userMessages.length >= 2) {
    // 根據面試官類型和問題生成下一個問題
    const followupQuestions = responses.followupQuestions;
    const questions =
      followupQuestions[personality] || followupQuestions.strict;
    // 根據對話進度選擇問題，避免重複
    const questionIndex = Math.min(
      (userMessages.length - 2) % questions.length,
      questions.length - 1,
    );
    response = questions[questionIndex];
  } else {
    // 備用回應
    response = responses.fallback;
  }

  return {
    text: response,
    timestamp: new Date().toISOString(),
  };
}

/**
 * 計算面試進度百分比
 * @param {Array} messages - 對話歷史
 * @returns {Number} - 進度百分比 (0-100)
 */
export function calculateInterviewProgress(messages) {
  const totalQuestions = 10; // 一場面試的標準問題數

  // 計算Karen發送的消息數（第一條歡迎信息不計算）
  const karenMessages = messages.filter((m) => m.sender === "karen");
  const questionCount = karenMessages.length > 0 ? karenMessages.length - 1 : 0;

  // 防止進度超過100%
  return Math.min(100, Math.max(0, (questionCount / totalQuestions) * 100));
}

/**
 * 獲取面試得分
 * @param {Array} messages - 對話歷史
 * @param {String} language - 語言 (zh或en)
 * @returns {Object} - 面試得分和評論
 */
export function getInterviewScore(messages, language = "zh") {
  // 計算用戶回答的平均長度
  const userMessages = messages.filter((m) => m.sender === "user");
  if (userMessages.length === 0) {
    return {
      score: 0,
      comment: language === "en" ? "Interview not started yet" : "面試尚未開始",
    };
  }

  const totalLength = userMessages.reduce(
    (sum, msg) => sum + msg.text.length,
    0,
  );
  const avgLength = totalLength / userMessages.length;

  // 基於回答長度和數量計算基礎分數
  let baseScore = Math.min(
    100,
    Math.max(60, avgLength / 5 + userMessages.length * 5),
  );

  // 隨機調整，使得分數看起來更真實
  const randomAdjustment = Math.floor(Math.random() * 10) - 5; // -5 到 +4
  const finalScore = Math.min(100, Math.max(60, baseScore + randomAdjustment));

  // 根據分數生成評論
  let comment = "";

  if (language === "en") {
    if (finalScore >= 90) {
      comment =
        "Excellent interview performance! Your answers were comprehensive, specific, and demonstrated rich relevant experience.";
    } else if (finalScore >= 80) {
      comment =
        "Good performance. Most of your answers were on point, but some areas could use more detail.";
    } else if (finalScore >= 70) {
      comment =
        "Satisfactory overall, but you need to focus more on providing concrete examples and experiences in your answers.";
    } else {
      comment =
        "Your answers need to be more substantial and specific. Consider preparing more related experiences and cases.";
    }
  } else {
    if (finalScore >= 90) {
      comment = "面試表現優秀！您的回答全面、具體，並且展示了豐富的相關經驗。";
    } else if (finalScore >= 80) {
      comment =
        "表現良好。您的大部分回答都很到位，但有些地方可以提供更多細節。";
    } else if (finalScore >= 70) {
      comment = "整體表現尚可，但需要更注重在回答中提供具體的例子和經驗。";
    } else {
      comment = "您的回答需要更加充實和具體。建議準備更多相關經驗和案例。";
    }
  }

  return {
    score: finalScore,
    comment: comment,
  };
}

// 英文回應
function getEnglishResponses() {
  return {
    greeting:
      "Hello, I'm Karen, the interviewer for today. Please introduce yourself and tell me about your background and experience.",
    firstQuestions: {
      strict:
        "Thank you for your introduction. Please specifically explain which of your skills and experiences you believe are most relevant to this position.",
      detailed:
        "Thank you for that introduction. I'd like to know more details, could you describe your main responsibilities and achievements in your previous position?",
      impatient:
        "Right, let's get to the point. Can you briefly describe the most challenging problem you've solved?",
      skeptical:
        "I've listened to your background, but I need more evidence. Can you provide specific examples that prove you're suitable for this position?",
    },
    followupQuestions: {
      strict: [
        "You mentioned this experience, but I want to know what you learned from it.",
        "What role do you typically play in your teams, and why?",
        "How do you measure your own success? Can you give me a specific example?",
        "How do you handle pressure and setbacks at work? Please provide a specific example.",
        "What are your long-term career goals? How do they align with our company's development?",
        "How do you stay updated with professional knowledge? Can you share a new skill you've recently learned?",
        "Tell me about your proudest professional achievement and why it matters so much to you.",
        "If hired, how would you establish good working relationships within the team?",
        "Which of your qualities do you think are most suitable for this position? Why?",
        "When handling challenging projects, how do you ensure high-quality results?",
      ],
      detailed: [
        "That's interesting, but I need more details. How specifically did you implement this? What was the timeline?",
        "You mentioned this project was successful, what specific data or metrics can illustrate this?",
        "What specific challenges did you face in this process? How did you overcome them?",
        "How did you collaborate with team members? Please describe the specific communication and collaboration process.",
        "What tools or technologies were used in this project? Why did you choose them?",
        "How did you monitor project progress? What methods or metrics did you use?",
        "Please elaborate on your specific contributions and scope of responsibilities in this project.",
        "After the project was completed, how did you evaluate its success? What specific feedback did you receive?",
        "What lessons did you learn from this project? How have you applied them to other work?",
        "If you were to do this project again, what improvements would you make? Why?",
      ],
      impatient: [
        "Next question. What are your career goals? Keep it brief.",
        "Why our company? Don't waste time with unnecessary details.",
        "Can you adapt quickly to new environments? Give me one example.",
        "If hired, how soon can you start working? Any handover issues?",
        "Do you have any questions for me? Make it quick.",
        "Briefly describe your strongest skills. No need for detailed explanations.",
        "Have you dealt with emergencies? Example, but keep it short.",
        "Ever disagreed with your boss? How did you handle it? Get to the point.",
        "No beating around the bush, what's your expected salary range?",
        "Why did you leave your last job? Quick answer.",
      ],
      skeptical: [
        "You say you're good at problem-solving, but this example sounds ordinary. Do you have a more convincing example?",
        "You mentioned these achievements, but I find it hard to believe one person could do all this. Was there a team component?",
        "Your resume lists these skills, but how frequently and proficiently do you actually use them?",
        "This industry is competitive. What advantages do you think you have over other candidates? Give specific reasons.",
        "Is there verifiable evidence for this success case you mentioned?",
        "Do you really think your experience is sufficient for this position? Please explain why.",
        "In the project you described, were you the lead or just a participant?",
        "Do you have data or reference letters to back up these claimed achievements?",
        "Are you truly proficient in this skill? If I tested you now, what would the result be?",
        "Your understanding of this industry seems superficial. How can you prove you really understand this field?",
      ],
    },
    fallback: "Please continue sharing your relevant experiences and skills.",
  };
}

// 中文回應
function getChineseResponses() {
  return {
    greeting:
      "你好，我是今天負責面試的Karen。請先做個自我介紹，告訴我你的相關背景和經驗。",
    firstQuestions: {
      strict:
        "感謝您的自我介紹。請具體說明一下，您認為您的哪些技能和經驗與這個職位最相關？",
      detailed:
        "謝謝您的介紹。我想了解更多細節，請詳細描述您在上一個職位的主要職責和成就。",
      impatient:
        "好的，直接進入正題。您能簡單描述一下您解決過的最具挑戰性的問題嗎？",
      skeptical:
        "我看了您的背景介紹，但我需要更多證據。您能舉出具體的例子來證明您適合這個職位嗎？",
    },
    followupQuestions: {
      strict: [
        "您提到了這個經驗，但我想知道您從中學到了什麼？",
        "在您工作的團隊中，您通常扮演什麼角色？為什麼？",
        "您如何衡量自己的成功？能給我一個具體的例子嗎？",
        "您如何處理工作中的壓力和挫折？請舉一個具體的例子。",
        "您的長期職業目標是什麼？如何與我們公司的發展相符合？",
        "您如何保持專業知識的更新？能分享最近學習的新技能嗎？",
        "談談您最自豪的職業成就，為什麼它對您如此重要？",
        "如果被錄用，您如何在團隊中建立良好的工作關係？",
        "您認為自己的哪些特質最適合這個職位？為什麼？",
        "您在處理有挑戰性的項目時，如何確保高質量的結果？",
      ],
      detailed: [
        "這很有趣，但我需要更多細節。您是如何具體實施的？時間線是怎樣的？",
        "您提到這個項目很成功，有什麼具體的數據或指標可以說明嗎？",
        "在這個過程中，您面臨了哪些具體的挑戰？您是如何克服的？",
        "您是如何與團隊成員協作的？請描述一下具體的溝通和協作過程。",
        "這個項目用了哪些工具或技術？您為什麼選擇它們？",
        "您如何監控項目進度？使用了什麼方法或指標？",
        "請詳細說明您在這個項目中的具體貢獻和責任範圍。",
        "項目完成後，您如何評估其成功與否？有哪些具體的反饋？",
        "您從這個項目中學到了哪些經驗教訓？如何應用到其他工作中？",
        "如果重新做這個項目，您會有哪些改進？為什麼？",
      ],
      impatient: [
        "好的，下一個問題。您的職業目標是什麼？請簡潔回答。",
        "為什麼選擇我們公司？不要說太多廢話。",
        "您能迅速適應新環境嗎？給我一個實例。",
        "如果被錄用，您能多快開始工作？有什麼需要交接的嗎？",
        "您有什麼問題想問我？請快速說明。",
        "簡短說明您最擅長的技能。不需要詳細解釋。",
        "您處理過緊急情況嗎？舉個例子，但請簡短。",
        "您和上司有過不同意見嗎？您怎麼處理的？直接說重點。",
        "不要拐彎抹角，您期望的薪資範圍是多少？",
        "您為什麼離開上一份工作？快速回答。",
      ],
      skeptical: [
        "您說您擅長解決問題，但這個例子聽起來很普通。您有更有說服力的例子嗎？",
        "您提到了這些成就，但我難以相信一個人能做這麼多。是否有團隊合作的成分？",
        "您的履歷上寫了這些技能，但您實際使用的頻率和熟練度如何？",
        "這個行業競爭激烈，您認為自己比其他候選人有什麼優勢？請給出具體的理由。",
        "您提到的這個成功案例，有可驗證的證據嗎？",
        "您真的認為您的經驗足夠勝任這個職位嗎？請解釋原因。",
        "在您描述的這個項目中，您是主導還是只是參與者？",
        "您聲稱的這些成就，有沒有可以證明的數據或推薦信？",
        "這個技能您真的精通嗎？如果我現在測試您，結果會如何？",
        "您對這個行業的理解似乎很淺顯，您如何證明您真正了解這個行業？",
      ],
    },
    fallback: "請繼續分享您的相關經驗和技能。",
  };
}
