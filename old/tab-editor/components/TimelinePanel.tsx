import React from "react";
import { ITimelinePanelProps } from "../../interfaces/TimelinePanel";
import { AbstractTimelinePanel } from "../../abstract/AbstractTimelinePanel";

export class TimelinePanel extends AbstractTimelinePanel<ITimelinePanelProps> {
  render() {
    // ...implementar lógica específica do Tab Editor aqui
    return <div>TimelinePanel Tab Editor</div>;
  }
}
