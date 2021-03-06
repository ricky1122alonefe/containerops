/* Copyright 2014 Huawei Technologies Co., Ltd. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

import {getAllComponents,getComponent,addComponent,addComponentVersion,saveComponent,validateComponent} from "./componentData";
import {initComponentIO} from "./componentIO";
import {initComponentSetup} from "./componentSetup";
import {notify} from "../common/notify";
import {loading} from "../common/loading";

export let allComponents;

export let componentData;
let componentName, componentVersion,componentVersionID;

export function initComponentPage(){
    loading.show();
    var promise = getAllComponents();
    promise.done(function(data){
        loading.hide();
        allComponents = data.list;
        if(allComponents.length>0){
            showComponentList();
        }else{
            showNoComponent();
        }
    });
    promise.fail(function(xhr,status,error){
        loading.hide();
        if(xhr.responseJSON.errMsg){
            notify(xhr.responseJSON.errMsg,"error");
        }else{
            notify("Server is unreachable","error");
        }
    });    
}

function showComponentList(){
    $.ajax({
        url: "../../templates/component/componentList.html",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#main").html($(data));    
            $("#componentlist").show("slow");

            $(".newcomponent").on('click',function(){
                showNewComponent();
            }) 

            $(".componentlist_body").empty();
            _.each(allComponents,function(item){
                var pprow = '<tr style="height:50px"><td class="pptd">'
                        +'<span class="glyphicon glyphicon-menu-down treeclose" data-name="'+item.name+'"></span>&nbsp;'
                        +'<span class="glyphicon glyphicon-menu-right treeopen" data-name="'+item.name+'"></span>&nbsp;' 
                        + item.name + '</td><td></td><td></td></tr>';
                $(".componentlist_body").append(pprow);
                _.each(item.version,function(version){
                    var vrow = '<tr data-pname="' + item.name + '" data-version="' + version.version + '" data-versionid="' + version.id + '" style="height:50px">'
                            +'<td></td><td class="pptd">' + version.version + '</td>'
                            +'<td><button type="button" class="btn btn-primary ppview">View</button></td></tr>';
                    $(".componentlist_body").append(vrow);
                })
            }) ;

            $(".treeclose").on("click",function(event){
                var target = $(event.currentTarget);
                target.hide();
                target.next().show();
                var name = target.data("name");
                $('*[data-pname='+name+']').hide();
            });

            $(".treeopen").on("click",function(event){
                var target = $(event.currentTarget);
                target.hide();
                target.prev().show();
                var name = target.data("name");
                $('*[data-pname='+name+']').show();
            });

            $(".ppview").on("click",function(event){
                var target = $(event.currentTarget);
                componentName = target.parent().parent().data("pname");
                componentVersion = target.parent().parent().data("version");
                componentVersionID = target.parent().parent().data("versionid");
                getComponentData();
            })
        }
    });
}

function getComponentData(){
    loading.show();
    var promise = getComponent(componentName,componentVersionID);
    promise.done(function(data){
        loading.hide();
        componentData = data;
        showComponentDesigner();
    });
    promise.fail(function(xhr,status,error){
        loading.hide();
        if(xhr.responseJSON.errMsg){
            notify(xhr.responseJSON.errMsg,"error");
        }else{
            notify("Server is unreachable","error");
        }
    });
}

function showNoComponent(){
    $.ajax({
        url: "../../templates/component/noComponent.html",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#main").html($(data));    
            $("#nocomponent").show("slow");
            $(".newcomponent").on('click',function(){
                showNewComponent();
            })  
        }
    });
}

export function showNewComponent(fromPipeline){
    $.ajax({
        url: "../../templates/component/newComponent.html",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#main").children().hide();
            $("#main").append($(data));    
            $("#newcomponent").show("slow");
            $("#newComponentBtn").on('click',function(){
                var promise = addComponent();
                if(promise){
                    loading.show();
                    promise.done(function(data){
                        loading.hide();
                        notify(data.message,"success");
                        initComponentPage();
                    });
                    promise.fail(function(xhr,status,error){
                        loading.hide();
                        if(xhr.responseJSON.errMsg){
                            notify(xhr.responseJSON.errMsg,"error");
                        }else{
                            notify("Server is unreachable","error");
                        }
                    });
                }
            })
            $("#cancelNewComponentBtn").on('click',function(){
                if(fromPipeline){
                    $(".menu-component").parent().removeClass("active");
                    $(".menu-pipeline").parent().addClass("active");
                }
                cancelNewComponentPage();
            })
        }
    });
}

function showComponentDesigner(){  
    $.ajax({
        url: "../../templates/component/componentDesign.html",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#main").html($(data));    
            $("#componentdesign").show("slow"); 

            $("#selected_component").text(componentName + " / " + componentVersion); 

            $(".backtolist").on('click',function(){
                initComponentPage();
            });

            $(".savecomponent").on('click',function(){
                if(validateComponent(componentData)){
                    var promise = saveComponent(componentName, componentVersion, componentVersionID, componentData);
                    loading.show();
                    promise.done(function(data){
                        loading.hide();
                        notify(data.message,"success");
                    });
                    promise.fail(function(xhr,status,error){
                        loading.hide();
                        if(xhr.responseJSON.errMsg){
                            notify(xhr.responseJSON.errMsg,"error");
                        }else{
                            notify("Server is unreachable","error");
                        }
                    });
                } 
            });

            $(".newcomponentversion").on('click',function(){
                if(validateComponent(componentData)){
                    showNewComponentVersion();
                }
            });

            $(".newcomponent").on('click',function(){
                showNewComponent();
            });

            initComponentEdit();
        }
    }); 
}

function initComponentEdit(){
    $.ajax({
        url: "../../templates/component/componentEdit.html",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#componentDesigner").html($(data));

            initComponentSetup(componentData);

            initComponentIO(componentData);

            // view select init
            $("#action-component-select").select2({
               minimumResultsForSearch: Infinity
             });
            // $("#k8s-service-protocol").select2({
            //    minimumResultsForSearch: Infinity
            // });      
        }
    });
}

function showNewComponentVersion(){
    $.ajax({
        url: "../../templates/component/newComponentVersion.html",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#main").children().hide();
            $("#main").append($(data));    
            $("#newcomponentversion").show("slow"); 

            $("#c-name-newversion").val(componentName);

            $("#newComponentVersionBtn").on('click',function(){
                var promise = addComponentVersion(componentName,componentVersionID,componentData);
                if(promise){
                    loading.show();
                    promise.done(function(data){
                        loading.hide();
                        notify(data.message,"success");
                        initComponentPage();
                    });
                    promise.fail(function(xhr,status,error){
                        loading.hide();
                        if(xhr.responseJSON.errMsg){
                            notify(xhr.responseJSON.errMsg,"error");
                        }else{
                            notify("Server is unreachable","error");
                        }
                    });
                }
            })
            $("#cancelNewComponentVersionBtn").on('click',function(){
                cancelNewComponentVersionPage();
            })      
        }
    }); 
    
    $("#content").hide();
    $("#nocomponent").hide();
    $("#newcomponent").hide();
    $("#newcomponentversion").show("slow");
}

function cancelNewComponentPage(){
    $("#newcomponent").remove();
    $("#main").children().show("slow");
}

function cancelNewComponentVersionPage(){
    $("#newcomponentversion").remove();
    $("#main").children().show("slow");
}

// $("#pipeline-select").on('change',function(){
//     showVersionList();
// })
// $("#version-select").on('change',function(){
//     showPipeline();
// })

// function showPipelineList(){
//     $("#pipeline-select").empty();
//     d3.select("#pipeline-select")
//         .selectAll("option")
//         .data(allPipelines)
//         .enter()
//         .append("option")
//         .attr("value",function(d,i){
//             return d.name;
//         })
//         .text(function(d,i){
//             return d.name;
//         }); 
//      $("#pipeline-select").select2({
//        minimumResultsForSearch: Infinity
//      });   
//     showVersionList();
// }

// function showVersionList(){
//     var pipeline = $("#pipeline-select").val();
//     var versions = _.find(allPipelines,function(item){
//         return item.name == pipeline;
//     }).versions;

//     $("#version-select").empty();
//     d3.select("#version-select")
//         .selectAll("option")
//         .data(versions)
//         .enter()
//         .append("option")
//         .attr("value",function(d,i){
//             return d.version;
//         })
//         .text(function(d,i){
//             return d.version;
//         }); 
//     $("#version-select").select2({
//        minimumResultsForSearch: Infinity
//      });
    
//     versions_shown = versions;

//     showPipeline(); 
// }
