import React, { useRef, useEffect, useState } from 'react';
import OrgChart from "@balkangraph/orgchart.js";
import jsonData from './nodesData.json';
import { signal } from "@preact/signals";

export const left_sidebar_signal = signal({
    name: 'left_sidebar',
    visible: false
});

export const right_sidebar_signal = signal({
    name: 'right_sidebar',
    visible: false
});

const Chart = () => {
    const divRef = useRef(null);
    
    const [rightSidebar, setRightSidebar] = useState(false);
    const [leftSidebar, setLeftSidebar] = useState(false);
    const [selectedNode, setNodeInfo] = useState(null);


    // function setContent(node) {
    //     right_sidebar.innerHTML = `
    //         <div class="flex flex-col items-center">
    //             <img src="${node.img}" alt="user" class="w-24 h-24 rounded-full mb-2">
    //             <h1 class="text-lg font-bold">${node.name}</h1>
    //             <p class="text-sm text-gray-400">${node.title}</p>
    //         </div>
    //     `;
    // }

    useEffect(() => {
        OrgChart.templates.base.node = 
        '<rect x="0" y="0" height="120" width="250" fill="#00FF00" stroke-width="1" stroke="#aeaeae" rx="7" ry="7"></rect>'
        OrgChart.templates.base.field_0 = 
        '<text data-width="125" data-text-overflow="ellipsis" style="font-size: 68px;" fill="#FF0000" x="15" y="25" text-anchor="start">{val}</text>';
        OrgChart.templates.base.field_1 = 
        '<text data-width="105" data-text-overflow="ellipsis" style="font-size: 11px;" fill="#ffffff" x="15" y="135" text-anchor="start">{val}</text>';
        OrgChart.templates.base.img_0 = 
        '<clipPath id="{randId}"><circle cx="60" cy="60" r="40"></circle></clipPath> <image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="20" y="20" width="80" height="80"></image>';
        OrgChart.templates.base.img_1 = 
        '<clipPath id="{randId}"><circle cx="600" cy="600" r="400"></circle></clipPath> <image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="500" y="500" width="80" height="80"></image>';

        OrgChart.templates.group.link = 
        '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="{rounded}" />';
        
        const breakHiererchy = (sender, nodeId) => {
            console.log(nodeId)
            let node = sender.get(nodeId);
            console.log(node);
            node.pid = null;
            node.stpid = "unasigned";
            console.log(node);
            node.tags = ["unasigned-node-card-style"];
            sender.updateNode(node);

            for(const child of sender.getNode(nodeId).children)
            {
                breakHiererchy(sender, child.id);
            }
        }

        const chart = new OrgChart (divRef.current , {
            nodes: jsonData,
            enableSearch: false,
            enablePan : true,
            scaleInitial: 0.6,
            enableDragDrop: true, 
            roots: ["unasigned", "organigram" ],
            template:"deborah",
            nodeBinding: {
                img_0: 'img',
                field_0: 'name',
                img_1:'img2',
                field_1: 'title',
            },
            tags: {
                "unasigned": {
                    template: "group",
                    subTreeConfig: {
                        siblingSeparation: 2,
                        template: 'ana',
                        columns: 1,
                    }
                },
                "organigram": {
                    template: "invisibleGroup",
                    subTreeConfig: {
                        siblingSeparation: 10,
                        align: OrgChart.align.orientation,
                        orientation: OrgChart.orientation.top_left,
                    },
                },
                "unasigned-node-card-style": {
                    template: "deborah",
                },                
                "asigned-node-card-style": {
                    template: "olivia",
                },
                "big-boss": {
                    template: "olivia",
                },
                "sd-employee": {
                    template: "olivia",
                },
                "management": {
                    template: "group",
                    subTreeConfig: {
                        siblingSeparation: 2,
                    }
                },
            },
        });
        
        chart.on("drag", function(sender, draggedNodeId, droppedNodeId) {
            console.log("drag started");
            if(draggedNodeId === "organigram" || 
                draggedNodeId === "unasigned" ||
                draggedNodeId === "management"
            ) return false;

            let draggedNode = sender.get(draggedNodeId);
            if(draggedNode.tags.includes("big-boss")) return false; 
        });

        chart.on("drop", (sender, draggedNodeId, droppedNodeId) => {
            console.log("drop started");
            let droppedNode = sender.get(droppedNodeId);
            if(droppedNode.tags.indexOf( "unasigned") !== -1 || droppedNode.tags !== null)
            {
                breakHiererchy(sender,draggedNodeId);
                return false;
            } else {
                return false;
            }
        });

        chart.onUpdateNode((args) => {
            console.log(args);
        });

        chart.on('click', function(sender, args){
            if(selectedNode !== null){
                if(selectedNode.id === args.node.id) {
                    setLeftSidebar(!leftSidebar); 
                    return false;
                }else {
                    if(!leftSidebar) setLeftSidebar(!leftSidebar);
                    setNodeInfo(sender.get(args.node.id));
                    return false;
                }
            }else {
                setLeftSidebar(!leftSidebar); 
                setNodeInfo(sender.get(args.node.id));
            }

            return false;
        });
    }, [rightSidebar, leftSidebar, selectedNode]);

    return (
        <div className='h-[100vh] flex'>
            <div className={` ${leftSidebar ? 'block' : 'hidden' } p-2 w-[300px] h-full bg-neutral-200`}>
                {selectedNode !== null ? (
                    <div className="flex flex-col items-center">
                        <img src={selectedNode.img} alt="user" className="w-24 h-24 rounded-full mb-2" />
                        <h1 className="text-lg font-bold">{selectedNode.name}</h1>
                        <p className="text-sm text-gray-400">{selectedNode.title}</p>
                    </div>
                ) : (
                    <h1>test</h1>
                )}
            </div>
            <div className='h-full w-full bg-neutral-800 grow' id="tree" ref={divRef}></div>
            <div className={` ${rightSidebar ? 'block' : 'hidden' } p-2 w-[300px] h-full bg-neutral-200`}>right</div>
        </div>
    );
}

export default Chart;
