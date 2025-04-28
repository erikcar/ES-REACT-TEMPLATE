import React from 'react';
import { useFragment, useFormUI, Form, FormItem } from "@essenza/react";
import { Button, Input } from 'antd';

export function Signin({ user, rules }) {
    const vm = useFragment();
    const form = useFormUI("SIGNIN_FORM", user, { rules });

    console.log("SIGNIN");

    return (
        <Form form={form} style={{ marginTop: '24px' }} layout='vertical' className="layout-form">
            <FormItem label="Email" name="email">
                <Input disabled={true} placeholder="Email"></Input>
            </FormItem>
            <FormItem label="Inserisci Password" name="password">
                <Input.Password placeholder="password"></Input.Password>
            </FormItem>
            <FormItem label="Conferma Password" name="cpassword">
                <Input.Password placeholder="conferma password"></Input.Password>
            </FormItem>
            <FormItem className="text-center">
                <Button className='btn-dark' onClick={() => vm.emit("SIGNIN")}>
                    Registrati
                </Button>
            </FormItem>
        </Form>
    )
}