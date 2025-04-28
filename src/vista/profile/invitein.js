import { useData, ViewModel, UserVM, RULES } from "@essenza/react";
import * as yup from 'yup';
import React from "react";
import { Invitein } from "../../widget/profile/invitein";

export function Vista({vm}) {
    let [data] = useData(vm.model);
    
    return (
        <div className="flex justify-center content-center pt-4">
            <div className="w-full max-w-sm p-6 shadow-md rounded-md bg-white">
                <Invitein user={data} rules={vm.rules} roles={vm.model.roles} withpass={true} />
                <button className="btn-dark bg-sec w-full mt-4" onClick={() => vm.emit("INVITEIN")}>Conferma</button>
            </div>
        </div>
    )
}

export const InviteVista = ViewModel.extend(UserVM, {
    "@vista": Vista,

    $$constructor() {
        this.model.setSource(this.model.newInstance());
        this.rules = yup.object({
            email: RULES.email(yup),
            password: RULES.password(yup),
            cpassword: RULES.confirm(yup),
        });
    },

    "@observe": {
        INVITEIN: function (token) {
            this.$base.intent.INVITEIN.call(this, token).then(() => {
                console.log("INVITEIN");
                this.context.navigate("settings");
            });
        }
    }
});