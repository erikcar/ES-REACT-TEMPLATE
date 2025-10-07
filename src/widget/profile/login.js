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
            <button className='text-xs text-sky-600 hover:text-sky-900 underline text-left bg-transparent cursor-pointer size-fit' type="text" onClick={() => vm.gorecover()}>Password dimenticata?</button>
            <button className="btn-dark bg-sec hover:bg-sky-900 mt-4 size-fit text-left py-[8px] lg:py-[16px] px-[16px] lg:px-[32px] hover:px-[20px] lg:hover:px-[40px] rounded-sm text-sm lg:text-base font-semibold cursor-pointer transition-all delay-150 duration-300 ease-in-out" onClick={() => vm.emit("LOGIN")}>
                Accedi
            </button>
        </Form>
    )
}