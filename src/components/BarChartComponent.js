import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const BarChartComponent = ({ isOverseas, selectedRegion, selectedDepartment, selectedCity }) => {
  const [data, setData] = useState([]);
  const [chartOptions, setChartOptions] = useState({ series: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from JSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dive-with-data/exported_data.json');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update chart options based on filters
  useEffect(() => {
    const updateChartOptions = () => {
      const filteredData = data.filter((item) =>
        isOverseas
          ? item.Location_Type === 'French Overseas Territories'
          : item.Location_Type === 'Metropolitan France'
      );

      const finalFilteredData = filteredData.filter((item) =>
        (!selectedRegion || item.Details.Region === selectedRegion) &&
        (!selectedDepartment || item.Details.Department_Name === selectedDepartment) &&
        (!selectedCity || item.Details.City === selectedCity)
      );

      const religionCounts = finalFilteredData.reduce((acc, item) => {
        item.Details.Religious_Data.forEach((religiousItem) => {
          const religion = religiousItem.Religion_Grouped;
          acc[religion] = (acc[religion] || 0) + (religiousItem.Count || 0);
        });
        return acc;
      }, {});

      const topReligions = Object.entries(religionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .reduce((acc, [religion, count]) => {
          acc[religion] = count;
          return acc;
        }, {});

      setChartOptions({
        series: [
          {
            name: 'Number of Places of Worship',
            data: Object.values(topReligions),
          },
        ],
        chart: { type: 'bar', height: 'auto', toolbar: { show: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
        dataLabels: { enabled: false },
        xaxis: { categories: Object.keys(topReligions) },
        title: {
          text: `Distribution of Places of Worship by Religion (${isOverseas ? 'Overseas' : 'Metropolitan'})`,
          align: 'center',
        },
      });
    };

    if (data.length) {
      updateChartOptions();
    }
  }, [data, isOverseas, selectedRegion, selectedDepartment, selectedCity]);

  if (isLoading) return <div>Loading chart...</div>;
  if (error) return <div>Error loading chart: {error}</div>;
  if (!chartOptions.series.length) return <div>No data available</div>;

  return (
    <div>
      <Chart options={chartOptions} series={chartOptions.series} type="bar" height={350} width="100%" />
    </div>
  );
};

export default BarChartComponent;
