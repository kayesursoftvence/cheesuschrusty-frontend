"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-provider"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "it" : "en"
    setLanguage(newLanguage)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative cursor-pointer"
      onClick={toggleLanguage}
      title={`Switch to ${language === "en" ? "Italian (IT)" : "English (EN)"}`}
    >
      <span className="text-sm font-semibold">
        {language === "en" ? "EN" : "IT"}
      </span>
      <span className="sr-only">Toggle language</span>
    </Button>
  )
}

