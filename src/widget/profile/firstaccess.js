import React from 'react';
import { UserVM, useForm, Form, FormItem, ViewModel} from "@essenza/react";

import { Input } from 'antd';

function Widget({ vm, user, rules, token, id }) {
    const form = useForm(user, { rules });
    console.log("FIRST ACCESS Query Params", token, id);
    return (
        <>
            {
                token ?
                    <div className="w-full max-w-md mx-auto p-6 bg-white shadow-md rounded ">
                        <Form form={form} layout='vertical' className="flex flex-col gap-3">
                            <FormItem label="Email" name="email">
                                <Input disabled={true} placeholder="Email"></Input>
                            </FormItem>
                            <FormItem label="Inserisci Password" name="password">
                                <Input.Password placeholder="password"></Input.Password>
                            </FormItem>
                            <FormItem label="Conferma Password" name="cpassword">
                                <Input.Password placeholder="conferma password"></Input.Password>
                            </FormItem>
                            <button className="btn-dark bg-sec w-full" onClick={() => vm.emit("FIRST_ACCESS", { token, id, form })}>
                                Conferma
                            </button>
                        </Form>
                    </div>
                    :
                    <h6>Richiesta scaduta o non valida.</h6>
            }
        </>
    )
}

export const FirstAccess = ViewModel.use(UserVM, Widget);