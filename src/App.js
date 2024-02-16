import React, { Component } from 'react';
import OrgChart from './mytree';
import jsonData from './nodesData.json';

export default class App extends Component {

    createOrganigram() {
     
      return (
        // <OrgChart />
        <OrgChart nodes={jsonData} />
      );
    }
  
  
    render() {
        return (
            <div className="h-[100vh] bg-neutral-800 p-6" >
              {/* <OrgChart /> */}
              {this.createOrganigram()}
            </div>
        );
    }
}