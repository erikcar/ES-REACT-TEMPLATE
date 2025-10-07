
import { ViewModel, UserVM, useData, InputFilter } from "@essenza/react";
import React from "react";
import { Dropdown, Table } from "antd";
import { LuSquareMenu } from "react-icons/lu";
import { CiSearch, CiSquareMore, CiSquarePlus } from "react-icons/ci";
import { AccessLink } from "../../widget/profile/firstaccess";

export function Vista({ vm }) {
    const [data] = useData(vm.model);

    return (
        <>
            <div className="flex items-center bg-white py-2 px-4 rounded-md my-4 gap-20">
                <h1 className="font-bold flex-none">Gestione Utenti</h1>
                <div className="flex-none py-1 px-2 w-72 bg-gray-100 rounded-md flex items-center gap-2 text">
                    <CiSearch className="text-[#90a1b9]" />
                    <InputFilter className="!bg-transparent w-auto grow focus-visible:outline-0 text-[#90a1b9]" field="surname" orField="name" source={data} model={vm.model} placeholder="Cerca per cognome"></InputFilter>
                </div>
                <div className="flex-auto"> </div>
                <div onClick={() => vm.onOption('new')} className="flex gap-2 font-semibold text-base underline cursor-pointer items-center "><CiSquarePlus />Aggiungi utente</div>
            </div>
            {Array.isArray(data) ? <Table rowKey="id" columns={Columns(vm, vm.model.roles)} pagination={false} dataSource={data}></Table> : <p>Nessun utente presente</p>}
        </>
    )
}

export const UserAdminVista = ViewModel.extend(UserVM, {
    "@vista": Vista,

    $$constructor() {
        this.model.collection("itype < 100 AND archivied is not true ORDER BY surname, name");
        this.LinkWidget = AccessLink;
        this.uitems = [
            {
                label: 'Modifica',
                key: 'detail',
                //icon: <MailOutlined />,
            },
            {
                label: 'Crea link accesso App',
                key: 'link',
            },
            {
                label: 'Elimina',
                key: 'archivie',
            },
        ];
    },

    onOption(key) {
        switch (key) {
            case 'new':
                this.context.navigate("invite");
                break;
            case 'delete':
                this.delete();
                break;
            default:
                break;
        }
    },

    invite() {
        this.context.navigate("invite");
    },

    detail(item) {
        this.context.navigate("user-detail", item);
    },
});

function Columns(vm, roles) {
    return [
        {
            title: "Cognome",
            dataIndex: "surname",
            key: "id",
        },
        {
            title: "Nome",
            dataIndex: "name",
            key: "id",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "id",
        },
        {
            title: "Ruolo",
            dataIndex: "itype",
            key: "id",
            render: (text, record) => {
                return Array.isArray(roles) ? (<>{roles[record.itype]}</>) : "UTENTE"
            },
            width: "100%"
        },
        {
            key: "id",
            title: "Azioni",
            render: (text, record) => {
                return <Dropdown menu={{ items: vm.uitems, onClick: e => vm.doaction(e.key, record) }} trigger={['click']}>
                    <LuSquareMenu className="flex-none text-black text-2xl cursor-pointer" />
                </Dropdown>
            },
        },
    ]
}