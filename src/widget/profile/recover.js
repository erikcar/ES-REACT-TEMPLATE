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
                Invia Richiesta
            </button>
            <Button className='float-right text-blue-900 mt-2' type="text" onClick={() => vm.gologin()}>Ritorna a Login</Button>
        </Form>
    )
};