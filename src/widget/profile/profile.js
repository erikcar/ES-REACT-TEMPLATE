import React from 'react'
import { useFormUI, Form, FormItem, ViewModel } from "@essenza/react";
import { Input, Select } from 'antd';
const { Option } = Select;

function Widget({ source, vm, roles, title }) {
    const form = useFormUI(Profile, source, { rules: vm.rules });
    return (
        <>
            <h1 className="font-bold text-xl">{title || 'Responsabile Azienda'}</h1>
            <Form form={form} layout='vertical' className="flex flex-col gap-2" >
                <FormItem label="Nome" name="name">
                    <Input placeholder="Es. Mario"></Input>
                </FormItem>
                <FormItem label="Cognome" name="surname">
                    <Input placeholder="Es. Rossi"></Input>
                </FormItem>
                <FormItem label="Email" name="email">
                    <Input placeholder="Es. email@email.it"></Input>
                </FormItem>
                <FormItem label="Telefono" name="phone">
                    <Input placeholder="Es. 333 1234567"></Input>
                </FormItem>
                <FormItem label="Azienda" name="businessname">
                    <Input placeholder="Nome Azienda"></Input>
                </FormItem>
                {
                    roles &&
                    <>
                        <FormItem label="Tipo" name="irole">
                            <Select placeholder="Tipo Utente" className="w100">
                                {roles.map((v, i) => <Option key={i} value={i}>{v}</Option>)}
                            </Select>
                        </FormItem>
                    </>
                }
            </Form>
        </>
    )
}

export const Profile = ViewModel.create({
    "@view": Widget,

    $$constructor() {
    },

    "@observe": {

    }
});