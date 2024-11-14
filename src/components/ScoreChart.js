import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

const ScoreChart = ({ score }) => {
  const [pointRadius, setPointRadius] = useState(16);
  const [yAxisMax, setYAxisMax] = useState(8);
  const [fontsize, setFontsize] = useState(16);
  const [labelFontsize, setLabelFontsize] = useState(12);

  const names = Object.keys(score);

  const player1Data = score[names[0]]
    .map((points, index) => {
      const cumulativePoints = score[names[0]]
        .slice(0, index + 1)
        .reduce((acc, val) => acc + val, 0);
      return points === 1
        ? { x: index + 1, y: 1, label: cumulativePoints }
        : null;
    })
    .filter(Boolean);

  const player2Data = score[names[1]]
    .map((points, index) => {
      const cumulativePoints = score[names[1]]
        .slice(0, index + 1)
        .reduce((acc, val) => acc + val, 0);
      return points === 1
        ? { x: index + 1, y: 2, label: cumulativePoints }
        : null;
    })
    .filter(Boolean);

  const adjustChartDimensions = () => {
    const width = window.innerWidth;
    let radius = 16;
    let maxYAxis = 8;
    let fontsize = 16;
    let labelFontsize = 14;

    if (width < 400) {
      radius = 4;
      maxYAxis = 7;
      fontsize = 10;
      labelFontsize = 7;
    } else if (width < 500) {
      radius = 6;
      maxYAxis = 4;
      fontsize = 12;
      labelFontsize = 8;
    } else if (width < 600) {
      radius = 8;
      maxYAxis = 8;
      fontsize = 14;
      labelFontsize = 10;
    } else if (width < 800) {
      radius = 12;
      maxYAxis = 8;
      fontsize = 16;
      labelFontsize = 12;
    }

    setPointRadius(radius);
    setYAxisMax(maxYAxis);
    setFontsize(fontsize);
    setLabelFontsize(labelFontsize);
  };

  useEffect(() => {
    adjustChartDimensions();
    window.addEventListener('resize', adjustChartDimensions);
    return () => {
      window.removeEventListener('resize', adjustChartDimensions);
    };
  }, []);

  const data = {
    datasets: [
      {
        label: names[0],
        data: player1Data,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        pointRadius: pointRadius,
        hoverRadius: pointRadius,
      },
      {
        label: names[1],
        data: player2Data,
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: pointRadius,
        hoverRadius: pointRadius,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const player = tooltipItem.datasetIndex === 0 ? names[0] : names[1];
            return `${player} ${tooltipItem.dataIndex + 1}`;
          },
        },
      },
      datalabels: {
        display: true,
        align: 'center',
        color: '#ffffff',
        font: {
          size: labelFontsize,
        },
        formatter: function (value) {
          return value.label;
        },
      },
    },
    layout: {
      padding: 36,
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true,
        border: {
          display: false,
        },
        min: 0,
        max: yAxisMax,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
        borderColor: 'transparent',
        borderWidth: 0,
        ticks: {
          stepSize: 1,
          font: {
            size: fontsize,
          },
          callback: function (value) {
            if (value === 1) return names[0];
            if (value === 2) return names[1];
            return '';
          },
        },
      },
    },
  };

  return <Scatter data={data} options={options} />;
};

export default ScoreChart;
