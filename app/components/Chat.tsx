import { useState } from 'react';

export default function Chat() {
  const [userInput, setUserInput] = useState('');

  async function handleSubmit() {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userInput }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      // 處理回應...
      
    } catch (error) {
      console.error('Error in chat:', error);
      // 顯示錯誤信息給用戶
    }
  }

  return (
    <div>
      {/* 添加你的 JSX */}
    </div>
  );
} 