import React, { useEffect, useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { sum, log } from 'mathjs';

const DiversityChartComponent = ({ isOverseas, selectedRegion, selectedDepartment, selectedCity }) => {
  const [data, setData] = useState([]);
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

  const filteredData = useMemo(() => {
    return data.filter(item =>
      (isOverseas ? item.Location_Type === 'French Overseas Territories' : item.Location_Type === 'Metropolitan France') &&
      (!selectedRegion || item.Details.Region === selectedRegion) &&
      (!selectedDepartment || item.Details.Department_Name === selectedDepartment) &&
      (!selectedCity || item.Details.City === selectedCity)
    );
  }, [isOverseas, selectedRegion, selectedDepartment, selectedCity, data]);

  const processDiversityData = (data) => {
    const regionGroups = data.reduce((acc, cur) => {
      const region = selectedCity 
        ? cur.Details.City 
        : (selectedRegion ? cur.Details.Department_Name : cur.Details.Region);
      cur.Details.Religious_Data.forEach(religiousItem => {
        const religion = religiousItem.Religion_Grouped;
        const count = religiousItem.Count;

        if (!acc[region]) {
          acc[region] = {};
        }
        if (!acc[region][religion]) {
          acc[region][religion] = 0;
        }
        acc[region][religion] += count;
      });
      return acc;
    }, {});

    const diversityData = Object.entries(regionGroups).map(([region, counts]) => {
      const total = sum(Object.values(counts));
      const diversityIndex = -sum(Object.values(counts).map(count => {
        const proportion = count / total;
        return proportion > 0 ? proportion * log(proportion) : 0;
      }));
      return { region, diversityIndex, total };
    });

    return diversityData.sort((a, b) => a.diversityIndex - b.diversityIndex);
  };

  const processedData = useMemo(() => processDiversityData(filteredData), [filteredData]);

  const chartData = useMemo(() => ({
    series: [{
      name: 'Diversity Index',
      data: processedData.map(item => ({
        x: item.region,
        y: item.diversityIndex,
        total: item.total
      }))
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false // This hides the entire toolbar including zoom, pan, and menu options
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: 'top'
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(2);
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      xaxis: {
        categories: processedData.map(item => item.region),
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return value.toFixed(2);
          }
        },
        title: {
          text: 'Diversity Index'
        }
      },
      title: {
        text: `Diversity of Places of Worship by Religion (${isOverseas ? 'Overseas' : 'Metropolitan'})`,
        align: 'center'
      },
      tooltip: {
        y: {
          formatter: (val, opts) => `Diversity Index: ${val.toFixed(2)} (Total Places of Worship: ${opts.w.config.series[0].data[opts.dataPointIndex].total})`
        }
      }
    }
  }), [processedData, selectedRegion, selectedCity]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (processedData.length === 0) {
    return <div>No data available for the selected filters.</div>;
  }

  return (
    <div>
      {/* <h2>Diversity of Places of Worship by Region in France</h2> */}
      <Chart options={chartData.options} series={chartData.series} type="bar" height={350} width={500} />
    </div>
  );
};

export default DiversityChartComponent;
