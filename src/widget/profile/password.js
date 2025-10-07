import React from 'react';
import { useFragment, useFormUI, Form, FormItem } from "@essenza/react";

import { Input } from 'antd';

export function Password({ user, rules}) {
    const vm = useFragment();
    const form = useFormUI(Password, user, { rules });

    console.log("PASSWORD");

    return (
        <Form form={form} layout='vertical' className="flex flex-col gap-[16px] custom-label" >
            <FormItem label="Password attuale" name="password">
                <Input.Password placeholder="**********" autoComplete="new-password" >
                </Input.Password>
            </FormItem>
            <button className='text-xs text-sky-600 hover:text-sky-900 underline text-left bg-transparent cursor-pointer size-fit' type="text" onClick={() => vm.context.navigate("login", true)}>Password dimenticata?</button>
            <FormItem label="Scegli nuova password" name="npassword">
                <Input.Password placeholder="Inserisci la password"></Input.Password>
            </FormItem>
            <FormItem label="Conferma" name="cpassword">
                <Input.Password placeholder="Conferma la password"></Input.Password>
            </FormItem>
            <button className="cursor-pointer self-start text-sm lg:text-base font-semibold text-slate-100 hover:bg-sky-900 rounded-[4px] px-[16px] hover:px-[20px] lg:px-[32px] lg:hover:px-[40px] py-[8px] lg:py-[12px] transition-all duration-200 ease-in-out" onClick={() => vm.emit("PASSWORD_CHANGE", form)}>
                Aggiorna la password
            </button>
        </Form>
    )
}