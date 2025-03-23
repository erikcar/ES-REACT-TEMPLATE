/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { ViewModel, Repeater, $Array } from "@essenza/react";
import { Button, Checkbox, Select } from "antd";
import { Entitytool } from "./tool";
import { EntityFields } from "./fields";
import { EntityElement } from "./element";
import { EditorModel } from "../../data/editor";

function Board({ source, vm }) {
    const entity = vm.entity;
    const el = vm.element;
    return (<div className="flex gap-2">
        <Repeater onSelect={e => vm.setEntity(e)}  css-box="flex-col bg-white rounded-xl" labelField="name" source={source?.entities} />

        <div className="flex-auto">
            <div className="flex">
                <Repeater onSelect={e => vm.setElement(e)}  css-box="flex-auto bg-white rounded-xl" labelField="kind" source={entity?.elements} />
                <Select onSelect={(v,i) => vm.current = i} className="w-64" options={vm.options} />
                <Button onClick={()=>vm.addElement()}>Inserisci</Button>
                <Button onClick={()=>vm.save()}>Salva</Button>
            </div>
            <div className="flex">
                <div>
                    <EntityFields entity={entity} element={el} />
                </div>
                <div className="flex-auto">
                    <EntityElement entity={entity} element={el} />
                </div>
            </div>
        </div>
    </div>)
}

export const Entityboard = ViewModel.create({
    "@view": Board,

    $$constructor() {
        this.model = this.inject(EditorModel);
        this.current = null;
        this.entity = null;
        this.element = null;
        this.options = [{ value: 'CONFIG', label: 'Config' },
        { value: 'MODEL', label: 'Model' },
        { value: 'CARD', label: 'Card' },
        { value: 'TABLE', label: 'Table' },
        { value: 'LIST', label: 'List' },
        { value: 'WIDGET', label: 'Widget' },
        { value: 'VISTA', label: 'Vista' }];
    },

    setEntity(value) {
        this.entity = value;
        this.element = value.elements ? value.elements[0] : null;
        this.update();
    },

    setElement(value) {
        this.element = value;
        this.update();
    },

    addElement() {
        this.entity.elements.push({ name: this.current.label, etype: this.entity.name, kind: this.current.value, fields: [], crud: 0 })
        this.update();
    },

    save() {
        const entity = this.entity;
        const payload = [];
        entity.elements.forEach(el => {
            if(el.crud > 0) payload.push(el);
        });
        if(payload.length > 0){
            this.model.update(payload);
        }
    },

    "@observe": {
        FIELD_EDIT({ data }) {
            const field = data.field;
            const value = data.value;
            const el = this.element;
            const fields = new Map(el.fields.map((f) => [f.name, f]));
            const f = fields.get(field.name)
            //Creo subito mappa così rappresenta original ???
            if (value) {
                if (f) {
                    delete f.crud;
                    el.crud--;
                }
                else {
                    el.fields.push({ ...field, label: field.name, crud: 0, ctype: field.dtype });
                    el.crud++;
                }
            }
            else {
                if (f.original) {
                    f.crud = 3;
                    el.crud++;
                }
                else {
                    $Array.removeItem(el.fields, f);
                    el.crud--;
                }
            }
            this.update();
        }
    }
});

function View({ source, vm }) {
    return (
        <>
            <Entitytool entity={vm.current} />
            <div className="flex flex-wrap">
                {source?.entities && source.entities.map((item, i) =>
                    <div key={i} className="w-48 border border-black">
                        <div onClick={() => vm.focus(item)} className="text-center w-full border-b border-b-black">{item.entity}</div>
                        {
                            item.fields.map((field, j) => <div key={j}>
                                <Checkbox onChange={e => vm.select(e.target.checked, field.name, item.entity)}><b>{field.name}</b>{': ' + field.type}</Checkbox>
                            </div>)
                        }
                    </div>
                )}
            </div>

        </>
    )
}