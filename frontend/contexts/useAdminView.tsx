"use client";

import React, { createContext, useContext } from "react";
import { useContract } from "./useContract";


const AdminViewContext = createContext<any>(null);

/**
 * AdminViewProvider component
 * This is a context for the admin view
 * @param {*} children The children components
 * @returns {Object} The AdminViewProvider component
 */
const AdminViewProvider = ({ children }: { children: React.ReactNode }) => {
  const { write } = useContract();

  const exposed = {

  };

  return (
    <AdminViewContext.Provider value={exposed}>
      {children}
    </AdminViewContext.Provider>
  );
};

const useAdminView = () => useContext(AdminViewContext);

export { AdminViewContext, AdminViewProvider, useAdminView };