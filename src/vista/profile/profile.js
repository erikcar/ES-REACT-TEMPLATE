import React from 'react'
import { ViewModel, UserVM, useData } from "@essenza/react";
import { notification } from "antd";
import { Profile } from "../../widget/profile/profile";
import { Password } from "../../widget/profile/password";

function Vista({ vm }) {
    let [data] = useData(vm.model);
    return (
        <div className="flex flex-col pt-3 max-w-md mx-auto gap-3">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg ">
                <Profile es-id="profile" user={data} rules={vm.rules} title="Utente" />
                <button className="btn-dark bg-green-800 mt-3 w-full" onClick={() => vm.emit("SAVE")}>Salva</button>
            </div>
            <div className="w-full max-w-md p-6 bg-white drop-shadow shadow-md  rounded-xl ">
                <Password user={data} rules={vm.rules} />
            </div>
        </div>
    )
}

export const ProfileVista = ViewModel.extend(UserVM, {
    "@vista": Vista,

    $$constructor() {
        this.model.profile();
    },

    "@observe": {
        PASSWORD_CHANGE: function (token) {
            this.$base.intent.PASSWORD_CHANGE.call(this, token).then(() => {
                console.log("PASSWORD_CHANGED");
                notification.success({ message: "Password aggiornata con successo" });
            });
        }
    }
});