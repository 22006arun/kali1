import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import toast from 'react-hot-toast';

interface UserProfile {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  signup: (email: string, password: string, name: string, phone?: string, address?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserProfile = async (user: User, additionalData: any = {}) => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const { name, phone, address, role = 'user' } = additionalData;
      const profileData = {
        uid: user.uid,
        email: user.email,
        name,
        phone,
        address,
        role,
        createdAt: new Date()
      };
      
      await setDoc(userRef, profileData);
      setUserProfile(profileData);
    } else {
      setUserProfile(userDoc.data() as UserProfile);
    }
  };

  const signup = async (email: string, password: string, name: string, phone?: string, address?: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(user, { name, phone, address, role: 'user' });
      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        if (profile.role !== 'user') {
          throw new Error('Invalid user credentials');
        }
        setUserProfile(profile);
      }
      toast.success('Welcome back!');
    } catch (error: any) {
      toast.error('Invalid credentials');
      throw error;
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        if (profile.role !== 'admin') {
          throw new Error('Admin access required');
        }
        setUserProfile(profile);
      } else {
        throw new Error('Admin profile not found');
      }
      toast.success('Admin login successful!');
    } catch (error: any) {
      toast.error('Invalid admin credentials');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    adminLogin,
    logout,
    loading,
    isAdmin: userProfile?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};