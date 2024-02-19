import React, { useState } from 'react';
import Chart from './Chart';
import SidebarLeft from './sidebarLeft';
import SidebarRight from './sidebarRight';


const Organigram = () => {

    // Your functional component code here
    return (
        <div className='flex h-[100vh]'>
            <SidebarLeft />
              <Chart />
            <SidebarRight />

        </div>
    );
};

export default Organigram;