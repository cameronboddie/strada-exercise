import React, {
  createContext, ReactNode, useContext, useEffect, useState,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useAuth } from './AuthContext.tsx';
import { auth } from '../firebase/firebase.ts';

export interface Team {
  id: string;
  name: string;
}

interface ViewContextType {
  teams: Team[];
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(() => {
    const storedTeam = localStorage.getItem('selectedTeam');
    return storedTeam ? JSON.parse(storedTeam) : null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idTokenResult = await firebaseUser.getIdTokenResult();
          const userTeams = (idTokenResult.claims.teams as { id: string; name: string }[]) || [];

          if (Array.isArray(userTeams)) {
            setTeams(userTeams);

            // Retrieve selected team from localStorage and validate it
            const storedTeam = localStorage.getItem('selectedTeam');
            const parsedStoredTeam: Team | null = storedTeam ? JSON.parse(storedTeam) : null;

            if (parsedStoredTeam && userTeams.some(team => team.id === parsedStoredTeam.id)) {
              setSelectedTeam(parsedStoredTeam);
            } else {
              const defaultTeam = userTeams.length > 0 ? userTeams[0] : null;
              setSelectedTeam(defaultTeam);
              localStorage.setItem('selectedTeam', JSON.stringify(defaultTeam));
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
      localStorage.setItem('selectedTeam', JSON.stringify(selectedTeam));
    } else {
      localStorage.removeItem('selectedTeam');
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