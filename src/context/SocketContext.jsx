import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext"; // Assuming you have an AuthContext
const backendURL = import.meta.env.BACKEND_URL;

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { accessToken } = useAuth(); // Your JWT from AuthContext

  useEffect(() => {
    if (accessToken) {
      const socketInstance = io(backendURL, {
        auth: { token: accessToken },
      });

      setSocket(socketInstance);

      // Cleanup on unmount
      return () => socketInstance.close();
    }
  }, [accessToken]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};