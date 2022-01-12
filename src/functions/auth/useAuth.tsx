import React from 'react';
import authContext from "./authContext";

// useAuth hook
// returns authContext

export const useAuth = () => React.useContext(authContext);
