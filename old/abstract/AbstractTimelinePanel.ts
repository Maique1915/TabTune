import React from "react";
import { ITimelinePanelProps } from "../interfaces/TimelinePanel";

export abstract class AbstractTimelinePanel<P extends ITimelinePanelProps = ITimelinePanelProps, S = {}> extends React.Component<P, S> {
  abstract render(): React.ReactNode;
  // Métodos utilitários comuns podem ser adicionados aqui
}
