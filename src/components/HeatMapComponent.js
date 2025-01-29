import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const HeatMapComponent = ({ isOverseas, selectedRegion, selectedDepartment, selectedCity }) => {
  const [data, setData] = useState([]);
  const [chartOptions, setChartOptions] = useState({ series: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('/dive-with-data/exported_data.json')
          const result = await response.json();
          setData(result);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError(error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

  useEffect(() => {
    const updateChartOptions = () => {
      // Step 1: Filter data based on the location type (Metropolitan France or Overseas Territories)
      const filteredData = data.filter((item) =>
        isOverseas
          ? item.Location_Type === 'French Overseas Territories'
          : item.Location_Type === 'Metropolitan France'
      );

      // Step 2: Filter data based on the selected region, department, and city
      let finalFilteredData = filteredData.filter((item) =>
        (!selectedRegion || item.Details.Region === selectedRegion) &&
        (!selectedDepartment || item.Details.Department_Name === selectedDepartment) &&
        (!selectedCity || item.Details.City === selectedCity)
      );

      // Step 3: Aggregate religious data by city if a city is selected, otherwise by department or region
      const regionMap = {};
      const allReligions = new Set();

      finalFilteredData.forEach(item => {
        // Aggregate by City if a city is selected, otherwise by Department or Region
        const region = selectedCity 
          ? item.Details.City 
          : (selectedRegion ? item.Details.Department_Name : item.Details.Region);
        
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

      // Step 4: Create religion percentage data for the heatmap
      const religionDataByRegion = Object.keys(regionMap).map(region => {
        const total = regionMap[region].total;
        const religions = regionMap[region].religions;

        const religionPercentages = Array.from(allReligions).map(religion => ({
          religion,
          percentage: parseFloat(((religions[religion] || 0) / total * 100).toFixed(2)),
        }));

        return { region, religionPercentages };
      });

      // Step 5: Create the series for the heatmap chart
      const series = religionDataByRegion.map(regionData => ({
        name: regionData.region,
        data: regionData.religionPercentages.map(religionData => ({
          x: religionData.religion,
          y: religionData.percentage,
        })),
      }));

      // Step 6: Set up the color scale and chart options
      const { min, max } = religionDataByRegion.reduce(
        (acc, regionData) => {
          regionData.religionPercentages.forEach(religion => {
            if (religion.percentage < acc.min) acc.min = religion.percentage;
            if (religion.percentage > acc.max) acc.max = religion.percentage;
          });
          return acc;
        },
        { min: Infinity, max: -Infinity }
      );

      const step = (max - min) / 5;
      const colorScale = [
        { from: min, to: min + step, color: '#B3E5FC' },
        { from: min + step, to: min + 2 * step, color: '#81D4FA' },
        { from: min + 2 * step, to: min + 3 * step, color: '#4FC3F7' },
        { from: min + 3 * step, to: min + 4 * step, color: '#29B6F6' },
        { from: min + 4 * step, to: max, color: '#0288D1' },
      ];

      const options = {
        chart: {
          type: 'heatmap',
          height: 600,
          width: '100%',
          toolbar: { show: false },
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            colorScale: { ranges: colorScale },
            dataLabels: {
              enabled: true,
              formatter: (val) => `${Number(val).toFixed(2)}%`,
              style: { fontSize: '10px', colors: ['#000'] },
            },
          },
        },
        tooltip: {
          y: { formatter: (val) => `${Number(val).toFixed(2)}%` },
        },
        title: {
          text: `Religion Distribution by ${selectedCity ? 'City' : (selectedRegion ? 'Department' : 'Region')} (${isOverseas ? ' Overseas' : 'Metropolitan'})`,
          align: 'center',
        },
        xaxis: { labels: { rotate: -45, style: { fontSize: '10px' } } },
        yaxis: { labels: { style: { fontSize: '12px' } } },
        legend: { show: true, position: 'bottom' },
      };

      setChartOptions({
        series,
        options,
      });
    };

    updateChartOptions();
  }, [data, isOverseas, selectedRegion, selectedDepartment, selectedCity]);

  if (!data.length) return <div>Loading...</div>;

  return (
    <div>
      
      {/* <h2>Religion Distribution by Region</h2> */}
      <ReactApexChart options={chartOptions.options} series={chartOptions.series} type="heatmap" width={520} height={400} />
    </div>
  );
};

export default HeatMapComponent;
