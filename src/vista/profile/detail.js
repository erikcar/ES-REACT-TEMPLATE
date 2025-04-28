import { useData, ViewModel, UserVM } from "@essenza/react";
import React from "react";
import { Profile } from "../../widget/profile/profile";
import { notification } from "antd";

export function Vista({ vm }) {
    const [data] = useData(vm.model);
    return (
        <div className="flex place-content-center h-full items-center pt-4">
            <div className="w-full max-w-sm p-6 bg-white shadow-md drop-shadow rounded-xl ">
                <Profile user={data} rules={vm.rules} roles={vm.model.roles} />
                <button className="btn-dark bg-sec w-full mt-4" onClick={() => vm.save()}>Salva</button>
                <button className="btn-dark bg-sec w-full mt-4" onClick={() => vm.context.navigate(-1)}>Torna a elenco utenti</button>
            </div>
        </div>
    )
}

export const UserVista = ViewModel.extend(UserVM, {
    "@vista": Vista,

    $$constructor() {
        this.model.item(this.context.navdata.id);
    },

    save(){
        this.emit("PROFILE_UPDATES").then(()=>notification.success({ message: "Profilo aggiornato con successo" }));
    }
});