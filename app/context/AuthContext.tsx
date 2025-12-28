import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, googleProvider, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUserToFirestore = async (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, "users", firebaseUser.uid);
    await setDoc(
      userRef,
      {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName:
          firebaseUser.displayName || firebaseUser.email?.split("@")[0],
        photoURL:
          firebaseUser.photoURL ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${firebaseUser.email}`,
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserToFirestore(result.user);
      }
    } catch (error) {
      console.error("Google Sign-In Error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await syncUserToFirestore(result.user);
      }
    } catch (error) {
      console.error("Login Error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await syncUserToFirestore(result.user);
      }
    } catch (error) {
      console.error("Signup Error", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error("Sign-Out Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOutUser,
        loginWithEmail,
        signUpWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
