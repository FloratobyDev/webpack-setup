import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import classNames from "classnames";
import ReactDOM from "react-dom";
import RotatedCross from "@client/components/svgs/RotatedCross";

type SnackbarContextType = {
  toasts: any[];
  setToasts: (toasts: any[]) => void;
};

type ToastType = {
  id: string;
  message: string;
  type: string;
};

const SnackbarContext = createContext(undefined);

type Props = {
  children: React.ReactNode;
};

function Snackbar({ children }: Props) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const value = useMemo(() => {
    return { toasts, setToasts };
  }, [toasts]);
  return (
    <SnackbarContext.Provider value={value}>
      {ReactDOM.createPortal(
        <div className="fixed inset-0 min-w-full h-screen flex justify-center pointer-events-none py-4">
          <div className="w-[20%] flex flex-col gap-y-2">
            {toasts.map((toast) => {
              return (
                <Toast
                  id={toast.id}
                  key={toast.id}
                  message={toast.message}
                  removeToast={(id) => {
                    setToasts((prevToasts) => {
                      return prevToasts.filter(
                        (toastItem) => toastItem.id !== id,
                      );
                    });
                  }}
                  type={toast.type}
                />
              );
            })}
          </div>
        </div>,
        document.body,
      )}
      {children}
    </SnackbarContext.Provider>
  );
}

function Toast({ id, message, type, removeToast }: any) {
  const [hover, setHover] = useState(false);

  console.log("hovering over id", id, hover);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hover) return;
      removeToast(id);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [hover]);

  const divClasses = classNames(
    "px-2 py-4  pointer-events-auto rounded-smd shadow-sm border-l-4 bg-black-75 text-paragraph flex justify-between items-center w-full",
    {
      "border-green-500": type === "success",
      "border-red-500": type === "error",
    },
  );
  return (
    <div
      className={divClasses}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <p>{message}</p>
      <span
        className="p-3 hover:bg-primary-black rounded-smd cursor-pointer border-l border-primary-outline"
        onClick={() => {
          removeToast(id);
        }}
      >
        <RotatedCross black />
      </span>
    </div>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
}

export default Snackbar;
