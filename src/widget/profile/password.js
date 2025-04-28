import React from 'react';
import { useFragment, useFormUI, Form, FormItem } from "@essenza/react";

import { Input } from 'antd';

export function Password({ user, rules}) {
    const vm = useFragment();
    const form = useFormUI(Password, user, { rules });

    console.log("PASSWORD");

    return (
        <Form form={form} layout='vertical' className="flex flex-col gap-3" >
            <FormItem label="Password Attuale" name="password">
                <Input.Password autoComplete="new-password" >
                </Input.Password>
            </FormItem>
            <FormItem label="Nuova Password" name="npassword">
                <Input.Password placeholder="password"></Input.Password>
            </FormItem>
            <FormItem label="Conferma Nuova Password" name="cpassword">
                <Input.Password placeholder="conferma password"></Input.Password>
            </FormItem>
            <button className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow w-full" onClick={() => vm.emit("PASSWORD_CHANGE", form)}>
                Aggiorna
            </button>
        </Form>
    )
}