/* eslint-disable react/prop-types */
import React from "react";
import { ViewModel } from "@essenza/react";

function View({ entity, vm }) {
    if(!entity) return null;
    return (
        <div className="flex flex-wrap">
            <button onClick={()=>vm.emit("ENTITY_CMD", {command: "edit", data: entity})}>Aggiorna schema</button>
            <button onClick={()=>vm.emit("ENTITY_CMD", {command: "table", data: entity})}>Crea Tabella</button>
            <button onClick={()=>vm.emit("ENTITY_CMD", {command: "form", data: entity})}>Crea Form</button>
            <button onClick={()=>vm.emit("ENTITY_CMD", {command: "form", data: entity})}>Crea Model</button>
        </div>
    )
}

export const Entitytool = ViewModel.create({
    "@view": View,

    selection(checked, cmd){
        //in teoria creo in base a selezione attuale
        checked ? this.command.set(cmd.command, cmd) : this.command.delete(cmd.command);
    },

    $$constructor() {
        //this.this.entity = this.context.navdata;
        this.command = new Map();
    },
});