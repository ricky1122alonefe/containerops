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

import * as startSetupData from "./startSetupData";
import {initStartIO,initTreeEdit,initFromEdit,initFromView,getOutputForEvent} from "./startIO";

export function initStartSetup(start){
    startSetupData.getStartSetupData(start);
    initStartIO(start);

    // type select
    $("#type-select").val(startSetupData.getTypeSelect());
    selectType(startSetupData.getTypeSelect());

    $("#type-select").on("change",function(){
        startSetupData.setTypeSelect();
        selectType(startSetupData.getTypeSelect());
    });

    $("#type-select").select2({
        minimumResultsForSearch: Infinity
    });

    // event select
    $("#event-select").on("change",function(){
        startSetupData.setEventSelect();
        getOutputForEvent(startSetupData.getEventSelect());
    });
}

function selectType(pipelineType){
    if(pipelineType == "github" || pipelineType == "gitlab"){
        $("#event_select").show();
        $("#outputTreeViewer").show();
        $("#outputTreeDesigner").hide();
        
        $("#event-select").val(startSetupData.getEventSelect());
        $("#event-select").select2({
            minimumResultsForSearch: Infinity
        });
        getOutputForEvent(startSetupData.getEventSelect()); 
    }else{
        $("#event_select").hide();
        $("#outputTreeViewer").hide();
        $("#outputTreeDesigner").show();

        initTreeEdit();
        initFromEdit("output");
    }
}