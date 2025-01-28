import { useMemo } from 'react';

// Helper functions for KPI calculations
const calculatePlacesOfWorship = (data) => {
  return data.reduce((sum, item) => {
    if (item.Details?.Religious_Data) {
      const totalCount = item.Details.Religious_Data.reduce((countSum, religion) =>
        countSum + (Number(religion.Count) || 0), 0);
      return sum + totalCount;
    }
    return sum;
  }, 0);
};

const calculateAverage = (data) => {
  const totalPlaces = data.reduce((sum, item) => {
    if (item.Details?.Religious_Data) {
      return sum + item.Details.Religious_Data.reduce((countSum, religion) =>
        countSum + (Number(religion.Count) || 0), 0);
    }
    return sum;
  }, 0);

  return data.length ? (totalPlaces / data.length).toFixed(2) : '0.00';
};

const countUnescoRegistered = (data) => {
  return data.reduce((sum, item) => sum + (Number(item.Details?.Inscription_Date_Count) || 0), 0);
};

const calculateDiversityIndex = (data) => {
  const religionCounts = data.reduce((acc, item) => {
    if (item.Details?.Religious_Data) {
      item.Details.Religious_Data.forEach(religion => {
        if (religion.Religion_Grouped && religion.Count) {
          acc[religion.Religion_Grouped] = (acc[religion.Religion_Grouped] || 0) + Number(religion.Count);
        }
      });
    }
    return acc;
  }, {});

  const total = Object.values(religionCounts).reduce((sum, count) => sum + count, 0);
  if (total === 0) return '0.00';

  const diversityIndex = Object.values(religionCounts)
    .map(count => count / total)
    .reduce((sum, p) => sum - p * Math.log(p), 0);

  return diversityIndex.toFixed(2);
};

// useKPIs Hook
export const useKPIs = (filteredData) => {
  return useMemo(() => {
    const placesOfWorship = calculatePlacesOfWorship(filteredData);
    const averagePlaceOfWorship = calculateAverage(filteredData);
    const unescoRegistered = countUnescoRegistered(filteredData);
    const diversityIndex = calculateDiversityIndex(filteredData);

    return { placesOfWorship, averagePlaceOfWorship, unescoRegistered, diversityIndex };
  }, [filteredData]);
};
