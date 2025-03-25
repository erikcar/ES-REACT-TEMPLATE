import { DataModel, core } from "@essenza/react";

export function EditorModel() {
    DataModel.call(this);
}

core.prototypeOf(DataModel, EditorModel, {
    etype: "editor",

    getEntity() {
        return this.ExecuteQuery("http://localhost:3001/api/entity");
    },

    update(elements) {
        return this.ExecuteApi("http://localhost:3001/api/update", elements, {excludeParams: true});
    },
});