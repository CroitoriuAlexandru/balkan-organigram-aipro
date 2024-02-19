import React, { useState } from 'react';
import OrgChart from "@balkangraph/orgchart.js";
import jsonData from './nodesData.json';

function Chart() {
    const [toggled, setToggled] = useState(true);
    const divRef = React.useRef();

    React.useEffect(() => {
        const breakHiererchy = (sender, nodeId) => {
            console.log(nodeId);
            let node = sender.get(nodeId);
            console.log(node);
            node.pid = null;
            node.stpid = "unasigned";
            console.log(node);
            node.tags = ["unasigned-node-card-style"];
            sender.updateNode(node);

            for (const child of sender.getNode(nodeId).children) {
                breakHiererchy(sender, child.id);
            }
        };

        const chart = new OrgChart(divRef.current, {
            nodes: jsonData,
            enableSearch: false,
            enablePan: true,
            scaleInitial: 0.6,
            enableDragDrop: true,
            roots: ["unasigned", "organigram"],
            template: "deborah",
            nodeBinding: {
                img_0: 'img',
                field_0: 'name',
                img_1: 'img2',
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

        chart.on("drag", function (sender, draggedNodeId, droppedNodeId) {
            console.log("drag started");
            if (draggedNodeId === "organigram" ||
                draggedNodeId === "unasigned" ||
                draggedNodeId === "management"
            ) return false;

            let draggedNode = sender.get(draggedNodeId);
            if (draggedNode.tags.includes("big-boss")) return false;

        });

        chart.on("drop", (sender, draggedNodeId, droppedNodeId) => {
            console.log("drop started");
            let droppedNode = sender.get(droppedNodeId);
            if (droppedNode.tags.indexOf("unasigned") !== -1 || droppedNode.tags !== null) {
                breakHiererchy(sender, draggedNodeId);
                return false;
            } else {
                return false;
            }
        });

        chart.onUpdateNode((args) => {
            console.log(args);
        });

        chart.onNodeClick((e) => {
            // console.log(e);
            console.log("node clicked");
            console.log(toggled);
            setToggled(!toggled);
            console.log(toggled);
        });

    }, []);

    return (
        <div className='flex h-screen'>
            {
                toggled ?                
                <div className="h-full w-[200px] border bg-neutral-400">true</div>
                :
                <div className="h-full w-[200px] border bg-neutral-400">false</div>
            }
            <div className='h-full w-full bg-neutral-800' id="tree" ref={divRef}></div>
        </div>
    );
}

export default Chart;
