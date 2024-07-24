import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import InfoCardStyles from '../styles/InfoCardStyles.module.css'
import { WaterEntry } from '../../../types';
import WaterLabel from './WaterLabel';
import ChartStyles from '../styles/ChartStyles.module.css'
import { useInfoCardContext } from '../../../context/InfoCardContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  waterValues: WaterEntry[], 
  handleChangeWater: (water_values: WaterEntry[]) => void
}



function constructChartData(waterValues: WaterEntry[]) {
  const structure: {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
    }[];
  } = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: 'waterings',
        data: waterValues.map(value => Number(value.water_count)),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      },
    ],
  }

  return structure
}


const WaterChart:React.FC<Props> = ({waterValues, handleChangeWater}) => {
  const chartData = constructChartData(waterValues)
  const {isInfoCardNewOrEditing} = useInfoCardContext()

  const highestValue = Math.max(...chartData.datasets[0].data);

  const BarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: Math.min(Math.ceil(highestValue * 1.5), 100),
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    }
  };

  const handleLabelValueChange = (dataIndex: number, newValue: number) => {
    const waterValuesCopy = [...waterValues]
    waterValuesCopy[dataIndex] = {...waterValuesCopy[dataIndex], water_count: Number(newValue)}
    handleChangeWater(waterValuesCopy)
  }

  

  return (
    <div className={InfoCardStyles.chart}>
      {isInfoCardNewOrEditing && 
        <ul className={ChartStyles.labelsGrid}>
          {chartData.labels.length > 0 && chartData.labels.map((label, index) => (
            <WaterLabel
              dataIndex={index}
              handleLabelValueChange={handleLabelValueChange}
              label={label} 
              value={chartData.datasets[0].data[index]} 
              backgroundColor={chartData.datasets[0].backgroundColor[index]}
              borderColor={chartData.datasets[0].borderColor[index]}
            />
          ))}
        </ul>
      }
      <div className={InfoCardStyles.barChart}>
        <Bar
          data={chartData}
          options={BarOptions}
        />
      </div>
    </div>
  )
}

export default WaterChart