/* eslint-disable react/prop-types */
import React from "react";
import { ViewModel } from "@essenza/react";
import { Checkbox } from "antd";

function View({ entity, element, vm }) {
    if (!entity) return null;
    //const fields = config ? config[entity.name] : null;
    //const fields = element.fields;
    //const fields = new Map(element.fields.map((f) => [f.name, f]));
    const fields = new Set(element.fields.map((f) => f.name));
    return (
        <div className="flex-none border border-black">
            <div onClick={() => vm.focus(entity)} className="text-center w-full border-b border-b-black">{entity.name}</div>
            <div className="px-1">
            {
                entity.fields.map((field, j) => <div key={j}>
                    <Checkbox checked={fields.has(field.name)} onChange={e => vm.emit("FIELD_EDIT", {value: e.target.checked, field: field}).then(()=>vm.update())}><b>{field.name}</b>{': ' + field.type}</Checkbox>
                </div>)
            }
            </div>
        </div>
    )
}

export const EntityFields = ViewModel.create({
    "@view": View,

    selection(checked, cmd) {
        //in teoria creo in base a selezione attuale
        checked ? this.command.set(cmd.command, cmd) : this.command.delete(cmd.command);
    },

    $$constructor() {
        //this.this.entity = this.context.navdata;
        this.command = new Map();
    },
});