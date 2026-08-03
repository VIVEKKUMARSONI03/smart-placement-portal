import { createContext, useState } from "react";

export const AdminAuthContext = createContext();

function AdminAuthProvider({ children }) {

  const [admin, setAdmin] = useState(null);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        setAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export default AdminAuthProvider;