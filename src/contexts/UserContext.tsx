import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
}

const defaultProfile: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('patient_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem('patient_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
