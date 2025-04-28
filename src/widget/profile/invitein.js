import { useFormUI, Form, FormItem } from "@essenza/react";
import { Input, Select } from 'antd';
import React from "react";
const { Option } = Select;

export function Invitein({ user, rules, roles, withpass }) {
    const form = useFormUI("INVITE_FORM", user, { rules });
    return (
        <Form form={form} layout="vertical" className="flex flex-col gap-2">
            <FormItem label="Nome" name="name">
                <Input placeholder="Mario"></Input>
            </FormItem>
            <FormItem label="Cognome" name="surname">
                <Input placeholder="Rossi"></Input>
            </FormItem>
            <FormItem label="Email" name="email">
                <Input placeholder="email@email.it"></Input>
            </FormItem>
            <FormItem label="Telefono" name="phone">
                <Input placeholder="Es. 333 1234567"></Input>
            </FormItem>
            {
                roles &&
                <>
                    <FormItem label="Tipo" name="itype">
                        <Select placeholder="Tipo Utente" className="w100">
                            {roles.map((v, i) => <Option key={i} value={i}>{v}</Option>)}
                        </Select>
                    </FormItem>
                </>
            }
            {
                withpass &&
                <>
                    <FormItem label="Password" name="password">
                        <Input.Password />
                    </FormItem>
                    <FormItem label="Conferma Password" name="cpassword">
                        <Input.Password />
                    </FormItem>
                </>
            }
        </Form>
    )
}







