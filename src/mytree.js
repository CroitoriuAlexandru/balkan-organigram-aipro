import React, { Component } from 'react';
import OrgChart from "@balkangraph/orgchart.js";
// import jsonData from './nodesData.json';

export default class Chart extends Component {

    constructor(props) {
        super(props);
        this.divRef = React.createRef();
        OrgChart.templates.base.node = 
        '<rect x="0" y="0" height="120" width="250" fill="#00FF00" stroke-width="1" stroke="#aeaeae" rx="7" ry="7"></rect>'
        OrgChart.templates.base.field_0 = 
        '<text data-width="125" data-text-overflow="ellipsis" style="font-size: 68px;" fill="#FF0000" x="15" y="25" text-anchor="start">{val}</text>';
        OrgChart.templates.base.field_1 = 
        '<text data-width="105" data-text-overflow="ellipsis" style="font-size: 11px;" fill="#ffffff" x="15" y="135" text-anchor="start">{val}</text>';
        OrgChart.templates.base.img_0 = 
        '<clipPath id="{randId}"><circle cx="60" cy="60" r="40"></circle></clipPath> <image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="20" y="20" width="80" height="80"></image>';
        OrgChart.templates.base.img_1 = 
        '<clipPath id="{randId}"><circle cx="600" cy="600" r="400"></circle></clipPath>        <image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="500" y="500" width="80" height="80"></image>';

        // group line
        OrgChart.templates.group.link = 
        '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="{rounded}" />';
    }
    shouldComponentUpdate() {
        return true;
    }
    breakHiererchy(sender,nodeId) {
        console.log(nodeId)
        let node = sender.get(nodeId);
        console.log(node);
        // if(node.children === undefined) return false;
        node.pid = null;
        node.stpid = "unasigned";
        console.log(node);
        node.tags = ["unasigned-node-card-style"];
        sender.updateNode(node);

        for(const child of sender.getNode(nodeId).children)
        {
            this.breakHiererchy(sender, child.id);
        }
        return false
        
     }
    componentDidMount() {
        this.chart = new OrgChart (this.divRef.current , {
            // nodes: jsonData,
            // align: OrgChart.align.orientation,
            // orientation: OrgChart.orientation.top_left,
            // anim: {func: OrgChart.anim.outBack, duration: 500},
            nodes: this.props.nodes,
            enableSearch: false,
            enablePan : true,
            scaleInitial: 0.6,
            enableDragDrop: true, 
            roots: ["unasigned", "organigram" ],
            template:"deborah",
            // collapse: {
            //     level: 5, // collapse nodes from the nth level up
            //     allChildren: true
            // },
            // expand: {
                // nodes: [8] // a list of nodes to expand
            // },
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
                        siblingSeparation: 2, // space between nodes inside this group, gap between nodes
                        template: 'ana',
                        columns: 1,
                        // align: OrgChart.align.orientation,
                        // orientation: OrgChart.orientation.top_left,
                    }
                },
                "organigram": {
                    template: "invisibleGroup",
                    subTreeConfig: {
                        siblingSeparation: 10, // space between nodes inside this group, gap between nodes
                        // columns: 2
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
                        siblingSeparation: 2, // space between nodes inside this group, gap between nodes
                        // columns: 2
                    }
                },
            },
            // nodeMenu: {
            //     details: { text: "Details" },
            //     edit: { text: "Edit" },
            //     add: { text: "Add" },
            //     remove: { text: "Remove" }
            // },
        });
        
        this.chart.on("drag", function(sender, draggedNodeId, droppedNodeId) {
            console.log("drag started");
            if(draggedNodeId === "organigram" || 
                draggedNodeId === "unasigned" ||
                draggedNodeId === "management"
            ) return false;

            let draggedNode = sender.get(draggedNodeId);
            if(draggedNode.tags.includes("big-boss")) return false; 

        });

        this.chart.on("drop", (sender, draggedNodeId, droppedNodeId) => {
            console.log("drop started");
            let droppedNode = sender.get(droppedNodeId);
            if(droppedNode.tags.indexOf( "unasigned") !== -1 || droppedNode.tags !== null)
            {
                // var draggedNode = sender.get(draggedNodeId);
                // draggedNode.stpid = droppedNodeId;
                // draggedNode.pid = null;
                this.breakHiererchy(sender,draggedNodeId);
                // sender.updateNode(draggedNode);
                return false;
                // draggedNode.pid
            } else {
                return false;
            }

            // draggedNode.stpid = droppedNodeId;

        });
        this.chart.onUpdateNode((args) => {
            console.log(args)
            //return false; to cancel the operation
            });


    }
    
    render() {
        return (
            <div className='h-full w-full bg-neutral-800' id="tree" ref={this.divRef}></div>
        );
    }
}