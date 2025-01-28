import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const BarChartComponent = ({ isOverseas, filteredData }) => {
  const [chartOptions, setChartOptions] = useState({ series: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updateChartOptions = () => {
      // Check if filteredData is available
      if (!filteredData || filteredData.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const religionData = {};
        filteredData.forEach((item) => {
          // Ensure that the expected properties exist
          if (item?.Details?.Religious_Data) {
            item.Details.Religious_Data.forEach((religionItem) => {
              const religion = religionItem.Religion_Grouped;
              const count = religionItem.Count;
              if (religionData[religion]) {
                religionData[religion] += count;
              } else {
                religionData[religion] = count;
              }
            });
          }
        });

        const topReligions = Object.entries(religionData)
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
          chart: { 
            type: 'bar', 
            height: 'auto', 
            toolbar: { show: false } 
          },
          plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
          dataLabels: { enabled: false },
          xaxis: { categories: Object.keys(topReligions) },
          title: {
            text: `Distribution of Places of Worship by Religion (${isOverseas ? 'Overseas' : 'Metropolitan'})`,
            align: 'center',
          },
        });

        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    updateChartOptions();
  }, [filteredData, isOverseas]);

  if (isLoading) return <div>Loading chart...</div>;
  if (error) return <div>Error loading chart: {error.message}</div>;
  if (!chartOptions.series.length) return <div>No data available</div>;

  return (
    <div>
      {/* <h2>Distribution of Places of Worship by Religion - Bar Chart</h2>*/}
      <Chart options={chartOptions} series={chartOptions.series} type="bar" height={350} width={500} />
    </div>
  );
};

export default BarChartComponent;
