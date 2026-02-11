"use client";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  
  return (
    <button
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      {lang === "en" ? "हिंदी" : "English"}
    </button>
  );
}
