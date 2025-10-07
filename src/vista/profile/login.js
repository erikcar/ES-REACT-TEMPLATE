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
            <div className="w-full h-fit">
                    <h1 className="text-2xl lg:text-3xl font-bold ">
                        {vm.recover ? "Hai dimenticato la password?" : "Entra nell’area riservata"}
                    </h1>
                    <p className="text-sm lg:text-base mt-2 mb-6">
                        {vm.recover ? "Invieremo alla mail con cui sei registrato un link per impostare una nuova password" : ""}
                    </p>
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