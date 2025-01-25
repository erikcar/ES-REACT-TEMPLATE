import React from 'react';
import { useWidget, UserVM, Widget, useForm, Form, FormItem } from "@essenza/react";

import { Button, Input } from 'antd';

export function Password({ user, rules }) {
    const vm = useWidget(UserVM);
    const form = useForm(user, { rules });

    console.log("PASSWORD");

    return (
        <Widget>
            <Form form={form}  layout='vertical' className="flex flex-col gap-3" >
                <FormItem label="Email" name="email">
                    <Input placeholder="Email"></Input>
                </FormItem>
                <FormItem label="Password Attuale" name="tpassword">
                    <Input.Password autoComplete="new-password" >
                    </Input.Password>
                </FormItem>
                <FormItem label="Nuova Password" name="password">
                    <Input.Password placeholder="password"></Input.Password>
                </FormItem>
                <FormItem label="Conferma Nuova Password" name="cpassword">
                    <Input.Password placeholder="conferma password"></Input.Password>
                </FormItem>
                <button className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow w-full" onClick={() => vm.emit("PASSWORD_CHANGE")}>
                    Aggiorna
                </button>
            </Form>
        </Widget>
    )
}