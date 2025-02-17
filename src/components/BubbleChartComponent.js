import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const BubbleChartComponent = ({ isOverseas, selectedRegion, selectedDepartment, selectedCity }) => {
  const [data, setData] = useState([]);
  const [chartOptions, setChartOptions] = useState({ series: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/dive-with-data/exported_data.json');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5)
        .map(([religion]) => religion);

      const uniqueDenominations = Array.from(
        new Set(finalFilteredData.flatMap((item) =>
          item.Details.Religious_Data.map((religiousItem) => religiousItem.Denomination_Grouped)
        ))
      );

      const series = topReligions.map((religion) => ({
        name: religion.charAt(0).toUpperCase() + religion.slice(1),
        data: uniqueDenominations.map((denomination) => {
          const matchingItems = finalFilteredData.filter(
            (item) =>
              item.Details.Religious_Data.some(
                (religiousItem) =>
                  religiousItem.Denomination_Grouped === denomination &&
                  religiousItem.Religion_Grouped.toLowerCase() === religion.toLowerCase()
              )
          );
          const totalCount = matchingItems.reduce(
            (sum, item) =>
              sum +
              item.Details.Religious_Data.filter(
                (religiousItem) => religiousItem.Denomination_Grouped === denomination
              ).reduce((innerSum, religiousItem) => innerSum + (religiousItem.Count || 0), 0),
            0
          );
          return { x: denomination, y: totalCount > 0 ? totalCount : null };
        }),
      })).filter((s) => s.data.some((point) => point.y !== null));

      setChartOptions({
        series: series,
        chart: {
          type: 'scatter',
          height: 350,
          toolbar: {
            show: false
          }
        },
        colors: ['#008FFB', '#FF4560', '#775DD0', '#00E396', '#FEB019', '#808080'],
        legend: { show: true, position: 'bottom', horizontalAlign: 'center' },
        tooltip: { y: { formatter: (val) => (val !== null ? `${val}` : 'No Data') } },
        dataLabels: { enabled: false },
        title: {
          text: `Distribution of PoW by Religion/Denomination (${isOverseas ? 'Overseas' : 'Metropolitan'})`,
          align: 'center',
        },
      });
    };

    updateChartOptions();
  }, [data, isOverseas, selectedRegion, selectedDepartment, selectedCity]);

  if (!data.length) return <div>Loading...</div>;

  return (
    <div>
      <ReactApexChart options={chartOptions} series={chartOptions.series} type="scatter" height={350} width="100%" />
    </div>
  );
};

export default BubbleChartComponent;
