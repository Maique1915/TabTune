import React from "react";
import { IVisualEditorProps } from "../interfaces/VisualEditor";

export abstract class AbstractVisualEditor<P extends IVisualEditorProps = IVisualEditorProps, S = {}> extends React.Component<P, S> {
  abstract render(): React.ReactNode;
  // Métodos utilitários comuns podem ser adicionados aqui
}
