// src/utils/auth.js

export const saveAuth = ({ token, username, id,role }) => {
  localStorage.setItem("auth", JSON.stringify({ token, username, id ,role}));
};

export const getAuth = () => {
  return JSON.parse(localStorage.getItem("auth"));
};

export const getToken = () => {
  const auth = getAuth();
  return auth?.token;
};

export const getUsername = () => {
  const auth = getAuth();
  return auth?.username;
};

export const getUserId = () => {
  const auth = getAuth();
  return auth?.id; 
};

export const getRole =()=> {
  const auth=getAuth();
  return auth?.role;
}

export const clearAuth = () => {
  localStorage.removeItem("auth");
};
