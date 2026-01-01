import React from "react";
import { IVisualEditorProps } from "../../interfaces/VisualEditor";
import { AbstractVisualEditor } from "../../abstract/AbstractVisualEditor";

export class VisualEditor extends AbstractVisualEditor<IVisualEditorProps> {
  render() {
    // ...implementar lógica específica do Tab Editor aqui
    return <div>VisualEditor Tab Editor</div>;
  }
}
