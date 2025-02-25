
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [interviewState, setInterviewState] = useState({
    industry: '',
    karenType: '',
    messages: [],
  });

  return (
    <AppContext.Provider value={{ interviewState, setInterviewState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
