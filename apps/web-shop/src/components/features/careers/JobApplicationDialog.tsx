"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { careersApi } from "@/lib/api/careers-api";
import type { JobPosting } from "@/types/careers";
import { Loader2, UploadCloud, FileText, CheckCircle2, AlertCircle, X } from "lucide-react";

interface JobApplicationDialogProps {
  job: JobPosting | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobApplicationDialog({ job, isOpen, onClose }: JobApplicationDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!job) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate size (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit.");
      return;
    }

    // Validate extension
    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!extension || !["pdf", "doc", "docx"].includes(extension)) {
      setErrorMsg("Only PDF, DOC, or DOCX formats are allowed.");
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Full Name is required.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg("A valid Email is required.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Phone Number is required.");
      return;
    }
    if (!file) {
      setErrorMsg("Please upload your resume.");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(10);

    // Simulated premium upload progress animation
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append("JobPostingId", job.Id || job.id);
      formData.append("Name", name.trim());
      formData.append("Email", email.trim());
      formData.append("Phone", phone.trim());
      formData.append("CoverLetter", coverLetter.trim());
      formData.append("ResumeFile", file);

      await careersApi.submitApplication(formData);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setSubmitSuccess(true);
        setIsSubmitting(false);
      }, 300);

    } catch (err: unknown) {
      clearInterval(interval);
      setIsSubmitting(false);
      setUploadProgress(0);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMsg(errorMessage);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setCoverLetter("");
    setFile(null);
    setSubmitSuccess(false);
    setErrorMsg(null);
    setUploadProgress(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleReset()}>
      <DialogContent className="sm:max-w-[550px] rounded-3xl bg-white p-6 border border-border shadow-2xl overflow-y-auto max-h-[90vh]">
        {submitSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <DialogTitle className="text-2xl font-extrabold text-slate-900 mb-2">
              Application Submitted!
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 max-w-sm">
              Thank you for applying for the <strong>{job.Title || job.title}</strong> position. Our hiring team will review your resume and contact you soon.
            </DialogDescription>
            <Button onClick={handleReset} className="mt-8 px-6 bg-slate-900 text-white rounded-xl hover:bg-slate-800">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold text-slate-900">
                Apply for {job.Title || job.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {job.Department || job.department} · {job.Location || job.location} · {job.Type || job.type}
              </DialogDescription>
            </DialogHeader>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200/50 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="applicant-name" className="text-xs font-bold text-slate-700">
                    Full Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="applicant-name"
                    placeholder="e.g. Juan dela Cruz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    className="rounded-xl border-slate-200 text-slate-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="applicant-email" className="text-xs font-bold text-slate-700">
                    Email Address <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="applicant-email"
                    type="email"
                    placeholder="e.g. juan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="rounded-xl border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="applicant-phone" className="text-xs font-bold text-slate-700">
                  Phone Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="applicant-phone"
                  placeholder="e.g. +63 917 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200 text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="applicant-cover" className="text-xs font-bold text-slate-700">
                  Cover Letter / Brief Intro
                </Label>
                <Textarea
                  id="applicant-cover"
                  placeholder="Tell us briefly why you are a great fit..."
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  disabled={isSubmitting}
                  className="rounded-xl border-slate-200 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">
                  Resume / CV <span className="text-rose-500">*</span>
                </Label>
                
                {file ? (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border border-violet-100 bg-violet-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {!isSubmitting && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveFile}
                        className="w-8 h-8 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-violet-500 hover:bg-violet-50/30 transition-all duration-300 group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                    <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3 group-hover:text-violet-500 transition-colors duration-300" />
                    <p className="text-sm font-bold text-slate-800">
                      Click to upload your resume
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF, DOC, or DOCX up to 5MB
                    </p>
                  </div>
                )}
              </div>

              {isSubmitting && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Uploading Resume...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 border-slate-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
