type Direction = "North" | "South" | "East" | "West";

interface MapNode {
        x: number;
        y: number;
        code: number;
        directions?: Direction[];
        charger?: Charger;
        chute?: Chute;
        name?: string;
}

interface Charger {
    direction: Direction;
}

interface Chute {
    direction: Direction;
}

interface MapFile {
    map: {
        maxNeighborDistance: number;
        nodes: MapNode[];
    }
}