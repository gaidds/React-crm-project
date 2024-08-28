import { createContext, useContext, useState } from 'react';

// interface MyContextData {
//   screen: string;
//   drawerWidth: number;
  // count: number;
  // updateCount: (newCount: number) => void;
// }
interface MyContextData {
  userRole: string | null;
  setUserRole: (role: string | null) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
  profileId: string | null;
  setProfileId: (id: string | null) => void;
}

const MyContext = createContext<any>(undefined);

export const MyContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  return (
      <MyContext.Provider value={{  userRole, setUserRole, userId, setUserId, profileId, setProfileId}}>
          {children}
      </MyContext.Provider>
  );
};


export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('');
  }
  return context;
};

export default MyContext;
