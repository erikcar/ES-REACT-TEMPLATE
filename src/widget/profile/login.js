import React, { useEffect } from 'react';
import { useFragment, useFormUI, Form, FormItem } from "@essenza/react";

import { Button, Input } from 'antd';

export function Login({ user, rules }) {
    const vm = useFragment();
    const form = useFormUI("LOGIN_FORM", user, { rules });

    useEffect(() => {
        let instance = form.target.getFieldInstance("email");
        instance.focus();
    }, []);

    return (
        <Form form={form} layout='vertical' className="flex flex-col gap-3" >
            <FormItem label="Email" name="email">
                <Input placeholder="Email"></Input>
            </FormItem>
            <FormItem label="Inserisci Password" name="password">
                <Input.Password placeholder="password"></Input.Password>
            </FormItem>
            <button className="btn-dark bg-sec w-full mt-2" onClick={() => vm.emit("LOGIN")}>
                Login
            </button>
            <Button className='float-right text-blue-900 mt-2' type="text" onClick={() => vm.gorecover()}>Password dimenticata?</Button>
        </Form>
    )
}