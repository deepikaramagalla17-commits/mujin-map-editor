export type Direction = "North" | "South" | "East" | "West";
export interface MapNode {
    x: number;
    y: number;
    code: number;
    directions?: Direction[];
    charger?: Charger;
    chute?: Chute;
    name?: string;
}
export interface Charger {
    direction: Direction;
}
export interface Chute {
    direction: Direction;
}
export interface MapFile {
    map: {
        maxNeighborDistance: number;
        nodes: MapNode[];
    };
}
//# sourceMappingURL=types.d.ts.map