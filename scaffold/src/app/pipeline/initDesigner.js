/* 
    Copyright 2014 Huawei Technologies Co., Ltd. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License. 
*/

import * as constant from "../common/constant";

let linesView, actionsView, pipelineView, buttonView;

export function initDesigner() {
    let $div = $("#div-d3-main-svg").height($("main").height() * 2 / 3);
    let zoom = d3.behavior.zoom().on("zoom", zoomed);

    constant.setSvgWidth("100%");
    constant.setSvgHeight($div.height());
    constant.setPipelineNodeStartX(50);
    constant.setPipelineNodeStartY($div.height() * 0.2);

    $div.empty();

    let svg = d3.select("#div-d3-main-svg")
        .on("touchstart", nozoom)
        .on("touchmove", nozoom)
        .append("svg")
        .attr("width", constant.svgWidth)
        .attr("height", constant.svgHeight)
        .style("fill", "white");

    let g = svg.append("g")
        .call(zoom)
        .on("dblclick.zoom", null);

    let svgMainRect = g.append("rect")
        .attr("width", constant.svgWidth)
        .attr("height", constant.svgHeight)
        .on("click", clicked);

    linesView = g.append("g")
        .attr("width", constant.svgWidth)
        .attr("height", constant.svgHeight)
        .attr("id", "linesView");

    actionsView = g.append("g")
        .attr("width", constant.svgWidth)
        .attr("height", constant.svgHeight)
        .attr("id", "actionsView");

    pipelineView = g.append("g")
        .attr("width", constant.svgWidth)
        .attr("height", constant.svgHeight)
        .attr("id", "pipelineView");

    buttonView = g.append("g")
        .attr("width", constant.svgWidth)
        .attr("height", constant.svgHeight)
        .attr("id", "buttonView");


    let actionLinkView = g.append("g")
        .attr("width", constant.svgWidth)
        .attr("height", constant.svgHeight)
        .attr("id", "actionLinkView");


    constant.setSvg(svg);
    constant.setG(g);
    constant.setSvgMainRect(svgMainRect);
    constant.setLinesView(linesView);
    constant.setActionsView(actionsView);
    constant.setPipelineView(pipelineView);
    constant.setButtonView(buttonView);
}

function clicked(d, i) {
    constant.buttonView.selectAll("image").remove();
    if (d3.event.defaultPrevented) return; // zoomed
    d3.select(this).transition()
        .transition()
}

function zoomed() {
    pipelineView.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    actionsView.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    buttonView.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    linesView.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
}

function nozoom() {
    d3.event.preventDefault();
}
