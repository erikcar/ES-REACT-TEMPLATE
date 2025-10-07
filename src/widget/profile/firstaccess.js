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
                    <div className="bg-slate-100 max-w-md mx-auto rounded-2xl p-[32px] pb-[40px]">
                        <Form form={form} layout='vertical' className="flex flex-col gap-[16px] custom-label">
                            <FormItem label="Email" name="email" className="custom-disable-input">
                                <Input disabled={true} placeholder="Email"></Input>
                            </FormItem>
                            <FormItem label="Scegli nuova password" name="password">
                                <Input.Password placeholder="Inserisci la nuova password"></Input.Password>
                            </FormItem>
                            <FormItem label="Conferma nuova password" name="cpassword">
                                <Input.Password placeholder="Conferma la password"></Input.Password>
                            </FormItem>
                            <button className="btn-dark bg-sec hover:bg-sky-900 mt-4 size-fit text-left py-[8px] lg:py-[16px] px-[16px] lg:px-[32px] hover:px-[20px] lg:hover:px-[40px] rounded-sm text-sm lg:text-base font-semibold cursor-pointer transition-all delay-150 duration-300 ease-in-out" onClick={() => vm.emit("FIRST_ACCESS", { token, id, form })}>
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

export function AccessLink({ link, user, vm }) {
    //const vm = useFragment();
    return (
        <>
            <b className='text-sm'>{"Fornisci il link all'utente per effettuare il primo accesso all'app o per ripristinare l'accesso di un account."}</b>
            <p className='my-[10px] text-xs italic'>{link}</p>
            <div className='flex flex-col gap-[8px]'>
                <button className="btn-dark bg-sec hover:bg-sky-900 mt-4 size-fit text-left py-[8px] px-[16px] hover:px-[20px] rounded-sm text-sm font-semibold cursor-pointer transition-all delay-150 duration-300 ease-in-out" onClick={() => navigator.clipboard.writeText(link).then(()=>notification.success({ message: "Link copiato con successo. Adesso comunicalo all'inidirzzo email dell'account." }))}>Copia Link</button>
                <button className="text-sm text-sky-600 hover:text-sky-900 underline text-left bg-transparent cursor-pointer size-fit mb-[8px]" onClick={() => vm.model.sendLink(link, user.email).then(()=>notification.success({ message: "Link inviato con successo per email" }))}>Invia il link a {user.email}</button>
            </div>
        </>
    )
}