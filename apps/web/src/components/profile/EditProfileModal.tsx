"use client";

import { useState, useEffect } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";
import { useTranslations } from "next-intl";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, username: string) => void;
  initialName: string;
  initialUsername: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  initialName,
  initialUsername,
}: EditProfileModalProps) {
  const t = useTranslations("Profile.edit");
  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setUsername(initialUsername);
    }
  }, [isOpen, initialName, initialUsername]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-dark w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">{t("title")}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400"
          >
            <MaterialIcon name="close" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-400">
              {t("name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background-dark text-white rounded-2xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-400">
              {t("username")}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-background-dark text-white rounded-2xl px-4 py-3 border border-slate-700 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="p-4 flex items-center justify-end gap-3 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full font-bold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => onSave(name, username)}
            className="px-6 py-3 rounded-full font-bold text-white bg-primary hover:bg-primary-hover transition-colors shadow-glow"
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
