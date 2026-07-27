import { createContext, useState } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [student, setStudent] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        student,
        setStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;