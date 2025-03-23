/* eslint-disable react/prop-types */
import React from "react";
import { ViewModel } from "@essenza/react";
import { Field } from "./field";
import { Input } from "antd";

function View({ entity, element, vm }) {
    if (!entity) return null;
    //const fields = config ? config[entity.name] : null;
    const fields = element.fields;
    return (
        <div className="flex gap-2">
            <div className="flex-none border border-black">
                <div className="flex p-1 items-center gap-1">
                    <span>{element.kind}: </span>
                    <Input value={element.name} onChange={v => vm.nameChanged(v)}></Input>
                </div>
                <div className="text-center w-full border-b border-b-black">Fields</div>
                <div className="px-1">
                    {
                        fields.map((field, j) => <div key={j}>
                            <Field data={field} />
                            {/* <Checkbox defaultChecked={fields && Object.prototype.hasOwnProperty.call(fields, field.name)} onChange={e => vm.select(e.target.checked, field.name, entity.entity)}><b>{field.name}</b>{': ' + field.type}</Checkbox> */}
                        </div>)
                    }
                </div>
            </div>
            {
                element.queries &&
                <div className="flex-none border border-black">
                    <div className="text-center w-full border-b border-b-black">Queries</div>
                    <div>{element.queries.map((q, i) => <span key={i}>{q.name}</span>)}</div>
                </div>
            }
        </div>
    )
}

export const EntityElement = ViewModel.create({
    "@view": View,

    $$constructor() {
        //this.this.entity = this.context.navdata;
        this.command = new Map();
    },

    nameChanged(e){
        const v = e.target.value;
        console.log("NAME CHANGED", v);
        this.props.element.name = v;
        this.update();
    }
});