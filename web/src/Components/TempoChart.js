import React from 'react';
import './css/KeyChart.css';
import { Line } from 'react-chartjs-2';

class TempoChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
          palette: this.props.palette,
    			options: {scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: 'Tempo (bpm)',
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
                                labelString: 'Counts',
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
  			   }}
  		}

  		componentDidMount() {

  			this.setState({data: {labels: this.props.data.x, 
                            datasets:[
                                      {label:'Tempo',data:this.props.data.y, backgroundColor:`rgba(${this.state.palette.Vibrant.r}, ${this.state.palette.Vibrant.g}, ${this.state.palette.Vibrant.b}, 0.4)`, borderColor:`rgba(${this.state.palette.Vibrant.r}, ${this.state.palette.Vibrant.g}, ${this.state.palette.Vibrant.b}, 1)`,borderWidth:0,pointRadius: 0}]
                      }})
      }

  		render() {
  			return (
  				<div>
					<Line
						data={this.state.data}
						options={this.state.options}
                        dot={false}
				 />
  				</div>
  				);
  		}

}


export default TempoChart