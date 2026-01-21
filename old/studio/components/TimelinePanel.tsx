import React from "react";
import { ITimelinePanelProps } from "../../interfaces/TimelinePanel";
import { AbstractTimelinePanel } from "../../abstract/AbstractTimelinePanel";

export class TimelinePanel extends AbstractTimelinePanel<ITimelinePanelProps> {
  render() {
    // ...implementar lógica específica do Studio aqui
    return <div>TimelinePanel Studio</div>;
  }
}
