import { createContext, useState } from "react";

export const CompanyAuthContext = createContext();

function CompanyAuthProvider({ children }) {
  const [company, setCompany] = useState(null);

  return (
    <CompanyAuthContext.Provider
      value={{
        company,
        setCompany,
      }}
    >
      {children}
    </CompanyAuthContext.Provider>
  );
}

export default CompanyAuthProvider;