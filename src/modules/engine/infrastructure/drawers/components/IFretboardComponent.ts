export interface IFretboardComponent {
    /**
     * Draws the component using the provided context.
     */
    draw(ctx: CanvasRenderingContext2D): void;

    /**
     * Updates the component's internal state (e.g., for animations).
     * @param progress A value between 0 and 1.
     */
    update(progress: number): void;

    /**
     * Returns the bounding box of the component in pixels.
     */
    getBounds(): { x: number; y: number; width: number; height: number };

    /**
     * Validates the input data for the component.
     * Throws an error or returns false if data is invalid (e.g., string 7 out of 6).
     */
    validate(): boolean;
}
