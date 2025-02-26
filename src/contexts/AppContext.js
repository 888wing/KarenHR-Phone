// src/contexts/AppContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [interviewState, setInterviewState] = useState({
    industry: "",
    karenType: "",
    isPremium: false,
    messages: [],
    score: null,
  });

  const [user, setUser] = useState({
    isLoggedIn: false,
    isPremium: false,
    name: "Guest",
  });

  // Karen personality definitions
  const karenPersonalities = {
    strict: {
      name: "Karen",
      tone: "嚴格且直接，不喜歡模糊的回答",
      questions: [
        "你為什麼想加入我們公司？請具體說明。",
        "描述一下你過去工作中最具挑戰性的項目，你是如何解決的？",
        "你認為你的技能和經驗如何符合這個職位的要求？請舉例說明。",
        "你如何處理工作中的衝突和壓力？給我一個具體的例子。",
        "如果我們現在聘用你，你能為團隊帶來什麼？",
      ],
    },
    detailed: {
      name: "Karen",
      tone: "非常注重細節，會不斷追問細節",
      questions: [
        "請詳細說明你在上一份工作中的日常職責，包括你使用的工具和流程。",
        "你提到你有相關經驗，請具體描述一下你做了什麼，使用了哪些技術，花了多長時間？",
        "關於你提到的項目，能否詳細說明你的具體貢獻，以及你如何測量你的成功？",
        "你說你擅長解決問題，請給我一個具體的例子，包括問題的背景，你的解決步驟和最終結果。",
        "對於這個職位所需的技能X，你有多少年經驗？你最後一次使用是什麼時候？用在什麼項目上？",
      ],
    },
    impatient: {
      name: "Karen",
      tone: "急躁且缺乏耐心，喜歡簡短直接的回答",
      questions: [
        "簡單說明為什麼我們應該聘用你而不是其他候選人？",
        "你能快速總結一下你的主要技能嗎？不要說太多。",
        "你的職業目標是什麼？請簡短回答。",
        "你能在多短時間內開始工作？",
        "有什麼問題想問我嗎？請保持簡短。",
      ],
    },
    skeptical: {
      name: "Karen",
      tone: "質疑一切，總是懷疑你的能力和經驗",
      questions: [
        "你的履歷中說你擅長X，但我不太確信。你能證明這一點嗎？",
        "你說你在前公司取得了很大成就，有任何具體數據可以支持這一說法嗎？",
        "這個項目聽起來不是很複雜，你為什麼認為這展示了你的能力？",
        "你聲稱你有很強的團隊協作能力，但你提到的例子似乎都是個人成就。這是為什麼？",
        "你的技術能力似乎沒有我們需要的那麼深入，你認為你真的適合這個職位嗎？",
      ],
    },
  };

  // Industries
  const industries = [
    { id: "tech", name: "科技業" },
    { id: "finance", name: "金融業" },
    { id: "healthcare", name: "醫療保健" },
    { id: "education", name: "教育業" },
    { id: "retail", name: "零售業" },
  ];

  // Function to start a new interview
  const startInterview = (industry, karenType) => {
    setInterviewState({
      industry,
      karenType,
      isPremium: user.isPremium,
      messages: [],
      score: null,
    });
  };

  // Function to add a message to the conversation
  const addMessage = (message) => {
    setInterviewState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };

  // Function to calculate score (placeholder)
  const calculateScore = () => {
    // In a real implementation, this would analyze the conversation
    // For now, return a random score between 70 and 100
    const score = Math.floor(Math.random() * 30) + 70;

    setInterviewState((prev) => ({
      ...prev,
      score,
    }));

    return score;
  };

  const value = {
    interviewState,
    setInterviewState,
    user,
    setUser,
    karenPersonalities,
    industries,
    startInterview,
    addMessage,
    calculateScore,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
