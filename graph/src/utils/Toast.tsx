import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import Toast from "bootstrap/js/dist/toast";

export interface ToastMessage {
  title: string;
  message: string[];
}

interface ToastMessageProps {
  toastData: ToastMessage | null;
}

interface ToastContextType {
  toastData: ToastMessage | null;
  setToastData: React.Dispatch<React.SetStateAction<ToastMessage | null>>;
}
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toastData, setToastData] = useState<ToastMessage | null>(null);

  return (
    <ToastContext.Provider value={{ toastData, setToastData }}>
      {children}
    </ToastContext.Provider>
  );
};


export function ToastMessage({ toastData }: ToastMessageProps) {
  useEffect(() => {
    const toastEl = document.getElementById("liveToast");
    if (toastEl) {
      const toast = new Toast(toastEl, {
        autohide: true,
        delay: 60000,
        animation: true,
      });
      toast.show();
    }
  }, [toastData]);

  if (!toastData) return null;
  console.log(toastData);
  return (
    <div className="toast-container position-fixed top-0 end-0 p-3 ">
      <div id="liveToast" className="toast toast-border-color" role="alert" aria-live="assertive" aria-atomic="true" style={{ minWidth: "35vw" }}>
        <div className="toast-header">
          <strong className="me-auto text-warning">{toastData.title}</strong>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">
        {(() => {
  const keywords = ["Connected Accounts:", "Node Info:"];
  let useSmall = false;

  return toastData.message.map((message, index) => {
    if (message === "Accounts:") {
      useSmall = true;
      return (
        <p key={index} style={{ fontWeight: "bold", color: "cyan" }}>
          {message}
        </p>
      );
    }

    if (keywords.some(keyword => message.includes(keyword))) {
      useSmall = false;
      return (
        <p key={index} style={{ fontWeight: "bold", color: "cyan" }}>
          {message}
        </p>
      );
    }

    return useSmall ? (
      <small key={index} style={{ display: "block" }}>
        {message}
      </small>
    ) : (
      <p key={index}>{message}</p>
    );
  });
})()}
        </div>
      </div>
    </div>
  );
}