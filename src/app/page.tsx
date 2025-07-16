"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, Cloud, ImageIcon, Trash2, Download, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface UploadedFile {
  id: string
  name: string
  size: string
  url: string
  uploadProgress: number
}

export default function CloudStorage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginCode, setLoginCode] = useState("")
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogin = () => {
    if (loginCode.length === 4) {
      setIsLoggedIn(true)
    }
  }

  const handleFileUpload = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    Array.from(selectedFiles).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          url: URL.createObjectURL(file),
          uploadProgress: 0,
        }

        setFiles((prev) => [...prev, newFile])

        // Simulate upload progress
        const interval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => (f.id === newFile.id ? { ...f, uploadProgress: Math.min(f.uploadProgress + 10, 100) } : f)),
          )
        }, 100)

        setTimeout(() => clearInterval(interval), 1000)
      }
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const deleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="bg-gray-900 border-gray-800 p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Cloud className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-white text-center mb-2"
            >
              Welcome Back
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-center mb-8"
            >
              Enter your 4-digit access code
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <Input
                type="password"
                placeholder="••••"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value.slice(0, 4))}
                className="bg-gray-800 border-gray-700 text-white text-center text-2xl tracking-widest h-14"
                maxLength={4}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />

              <Button
                onClick={handleLogin}
                disabled={loginCode.length !== 4}
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
              >
                <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Access Storage
                </motion.span>
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-800 p-6"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">Personal Cloud</h1>
          </div>

          <Button onClick={() => setIsLoggedIn(false)} variant="ghost" className="text-gray-400 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragging ? "border-purple-500 bg-purple-500/10" : "border-gray-700 hover:border-gray-600"
            }`}
          >
            <motion.div animate={{ scale: isDragging ? 1.05 : 1 }} transition={{ type: "spring", stiffness: 300 }}>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Drop your images here</h3>
              <p className="text-gray-400 mb-6">or click to browse files</p>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Choose Files
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Files Grid */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img src={file.url || "/placeholder.svg"} alt={file.name} className="w-full h-full object-cover" />

                    {file.uploadProgress < 100 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-medium truncate mb-1">{file.name}</h4>
                    <p className="text-sm text-gray-400 mb-3">{file.size}</p>

                    {file.uploadProgress < 100 ? (
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${file.uploadProgress}%` }}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        />
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost" className="flex-1 text-gray-400 hover:text-white">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteFile(file.id)}
                          className="flex-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {files.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No images yet</h3>
            <p className="text-gray-500">Upload your first image to get started</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
