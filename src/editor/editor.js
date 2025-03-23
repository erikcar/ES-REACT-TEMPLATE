/* eslint-disable react/prop-types */
import { useData, ViewModel } from "@essenza/react";
import React from "react";
import { EditorModel } from "../data/editor";
import { Tabs } from "antd";
import { Entityboard } from "./entity/board";


function Vista({ vm }) {
    let [data] = useData(vm.model);

    //if (data === null ){console.log("SOURCE NULL"); return <div>Loading</div>} 
    //TODO: gestione null data e pending semplificata, esempio un component o un hook
    return (
        <div className="flex flex-row gap-3 py-3 h-full">
            <Tabs className={"mt-2"}
                onChange={e => vm.print(e)}
                type="card"
                tabBarExtraContent={<button className="btn-dark bg-pri w-64" onClick={() => vm.print(data)}>Salva</button>}
                items={[{
                    label: `Entity`,
                    key: 0,
                    children: <div className="flex">
                        <Entityboard source={data}></Entityboard>
                   {/*      <div className="flex-auto">
                            <EntityDetail entity={vm.entity}/>
                        </div> */}
                    </div>,
                },
                {
                    label: `Tab2`,
                    key: 1,
                    children: <Entityboard></Entityboard>,
                },
                {
                    label: `Tab3`,
                    key: 2,
                    children: <Entityboard></Entityboard>,
                },
                ]}
            />
        </div>
    )
}

export const EditorVista = ViewModel.create({
    "@vista": Vista,

    $$constructor() {
        this.model = this.inject(EditorModel);
        this.model.getEntity();
        this.entity = null;
    },

    setEntity(value){
        this.entity = value;
    },

    print(value) {
        console.log(value);
    }
});