import React, {useState} from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';

const PlaylistTimeline = (props) => {
    const [options, setOptions] = useState({
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'Date Added',
                fontColor:'#E6FAFC',
                fontSize:14
            },
            gridLines: {zeroLineColor: '#E6FAFC'},
            ticks: {
               fontColor: "white",
               fontSize: 12
              }
        }],
        yAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                labelString: 'New Songs',
                fontColor: '#E6FAFC',
                fontSize:14
            },
            gridLines: {zeroLineColor: '#E6FAFC'},
            ticks: {
                  fontColor: "white",
                  fontSize: 12
            }
        }]
    },
    legend: {
    labels: {
    fontColor: "white"
    },
    display: false
    },
    point: {radius: 0}
     })
    return (
        <>
          <Line
            options={options}
            data={
                {
                labels: props.labels,
                datasets: [
                    {
                        label: 'Addition Timeline', 
                        data: props.data,
                        backgroundColor:`rgba(${props.palette.Vibrant.r}, ${props.palette.Vibrant.g}, ${props.palette.Vibrant.b}, 0.4)`, borderColor:`rgba(${props.palette.Vibrant.r}, ${props.palette.Vibrant.g}, ${props.palette.Vibrant.b}, 1)`,borderWidth:0,pointRadius: 0
                    }
                  ]
                }
            }
          />
        </>
    )
}

export default PlaylistTimeline;
