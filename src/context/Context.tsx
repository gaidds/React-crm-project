import { createContext, useContext, useState } from 'react';
import { MyContextData, UserDataProps } from './types';

const MyContext = createContext<MyContextData | undefined>(undefined);

export const MyContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [drawerWidth, setDrawerWidth] = useState(200);
  const [userData, setUserData] = useState<UserDataProps>();
  const [screen, setScreen] = useState('deals');
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  return (
    <MyContext.Provider
      value={{
        drawerWidth,
        screen,
        userRole,
        setUserRole,
        userId,
        setUserId,
        profileId,
        setProfileId,
        userData,
        setUserData,
      }}
    >
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
