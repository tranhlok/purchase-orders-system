"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { X, Upload } from "lucide-react"

export function NewOrderSheet() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [requestFile, setRequestFile] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)

  const handleFileSelect = (file) => {
    if (!file) return
    const tempUrl = URL.createObjectURL(file)
    setPdfUrl(tempUrl)
    setRequestFile(file)
  }

  const handleConfirm = async () => {
    if (!requestFile) return

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('request_file', requestFile)

      const response = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Upload successful:', result)
      setOpen(false)
      
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file.type === 'application/pdf') {
      handleFileSelect(file)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>New Purchase Order</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-[1500px] sm:border-l">


        <div className="flex gap-6 h-[calc(100vh-100px)]">
          {/* Left side - PDF Preview */}
          <div className="w-[800px] border rounded">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="PDF Preview"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                PDF preview will appear here
              </div>
            )}
          </div>

          {/* Right side - Form and Upload */}
          <div className="flex-1 space-y-8 py-4 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Process Order</SheetTitle>
            </SheetHeader>
            <div 
              className="border-2 border-dashed rounded-lg p-12"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => document.querySelector('input[type="file"]').click()}
              style={{ cursor: 'pointer' }}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p>Drag PDF file here or click to upload.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload files may also be emailed directly to po@endeavorai.com and
                    accessed here after processing
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1">
                + Add Extract Field
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setPdfUrl(null)
                  setRequestFile(null)
                }}
              >
                Clear
              </Button>
            </div>

            <Button 
              className="w-full"
              variant="secondary"
              disabled={loading || !requestFile}
              onClick={handleConfirm}
            >
              {loading ? "Uploading..." : "Confirm Details"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}