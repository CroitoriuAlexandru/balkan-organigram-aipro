import React from 'react';
import { right_sidebar_signal } from './Chart';


const SidebarRight = () => {
    console.log("sidebar rerendered !")
    // Your functional component code here
    return (
        <div className='p-2 w-[350px] h-full bg-neutral-200 z-[100]'>
            {right_sidebar_signal.value.visible ? "test" : "test2"}
        </div>
    );
};

export default SidebarRight;