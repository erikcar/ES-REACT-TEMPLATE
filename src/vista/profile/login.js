import { ViewModel, UserVM, RULES } from "@essenza/react";
import { Login } from "../../widget/profile/login";
import { Logo } from "../../layout/logo";
import * as yup from 'yup';
import { Recover } from "../../widget/profile/recover";
import React from 'react'

export function Vista({ vm }) {
    return (
        <div className="flex flex-col place-content-center h-screen items-center">
            <Logo className="mb-6 max-w-xs" />
            <div className="w-full max-w-sm h-fit p-6 bg-white shadow-md rounded ">
                <h1 className="my-4 text-right">
                    {vm.recover ? "Recupera password!" : ""}
                </h1>
                {
                    vm.recover
                        ? <Recover user={vm.model.newInstance()} rules={vm.rules} es-id="recover" />
                        : <Login user={vm.model.newInstance()} rules={vm.rules} />
                }
            </div>
        </div>
    )
}

export const LoginVista = ViewModel.extend(UserVM, {
    "@vista": Vista,

    $$constructor() {
        this.recover = false;
        this.rules = yup.object({
            email: RULES.email(yup),
            password: RULES.password(yup),
        })
    },

    gorecover() {
        this.recover = true;
        this.update();
    },

    gologin() {
        this.recover = false;
        this.update();
    }
});