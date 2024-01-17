import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  currentUser: any;
  setCurrentUser: (user: any) => void;
};

const AuthContext = createContext<AuthContextType>(undefined);

type Props = {
  children: ReactNode;
};

export const AuthState = {
  UNVERIFIED: "unverified",
  VERIFYING: "verifying",
  AUTHENTICATING: "authenticating",
  VERIFIED: "verified",
};

function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios
      .get("/api/user")
      .then((res) => {
        console.log("user found", res);
        setCurrentUser(res.data.user);
      })
      .catch((err) => {
        console.log("navigating to login");
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get("/api/auth/verify")
  //     .then((res) => {
  //       if (res.data.status === "success") {
  //         setCurrentUser(res.data.user);
  //       }
  //       setAuthState(AuthState.VERIFIED);
  //     })
  //     .catch((err) => {
  //       setCurrentUser(null);
  //       setAuthState(AuthState.UNVERIFIED);
  //     });
  // }, [currentUser]);

  const value = useMemo(() => {
    return { currentUser, setCurrentUser };
  }, [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}

export default AuthProvider;
