/**
 * API utility functions for working with Teknorix Jobsoid endpoints.
 *
 * The API returns lists of job openings and details for individual job openings.
 * Filters can be applied when fetching the list to perform server-side search.
 */

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  function: string;
  description: string;
  applyUrl: string;
}

export interface JobFilters {
  search?: string;
  department?: string;
  location?: string;
  function?: string;
}

const BASE_URL = "https://teknorix.jobsoid.com/api/v1";

/**
 * Generic helper to perform a GET request and parse the JSON response.
 * Replace or extend the headers to include authentication if required.
 */
async function fetchJSON<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      // If the API requires authentication, add the Authorization header here.
      // 'Authorization': `Bearer ${YOUR_API_TOKEN}`
    },
  });
  if (!response.ok) {
    throw new Error(
      `Error fetching ${url}: ${response.status} ${response.statusText}`
    );
  }
  return response.json() as Promise<T>;
}

/**
 * Convert nested objects (department, location, function) into a displayable string.
 * Tries common keys (title, name, label) and falls back to JSON stringification.
 */
const normalize = (value: any): string => {
  if (value && typeof value === "object") {
    return value.title || value.name || value.label || JSON.stringify(value);
  }
  return value;
};

/**
 * Fetches a list of jobs from the server. Filters are appended as query
 * parameters to perform server-side filtering and searching. Returns jobs
 * with normalized department, location and function fields.
 */
export async function getJobs(filters: JobFilters = {}): Promise<Job[]> {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.department) params.append("department", filters.department);
  if (filters.location) params.append("location", filters.location);
  if (filters.function) params.append("function", filters.function);
  const url = `${BASE_URL}/jobs?${params.toString()}`;

  const rawJobs = await fetchJSON<any[]>(url);

  return rawJobs.map((job) => ({
    ...job,
    department: normalize(job.department),
    location: normalize(job.location),
    function: normalize(job.function),
  })) as Job[];
}

/**
 * Fetches a single job opening by its identifier. Normalizes nested fields.
 */
export async function getJobById(id: number | string): Promise<Job> {
  const url = `${BASE_URL}/jobs/${id}`;
  const job: any = await fetchJSON<any>(url);

  return {
    ...job,
    department: normalize(job.department),
    location: normalize(job.location),
    function: normalize(job.function),
  } as Job;
}
