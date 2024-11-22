"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function FileUpload({ onFileSelect, selectedFile }) {
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileSelect(file)
    }
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf"
      />
      <Button
        variant="outline"
        className="w-full h-auto py-4 flex flex-col gap-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-6 w-6" />
        <span>Select PDF</span>
      </Button>
    </div>
  )
}