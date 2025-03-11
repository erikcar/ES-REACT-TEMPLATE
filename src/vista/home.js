import React from "react";
import { Home } from "../widget/home";
import { ViewModel } from "@essenza/react"; //useData, 

function Vista({ vm }) {
    //let [data] = useData(vm.model);
    return  <Home />
}

export const HomeVista = ViewModel.create({
    "@vista": Vista,

    $$constructor() {
        //this.model = this.inject(EditorModel);
    },

    "@observe": {

    }
});