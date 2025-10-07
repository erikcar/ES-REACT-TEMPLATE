import React from 'react';
import { useFragment, useFormUI, Form, FormItem } from "@essenza/react";

import { Button, Input, notification } from 'antd';

export const Recover = ({ user, rules }) => {
    const vm = useFragment();
    const form = useFormUI("RECOVER_FORM", user, { rules });

    console.log("RECOVER");

    return (
        <Form form={form} layout='vertical' className="flex flex-col gap-2">
            <FormItem label="E-mail" name="email">
                <Input />
            </FormItem>
            <button className="btn-dark bg-sec w-full mt-4" onClick={() => {
                vm.emit("RECOVER").then(() => notification.info({
                    message: "Controlla la tua mail per recuperare la password! Se entro pochi minuti non ricevi la mail di recupero, verifica se è finita nello spam oppure invia una nuova richiesta"
                }));

            }}>
                Inviami il link
            </button>
            <button className='text-xs text-sky-600 hover:text-sky-900 underline text-left bg-transparent cursor-pointer size-fit mt-4' type="text" onClick={() => vm.gologin()}>Ritorna al login</button>
        </Form>
    )
};