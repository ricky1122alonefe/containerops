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

package models

import (
	"time"

	"github.com/jinzhu/gorm"
)

const (
	//TypeSystemEvent is Event type, is definition and maintaince by the system.
	TypeSystemEvent = iota
	//TypeUserEvent is Event Type. TypeUserEvent is definition by the user, and maintaince by the system.
	TypeUserEvent
	//SourceInnerEvent is Event source type. It's cerate in the system.
	SourceInnerEvent
	//SourceOutsideEvent is Event source type. It's create from outside, like POST/PUT to a REST API interface.
	SourceOutsideEvent
	//CharacterServiceEvent is Event use for third service.
	CharacterServiceEvent
	//CharacterComponentEvent is Event use for component.
	CharacterComponentEvent

	EVENT_COMPONENT_START = "COMPONENT_START"
	EVENT_TASK_START      = "TASK_START"
	EVENT_TASK_STATUS     = "TASK_STATUS"
	EVENT_TASK_RESULT     = "TASK_RESULT"
	EVENT_COMPONENT_STOP  = "COMPONENT_STOP"
)

//EventDefinition is the event type, source and definition in the customized DevOps workflow processing.
//And the system events will be initlization with pilotage system.
type EventDefinition struct {
	ID         int64      `json:"id" gorm:"primary_key"`                         //
	Event      string     `json:"event" sql:"unique;not null;type:varchar(255)"` //Event name for query.
	Title      string     `json:"title" sql:"null;type:varchar(255)"`            //Event name for display.
	Action     int64      `json:"action" sql:"not null;default:0"`               // action's id that event bind
	Character  int64      `json:"character" sql:"not null;default:0"`            //CharacterServiceEvent or CharacterComponentEvent.
	Type       int64      `json:"type" sql:"not null;default:0"`                 //TypeSystemEvent or TypeUserEvent.
	Source     int64      `json:"source" sql:"not null;default:0"`               //SourceInnerEvent or SourceOutsideEvent.
	Definition string     `json:"type" sql:"null;type:text"`                     //Event Definition.
	CreatedAt  time.Time  `json:"created" sql:""`                                //
	UpdatedAt  time.Time  `json:"updated" sql:""`                                //
	DeletedAt  *time.Time `json:"deleted" sql:"index"`                           //
}

//TableName is return the table name of Event in MySQL database.
func (e *EventDefinition) TableName() string {
	return "event_definition"
}

func (e *EventDefinition) GetEventDefinition() *gorm.DB {
	return db.Model(&EventDefinition{})
}

//Event is execute events in the system.
type Event struct {
	ID            int64      `json:"id" gorm:"primary_key"`
	Definition    int64      `json:"definition" sql:"not null;default:0"`    //EventDefinition's ID.
	Title         string     `json:"title" sql:"not null;type:varchar(255)"` //Event Title
	Header        string     `json:"header" sql:"not null;type:text"`        //HTTP HEADER Information.
	Payload       string     `json:"payload" sql:"not null;type:text"`       //Event details.
	Authorization string     `json:"authorization" sql:"null;type:text"`     //Authorization like as Basic Authorization or Bearer Token.
	Type          int64      `json:"type" sql:"not null;default:0"`          //TypeSystemEvent or TypeUserEvent.
	Source        int64      `json:"source" sql:"not null;default:0"`        //SourceInnerEvent or SourceOutsideEvent.
	Pipeline      int64      `json:"pipeline" sql:"not null;default:0"`      //Pipeline's ID.
	Stage         int64      `json:"stage" sql:"not null;default:0"`         //Stage's ID.
	Action        int64      `json:"action" sql:"not null;default:0"`        //Action's ID.
	Sequence      int64      `json:"sequence" sql:"not null;default:0"`      //Pipeline sequence number.
	CreatedAt     time.Time  `json:"created" sql:""`                         //
	UpdatedAt     time.Time  `json:"updated" sql:""`                         //
	DeletedAt     *time.Time `json:"deleted" sql:"index"`                    //
}

//TableName is return the table name of Event in MySQL database.
func (e *Event) TableName() string {
	return "event"
}

func (e *Event) GetEvent() *gorm.DB {
	return db.Model(&Event{})
}

//Environment is Pipeline environments. All environment is Key-Value.
type Environment struct {
	ID        int64      `json:"id" gorm:"primary_key"`                //
	Pipeline  int64      `json:"pipeline" sql:"not null;default:0"`    //Pipeline's ID
	Sequence  int64      `json:"sequence" sql:"not null;default:0"`    //Pipeline sequence number
	Key       string     `json:"key" sql:"not null;type:varchar(255)"` //Environment's key
	Value     string     `json:"value" sql:"not null;type:text"`       //Environment's value
	CreatedAt time.Time  `json:"created" sql:""`                       //
	UpdatedAt time.Time  `json:"updated" sql:""`                       //
	DeletedAt *time.Time `json:"deleted" sql:"index"`                  //
}

//TableName is return the name of Outcome in MySQL database.
func (e *Environment) TableName() string {
	return "environment"
}

func (e *Environment) GetEnvironment() *gorm.DB {
	return db.Model(&Environment{})
}
