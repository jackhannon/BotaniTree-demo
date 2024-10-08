import {
  Chart as ChartJS,
  ChartOptions,
  registerables
} from 'chart.js';
import { SubstrateEntry } from '../../../types';
import SubstrateLegendLabel from './SubstrateLegendLabel';
import PieLegendStyles from "../styles/PieLegendStyles.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import ChartStyles from '../styles/ChartStyles.module.css';
import { useInfoCardContext } from '../../../context/InfoCardContext';

type Props = {
  substrateValues: SubstrateEntry[], 
  handleChangeSubstrate: (substrate_values: SubstrateEntry[]) => void
}

ChartJS.register(...registerables);
ChartJS.defaults.plugins.legend.display = false


const pieOptions: ChartOptions<"pie"> = {
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart',
  },
  plugins: {
    legend: {
      display: false
    },
  },
};

function constructChartData(substrateValues: SubstrateEntry[]) {
  const structure: {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number;
    }[];
  } = {
    labels: [],
    datasets: [
      {
        label: '% of substrate',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  }

  structure.labels = substrateValues.map(value => value.substrate)
  structure.datasets[0].data = substrateValues.map(value => Number(value.percent))
  structure.datasets[0].backgroundColor = substrateValues.map(value => value.color + "33")
  structure.datasets[0].borderColor = substrateValues.map(value => value.color)

  return structure
}




const SubstrateChart:React.FC<Props> = ({substrateValues, handleChangeSubstrate}) => {

  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const chartData = constructChartData(substrateValues);
    
    new ChartJS(ctx, {
      type: 'pie',
      data: chartData,
      options: pieOptions,
    });

    // Cleanup function to destroy the chart when the component unmounts
    return () => {
      if (chartRef.current) {
        const chart = ChartJS.getChart(chartRef.current);
        if (chart) {
          chart.destroy();
        }
      }
    };
  }, [substrateValues]);

  const {isInfoCardNewOrEditing} = useInfoCardContext()

  const [removeSubstrateMode, setRemoveSubstrateMode] = useState<boolean>(false)
  const chartData = constructChartData(substrateValues)
  const remainingPercent = 100 - substrateValues.map(value=>value.percent).reduce((acc, item) => acc + item, 0)

  const handleLabelChange = (dataIndex: number, newLabel: string) => {
    const substrateValuesCopy = [...substrateValues]
    substrateValuesCopy[dataIndex] = {...substrateValuesCopy[dataIndex], substrate: newLabel}
    handleChangeSubstrate(substrateValuesCopy)
  }

  const handleLabelValueChange = (dataIndex: number, newValue: number) => {
    const substrateValuesCopy = [...substrateValues]
    substrateValuesCopy[dataIndex] = {...substrateValuesCopy[dataIndex], percent: Number(newValue)}
    handleChangeSubstrate(substrateValuesCopy)
  }

  const handleAddLabel = () => {
    const substrateValuesCopy = [...substrateValues, {substrate: "new substrate", percent: 0, color: '#9966FF'}]
    handleChangeSubstrate(substrateValuesCopy)
  }

  const handleRemoveLabel = (dataIndex: number) => {
    const substrateValuesCopy = substrateValues.filter((_, index) => index !== dataIndex)
    handleChangeSubstrate(substrateValuesCopy)
  }

  const handleColorChange = (dataIndex: number, color: string) => {
    const substrateValuesCopy = [...substrateValues]
    substrateValuesCopy[dataIndex] = {...substrateValuesCopy[dataIndex], color}
    handleChangeSubstrate(substrateValuesCopy)
  }

  return (
    <div className={PieLegendStyles.pieChart}>
      <ul className={`${isInfoCardNewOrEditing ? ChartStyles.labelsGrid : PieLegendStyles.substrateLegend}`}>
        {chartData.labels.length > 0 && chartData.labels.map((label, index) => (
          <SubstrateLegendLabel 
            removeSubstrateMode={removeSubstrateMode}
            handleColorChange={handleColorChange}
            combinedPercent={substrateValues.map(value=>value.percent).reduce((acc, item) => acc + item, 0)}
            dataIndex={index}
            handleLabelValueChange={handleLabelValueChange}
            handleLabelChange={handleLabelChange}
            handleRemoveLabel={handleRemoveLabel}
            label={label} 
            value={chartData.datasets[0].data[index]} 
            backgroundColor={chartData.datasets[0].backgroundColor[index]}
            borderColor={chartData.datasets[0].borderColor[index]}
          />
        ))}
      </ul>
      {isInfoCardNewOrEditing && (
        <>
          <div className={PieLegendStyles.btnsContainer}>
            {!removeSubstrateMode && (
              <button className={PieLegendStyles.addLabelButton} onClick={handleAddLabel}>
                Add a new substrate
                <FontAwesomeIcon icon={faPlus} />
              </button>
            )}
          
            <button className={PieLegendStyles.addLabelButton} onClick={() => setRemoveSubstrateMode(prev => !prev)}>
              {removeSubstrateMode ? (
                <>
                  <FontAwesomeIcon icon={faChevronLeft}/>
                  Back to edit mode
                </>
              ) : (
                <>
                  Remove a substrate
                  <FontAwesomeIcon icon={faMinus} />
                </>
              )}
            </button>
          </div>
        </>
      )}
      {isInfoCardNewOrEditing && <div>Remaining space: {remainingPercent}%</div>}
      <canvas ref={chartRef} />
    </div>
  )
}

export default SubstrateChart