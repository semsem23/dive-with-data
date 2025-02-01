import React, { useEffect, useState, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const HeatMapComponent = ({ isOverseas, selectedRegion, selectedDepartment, selectedCity }) => {
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

  const computedOptions = useMemo(() => {
    if (!data.length) return null;

    const filteredData = data.filter(item =>
      isOverseas
        ? item.Location_Type === 'French Overseas Territories'
        : item.Location_Type === 'Metropolitan France'
    );

    const finalData = filteredData.filter(item =>
      (!selectedRegion || item.Details.Region === selectedRegion) &&
      (!selectedDepartment || item.Details.Department_Name === selectedDepartment) &&
      (!selectedCity || item.Details.City === selectedCity)
    );

    const regionMap = {};
    const allReligions = new Set();

    finalData.forEach(item => {
      const region = selectedCity
        ? item.Details.City
        : selectedRegion ? item.Details.Department_Name : item.Details.Region;

      item.Details.Religious_Data.forEach(religiousItem => {
        const religion = religiousItem.Religion_Grouped;
        const count = religiousItem.Count;
        allReligions.add(religion);

        if (!regionMap[region]) {
          regionMap[region] = { total: 0, religions: {} };
        }

        regionMap[region].total += count;
        regionMap[region].religions[religion] = (regionMap[region].religions[religion] || 0) + count;
      });
    });

    const religionDataByRegion = Object.keys(regionMap).map(region => {
      const total = regionMap[region].total;
      const religions = regionMap[region].religions;

      return {
        region,
        religionPercentages: Array.from(allReligions).map(religion => ({
          religion,
          percentage: parseFloat(((religions[religion] || 0) / total * 100).toFixed(2))
        }))
      };
    });

    const series = religionDataByRegion.map(regionData => ({
      name: regionData.region,
      data: regionData.religionPercentages.map(({ religion, percentage }) => ({
        x: religion, y: percentage
      }))
    }));

    const { min, max } = religionDataByRegion.reduce((acc, regionData) => {
      regionData.religionPercentages.forEach(({ percentage }) => {
        if (percentage < acc.min) acc.min = percentage;
        if (percentage > acc.max) acc.max = percentage;
      });
      return acc;
    }, { min: Infinity, max: -Infinity });

    const colorScale = [
      { from: min, to: min + (max - min) * 0.2, color: '#B3E5FC' },
      { from: min + (max - min) * 0.2, to: min + (max - min) * 0.4, color: '#81D4FA' },
      { from: min + (max - min) * 0.4, to: min + (max - min) * 0.6, color: '#4FC3F7' },
      { from: min + (max - min) * 0.6, to: min + (max - min) * 0.8, color: '#29B6F6' },
      { from: min + (max - min) * 0.8, to: max, color: '#0288D1' }
    ];

    return {
      series,
      options: {
        chart: {
          type: 'heatmap',
          height: 600,
          width: '100%',
          toolbar: { show: false }
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            colorScale: { ranges: colorScale },
            dataLabels: {
              enabled: true,
              formatter: (val) => `${Number(val).toFixed(2)}%`,
              style: { fontSize: '10px', colors: ['#000'] }
            }
          }
        },
        tooltip: {
          y: { formatter: (val) => `${Number(val).toFixed(2)}%` }
        },
        title: {
          text: `Religion Distribution by ${selectedCity ? 'City' : selectedRegion ? 'Department' : 'Region'} (${isOverseas ? 'Overseas' : 'Metropolitan'})`,
          align: 'center'
        },
        xaxis: { labels: { rotate: -45, style: { fontSize: '10px' } } },
        yaxis: { labels: { style: { fontSize: '12px' } } },
        legend: { show: true, position: 'bottom' }
      }
    };
  }, [data, isOverseas, selectedRegion, selectedDepartment, selectedCity]);

  if (!computedOptions?.series.length) return <div>No Data Available</div>;

  return (
    <ReactApexChart
      options={computedOptions.options}
      series={computedOptions.series}
      type="heatmap"
      width="100%"
      height={400}
    />
  );
};

export default HeatMapComponent;
