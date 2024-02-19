import React, { Component } from 'react';
import Chart from './organigram/Chart';

export default class App extends Component {


  
    render() {
        return (
            <div className="h-[100vh] bg-neutral-800 p-6" >
              <Chart />
            </div>
        );
    }
}