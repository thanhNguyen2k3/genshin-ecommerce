import lineChart from './configs/cloumnChart';

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

function LineChart() {
    const undefined = 'undefined';

    return (
        <div>
            {typeof window !== undefined && (
                <Chart
                    className="full-width"
                    options={lineChart.options}
                    series={lineChart.series}
                    type="area"
                    height={350}
                    width={'100%'}
                />
            )}
        </div>
    );
}

export default LineChart;
