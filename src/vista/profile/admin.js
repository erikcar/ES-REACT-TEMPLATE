
import { ViewModel, UserVM, useData } from "@essenza/react";
import React from "react";
import { Dropdown, Table } from "antd";
import { LuSquareMenu } from "react-icons/lu";
import { AccessLink } from "../../widget/profile/firstaccess";

export function Vista({ vm }) {
    const [data] = useData(vm.model);

    return (
        <>
            <button className="btn-dark bg-sec my-2" onClick={() => vm.invite()}>Nuovo Utente</button>
            {Array.isArray(data) ? <Table rowKey="id" columns={Columns(vm, vm.model.roles)} dataSource={data}></Table> : <p>Nessun utente presente</p>}
        </>
    )
}

export const UserAdminVista = ViewModel.extend(UserVM, {
    "@vista": Vista,

    $$constructor() {
        this.model.collection("itype <> 1 AND archivied is not true");
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
                //icon: <MailOutlined />,
              },
            {
              label: 'Elimina',
              key: 'archivie',
              //icon: <AppstoreOutlined />,
            },
          ];
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
                return Array.isArray(roles) ? (<>{roles[record.irole]}</>) : "UTENTE"
            },
            width: "100%"
        },
        {
            key: "id",
            render: (text, record) => {
                return <Dropdown menu={{ items: vm.uitems, onClick: e => vm.doaction(e.key, record) }} trigger={['click']}>
                    <LuSquareMenu className="flex-none text-black text-2xl cursor-pointer" />
                </Dropdown>
            },
        },
    ]
}