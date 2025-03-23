/* eslint-disable react/prop-types */
import React from "react";
import { ViewModel, useFormUI, FormItem, Form } from "@essenza/react";
import { Input, Select } from "antd";

function View({ data, vm }) {
    return (
        <div className="flex gap-3 my-1 p-1 items-center bg-white rounded-md">
            <span className="w-36">{data?.name}</span>
            <span className="w-36">{data?.dtype}</span>
            <Input className="w-72" defaultValue={data.label} />
            <Select className="w-72" defaultValue={data.ctype} options={vm.ctype} />
        </div>)
}
/* <Form form={form} layout="vertical" className="flex gap-3 mt-1 mb-3 bg-white rounded-md">
            <span className="w-36">{data?.name}</span>
            <span className="w-36">{data?.dtype}</span>
            <FormItem label="Label" name="label">
                <Input />
            </FormItem>
            <FormItem label="Componente" name="ctype">
                <Select options={vm.ctype} />
            </FormItem>
        </Form> */
export const Field = ViewModel.create({
    "@view": View,

    selection(checked, cmd) {
        //in teoria creo in base a selezione attuale
        checked ? this.command.set(cmd.command, cmd) : this.command.delete(cmd.command);
    },

    $$constructor() {
        //this.this.entity = this.context.navdata;
        this.ctype = [
            { label: "TextArea", value: "text" },
            { label: "Money", value: "money" },
            { label: "Checkbox", value: "bool" },
            { label: "Date Selector", value: "timestamp" },
            { label: "Date Selector TZ", value: "timestamptz" },
            { label: "Input", value: "varchar" },
            { label: "InputNumber", value: "int4" },
            { label: "InputNumberBig", value: "int8" },
            { label: "InputNumeric", value: "numeric" }, //Money
            { label: "Select Enum", value: "int2" },
            { label: "Time Selector", value: "time" },
            { label: "Time Selector TZ", value: "timetz" },
        ]
    },
});