import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

/**
 * Renders the bar graph when its called
 * @param {Array} graphData - Array that holds the data points for the graph
 * @param {string} title - The title of the graph
 * @param {string} xLabel - The label for the x-axis
 * @param {string} yLabel - The label for the y-axis
 * @returns {JSX.Element} The rendered bar graph
 */
function BarGraph({ graphData, title, xLabel, yLabel }) {
  const chartRef = useRef(null);

  useEffect(() => {
    // Destroy the previous chart if it exists
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create a new chart if there is graph data
    if (graphData.length > 0) {
      chartRef.current = new Chart("myChart", {
        type: "bar",
        data: {
          labels: graphData.map((item) => item.label),
          datasets: [
            {
              backgroundColor: "blue",
              data: graphData.map((item) => item.value),
            },
          ],
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: xLabel,
              },
            },
            y: {
              title: {
                display: true,
                text: yLabel,
              },
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: title,
            },
          },
        },
      });
    }
  }, [graphData, title, xLabel, yLabel]);

  return (
    <div>
      <canvas id="myChart" width="400" height="200"></canvas>
    </div>
  );
}

export default BarGraph;
