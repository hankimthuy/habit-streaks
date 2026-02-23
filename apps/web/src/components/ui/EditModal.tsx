"use client";

import { useState } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";

export interface EditField {
  key: string;
  label: string;
  value: string | number;
  type?: "text" | "number";
}

interface EditModalProps {
  open: boolean;
  title: string;
  fields: EditField[];
  onSave: (values: Record<string, string | number>) => void;
  onClose: () => void;
}

export default function EditModal({ open, title, fields, onSave, onClose }: EditModalProps) {
  const [values, setValues] = useState<Record<string, string | number>>(
    Object.fromEntries(fields.map((f) => [f.key, f.value]))
  );

  if (!open) return null;

  const handleSave = () => {
    onSave(values);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-dark rounded-t-3xl p-6 pb-8 animate-slide-up">
        <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <MaterialIcon name="close" className="text-lg" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {fields.map((field) => (
            <div key={field.key}>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                {field.label}
              </label>
              <input
                type={field.type ?? "text"}
                value={values[field.key] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                  }))
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-primary to-orange-500 rounded-2xl text-white font-bold text-base shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow mt-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
