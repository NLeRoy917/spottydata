import React from 'react';
import './css/GenreChart.css';
import { Doughnut } from 'react-chartjs-2';
import 'chart.piecelabel.js';

class GenreChart extends React.Component{

		  constructor(props) {
    		super(props);

    		this.state = {
    			data: null,
          palette: this.props.palette,
          options: { 
            legend: {
              position: "left",
                labels: {
                    fontColor: "white",
                    fontSize: window.innerWidth < 600 ? 10 : 12,
                    position: "left",
                    padding: window.innerWidth < 600 ? 8 : 10
                }
          } ,
          pieceLabel: {
             render: 'label',
             fontColor: '#FFF',
             fontSize: 10
          },
          plugins: {
             datalabels: {
                display: true
             }
          }
           }
  			   }
  		}

  		componentDidMount() {
			this.setState({data: {labels: Object.keys(this.props.data), 
								    datasets:[
								              {label:'Genre Data',data:Object.values(this.props.data), backgroundColor:[this.state.palette.Vibrant.hex,
                                                                                                        this.state.palette.LightVibrant.hex,
                                                                                                        this.state.palette.Muted.hex,
                                                                                                        this.state.palette.DarkVibrant.hex,
                                                                                                        this.state.palette.LightMuted.hex]}]
									}})
  		}

  		render() {
  			return(
  				<div>
  					<Doughnut 
                 data={this.state.data} 
                 options={this.state.options}
               />
  				</div>
  				)
  		}
  	}

  	export default GenreChart;

