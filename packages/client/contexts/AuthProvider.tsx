import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import API from "@client/api";

type AuthContextType = {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  isVerified: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>(undefined);

type Props = {
  children: ReactNode;
};

function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.get("/api/verify")
      .then((response) => {
        console.log("response: ", response.data);

        setIsVerified(true);
        setCurrentUser(response.data.user);
      })
      .catch((err) => {
        setIsVerified(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const value = useMemo(() => {
    return { currentUser, setCurrentUser, isVerified, isLoading };
  }, [currentUser, isVerified, isLoading]);

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
