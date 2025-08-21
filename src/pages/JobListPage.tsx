import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Input,
  Select,
  Button,
  Stack,
  Flex,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getJobs, Job, JobFilters } from "../api/jobApi";

/**
 * The JobListPage displays a list of job openings grouped by department. It includes
 * search and filter controls to allow users to narrow down the list of jobs. When
 * filters change, the list is reloaded from the server using server-side filtering.
 */
const JobListPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState<JobFilters>({});

  // Fetch jobs whenever filters change
  useEffect(() => {
    getJobs(filters)
      .then((data) => setJobs(data))
      .catch((error) => {
        console.error(error);
        setJobs([]);
      });
  }, [filters]);

  // Group jobs by department for easier rendering
  const groupedJobs = jobs.reduce<Record<string, Job[]>>((groups, job) => {
    const dept = job.department || "Other";
    if (!groups[dept]) groups[dept] = [];
    groups[dept].push(job);
    return groups;
  }, {});

  // Update a filter value. Empty strings remove the filter entirely.
  const handleFilterChange = (name: keyof JobFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  return (
    <Box p={6} maxWidth="960px" mx="auto">
      <Heading as="h1" mb={4}>
        Job Openings
      </Heading>
      {/* Search and filter controls */}
      <Stack direction={{ base: "column", md: "row" }} spacing={4} mb={6}>
        <Input
          placeholder="Search jobs"
          value={filters.search || ""}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
        <Select
          placeholder="Department"
          value={filters.department || ""}
          onChange={(e) => handleFilterChange("department", e.target.value)}
        >
          {/* Build unique list of departments from loaded jobs */}
          {Array.from(new Set(jobs.map((job) => job.department))).map(
            (dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            )
          )}
        </Select>
        <Select
          placeholder="Location"
          value={filters.location || ""}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        >
          {Array.from(new Set(jobs.map((job) => job.location))).map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Function"
          value={filters.function || ""}
          onChange={(e) => handleFilterChange("function", e.target.value)}
        >
          {Array.from(new Set(jobs.map((job) => job.function))).map((func) => (
            <option key={func} value={func}>
              {func}
            </option>
          ))}
        </Select>
      </Stack>

      {/* Applied filters shown as removable chips */}
      <Stack direction="row" spacing={2} mb={6} wrap="wrap">
        {Object.entries(filters).map(([key, value]) => {
          if (!value) return null;
          return (
            <Button
              key={key}
              size="sm"
              onClick={() => handleFilterChange(key as keyof JobFilters, "")}
            >
              {key}: {value} ✕
            </Button>
          );
        })}
      </Stack>

      {/* Job list grouped by department */}
      {Object.keys(groupedJobs).length === 0 ? (
        <Text>No job openings found.</Text>
      ) : (
        Object.entries(groupedJobs).map(([department, jobsInDept]) => (
          <Box key={department} mb={8}>
            <Heading as="h2" size="lg" mb={2}>
              {department}
            </Heading>
            {jobsInDept.map((job) => (
              <Flex
                key={job.id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                mb={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Heading as="h3" size="md">
                    {job.title}
                  </Heading>
                  <Text>{job.location}</Text>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button as={Link} to={`/jobs/${job.id}`} colorScheme="teal">
                    View
                  </Button>
                  <Button
                    as="a"
                    href={job.applyUrl}
                    target="_blank"
                    colorScheme="blue"
                  >
                    Apply
                  </Button>
                </Stack>
              </Flex>
            ))}
          </Box>
        ))
      )}
    </Box>
  );
};

export default JobListPage;
