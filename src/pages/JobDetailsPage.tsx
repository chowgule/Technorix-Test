import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Button, Stack, Spinner } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { getJobById, getJobs, Job } from "../api/jobApi";

/**
 * Displays detailed information about a single job opening. The page fetches
 * the job details based on the URL parameter and, after loading the details,
 * fetches other openings from the same department for cross navigation.
 */
const JobDetailsPage: React.FC = () => {
  // Read the job ID from the route
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [otherJobs, setOtherJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // Fetch the job by ID, then fetch other jobs from the same department
    getJobById(id)
      .then((jobData) => {
        console.log(jobData);
        setJob(jobData);
        return getJobs({ department: jobData.department });
      })
      .then((jobsInDept) => {
        // Exclude the current job from the list of other jobs
        setOtherJobs(jobsInDept.filter((j) => String(j.id) !== id));
      })
      .catch((error) => {
        console.error(error);
        setJob(null);
        setOtherJobs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Render a loading state while data is being fetched
  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner />
      </Box>
    );
  }

  // Handle missing job data
  if (!job) {
    return (
      <Box p={6}>
        <Heading as="h1" size="lg" mb={4}>
          Job not found
        </Heading>
        <Button as={Link} to="/" colorScheme="blue">
          Back to list
        </Button>
      </Box>
    );
  }

  return (
    <Box p={6} maxWidth="960px" mx="auto">
      {/* Back navigation */}
      <Button as={Link} to="/" mb={4} colorScheme="blue">
        &larr; Back
      </Button>
      {/* Job details */}
      <Heading as="h1" mb={2}>
        {job.title}
      </Heading>
      <Text fontSize="lg" mb={4}>
        {job.location}
      </Text>
      {/* The description may contain HTML markup; use dangerouslySetInnerHTML */}
      <Box mb={4} dangerouslySetInnerHTML={{ __html: job.description }} />
      <Button
        as="a"
        href={job.applyUrl}
        target="_blank"
        colorScheme="teal"
        mt={2}
      >
        Apply
      </Button>
      {/* Social sharing buttons */}
      <Stack direction={{ base: "column", sm: "row" }} spacing={2} mt={4}>
        <Button
          as="a"
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.href : ""
          )}`}
          target="_blank"
          colorScheme="blue" // use a standard palette instead of "facebook"
        >
          Share on Facebook
        </Button>
        <Button
          as="a"
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.href : ""
          )}`}
          target="_blank"
          colorScheme="blue"
        >
          Share on LinkedIn
        </Button>
        <Button
          as="a"
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            typeof window !== "undefined" ? window.location.href : ""
          )}`}
          target="_blank"
          colorScheme="blue"
        >
          Share on Twitter
        </Button>
      </Stack>

      {/* Other jobs in the same department */}
      <Box mt={8}>
        <Heading as="h2" size="md" mb={2}>
          Other {job.department} Jobs
        </Heading>
        {otherJobs.length === 0 ? (
          <Text>No other jobs in this department.</Text>
        ) : (
          <Stack spacing={2}>
            {otherJobs.map((j) => (
              <Button
                key={j.id}
                as={Link}
                to={`/jobs/${j.id}`}
                variant="link"
                colorScheme="teal"
              >
                {j.title}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default JobDetailsPage;
