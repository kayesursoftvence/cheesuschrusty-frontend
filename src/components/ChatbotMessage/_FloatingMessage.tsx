// components/FloatingMessage.tsx
import { createPortal } from "react-dom";
import { useEffect, useState, JSX } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaRobot,
  FaTimes,
} from "react-icons/fa";

export type MessageType = "success" | "error" | "warning" | "info" | "bot";

type FloatingMessageProps = {
  type: MessageType;
  title?: string;
  content: string;
  duration?: number;
  onDismiss: () => void;
};

const styleMap: Record<MessageType, { bg: string; border: string; icon: string; progress: string; title: string }> = {
  success: {
    bg: "from-emerald-900/90 to-emerald-800/90",
    border: "border-emerald-500/50",
    icon: "text-emerald-400",
    progress: "bg-emerald-400",
    title: "text-emerald-300",
  },
  error: {
    bg: "from-red-900/90 to-red-800/90",
    border: "border-red-500/50",
    icon: "text-red-400",
    progress: "bg-red-400",
    title: "text-red-300",
  },
  warning: {
    bg: "from-amber-900/90 to-amber-800/90",
    border: "border-amber-500/50",
    icon: "text-amber-400",
    progress: "bg-amber-400",
    title: "text-amber-300",
  },
  info: {
    bg: "from-blue-900/90 to-blue-800/90",
    border: "border-blue-500/50",
    icon: "text-blue-400",
    progress: "bg-blue-400",
    title: "text-blue-300",
  },
  bot: {
    bg: "from-violet-900/90 to-purple-800/90",
    border: "border-violet-500/50",
    icon: "text-violet-400",
    progress: "bg-violet-400",
    title: "text-violet-300",
  },
};

const iconMap: Record<MessageType, JSX.Element> = {
  success: <FaCheckCircle size={18} />,
  error: <FaExclamationCircle size={18} />,
  warning: <FaExclamationTriangle size={18} />,
  info: <FaInfoCircle size={18} />,
  bot: <FaRobot size={18} />,
};

export default function FloatingMessage(props: FloatingMessageProps): JSX.Element | null {
  const { type, title, content, duration = 5000, onDismiss } = props;
  const s = styleMap[type];

  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const [paused, setPaused] = useState(false);

  const portalRoot = document.getElementById("message-root");

  useEffect(function () {
    const t = setTimeout(function () { setVisible(true); }, 10);
    return function () { clearTimeout(t); };
  }, []);

  useEffect(function () {
    if (paused) return;

    const interval = setInterval(function () {
      setProgress(function (prev) {
        const next = prev - (50 / duration) * 100;
        if (next <= 0) {
          clearInterval(interval);
          dismiss();
          return 0;
        }
        return next;
      });
    }, 50);

    return function () { clearInterval(interval); };
  }, [paused, duration]);

  function dismiss(): void {
    setExiting(true);
    setTimeout(onDismiss, 300);
  }

  if (!portalRoot) return null;

  const toast = (
    <div
      onMouseEnter={function () { setPaused(true); }}
      onMouseLeave={function () { setPaused(false); }}
      className={
        "fixed bottom-6 right-6 z-[9999] w-[380px] max-w-[calc(100vw-3rem)] rounded-xl border backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden transition-all duration-300 ease-out bg-gradient-to-r " +
        s.bg + " " + s.border + " " +
        (visible && !exiting
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95")
      }
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        <div className={"mt-0.5 flex-shrink-0 " + s.icon}>
          {iconMap[type]}
        </div>

        <div className="flex-1 min-w-0">
          {title && (
            <p className={"text-sm font-bold mb-0.5 " + s.title}>{title}</p>
          )}
          <p className="text-sm text-gray-200 leading-relaxed break-words">
            {content}
          </p>
        </div>

        <button
          onClick={dismiss}
          className="flex-shrink-0 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
          aria-label="Dismiss"
        >
          <FaTimes size={12} />
        </button>
      </div>

      <div className="h-1 w-full bg-black/20">
        <div
          className={"h-full transition-none " + s.progress + (paused ? " opacity-50" : " opacity-80")}
          style={{ width: progress + "%" }}
        />
      </div>
    </div>
  );

  return createPortal(toast, portalRoot);
}