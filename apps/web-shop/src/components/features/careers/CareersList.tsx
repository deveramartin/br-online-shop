"use client";

import { useState, useEffect } from "react";
import { careersApi } from "@/lib/api/careers-api";
import type { JobPosting } from "@/types/careers";
import { JobPostingCard } from "./JobPostingCard";
import { JobApplicationDialog } from "./JobApplicationDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CareersList() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchJobs = () => {
    setLoading(true);
    setError(null);
    careersApi.getJobs()
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to load open positions.";
        setError(message);
        setLoading(false);
      });
  };

  useEffect(() => {
    careersApi.getJobs()
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to load open positions.";
        setError(message);
        setLoading(false);
      });
  }, []);

  const departments = ["All", ...Array.from(new Set(jobs.map((job) => job.Department || job.department)))];

  const filteredJobs = selectedDept === "All"
    ? jobs
    : jobs.filter((job) => (job.Department || job.department) === selectedDept);

  const handleApplyClick = (job: JobPosting) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Department Tabs */}
      {!loading && !error && jobs.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-300 ${
                selectedDept === dept
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      )}

      {/* Main List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="border border-slate-100 rounded-3xl p-6 space-y-4 bg-white/50">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-6 w-3/4 rounded-lg" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-slate-100 rounded-3xl bg-white/50">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            {error}
          </p>
          <Button onClick={fetchJobs} variant="outline" className="mt-4 rounded-xl text-xs font-bold border-slate-200">
            Try Again
          </Button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-slate-100 rounded-3xl bg-white/50">
          <Building2 className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-sm font-bold text-slate-800">
            No open positions found.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Check back later or follow us for updates.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <JobPostingCard
              key={job.id || job.Id}
              job={job}
              onApply={handleApplyClick}
            />
          ))}
        </div>
      )}

      <JobApplicationDialog
        job={selectedJob}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
