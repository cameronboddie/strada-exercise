import React, {
  createContext, ReactNode, useContext, useEffect, useState,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from './AuthContext.tsx';
import { auth } from '../firebase/firebase.ts';

interface ViewContextType {
  teams: string[];
  selectedTeam: string | null;
  setSelectedTeam: (team: string | null) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<string[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(
    () => localStorage.getItem('selectedTeam'), // Retrieve from storage on first render
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const userTeams = (idTokenResult.claims.teams as string[]) || [];

          if (Array.isArray(userTeams)) {
            setTeams(userTeams);

            // Restore selected team from storage if valid, otherwise set first team
            const storedTeam = localStorage.getItem('selectedTeam');
            if (storedTeam && userTeams.includes(storedTeam)) {
              setSelectedTeam(storedTeam);
            } else {
              const defaultTeam = userTeams.length > 0 ? userTeams[0] : null;
              setSelectedTeam(defaultTeam);
              localStorage.setItem('selectedTeam', defaultTeam ?? '');
            }
          } else {
            setTeams([]);
            setSelectedTeam(null);
            localStorage.removeItem('selectedTeam');
          }
        } catch (error) {
          console.error('Error getting custom claims:', error);
          setTeams([]);
          setSelectedTeam(null);
          localStorage.removeItem('selectedTeam');
        }
      } else {
        // Reset state when user logs out
        setTeams([]);
        setSelectedTeam(null);
        localStorage.removeItem('selectedTeam');
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Sync state to localStorage whenever selectedTeam changes
  useEffect(() => {
    if (selectedTeam) {
      localStorage.setItem('selectedTeam', selectedTeam);
    }
  }, [selectedTeam]);

  return (
    <ViewContext.Provider value={{ teams, selectedTeam, setSelectedTeam }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = (): ViewContextType => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};
