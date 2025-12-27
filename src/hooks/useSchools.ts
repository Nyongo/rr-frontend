import { useState, useEffect } from "react";
import { getSchools, School } from "@/services/schoolApi";

export const useSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = async (
    page: number = 1,
    pageSize: number = 100,
    search?: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSchools(page, pageSize, search);
      setSchools(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch schools");
      console.error("Failed to fetch schools:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return {
    schools,
    loading,
    error,
    fetchSchools,
    refetch: () => fetchSchools(),
  };
};

