import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/ui/Tooltip";
import { useState, useMemo } from "react";
import { ParliamentGroup, PoliticalPartyBase } from "src/shared/types";

interface Props {
    seatsNumber: number;
    groups: ParliamentGroup[];
}

const ParliamentVisualization = ({ seatsNumber, groups }: Props) => {
    const [hoveredSeat, setHoveredSeat] = useState<{
        party: PoliticalPartyBase & { seats: number };
        index: number;
    } | null>(null);

    // calculate seat positions in a semicircle
    const { seatPositions, svgDimensions } = useMemo(() => {
        const seatCountFactor = Math.sqrt(Math.max(100, seatsNumber)) / 10;
        const baseRadius = 50 * seatCountFactor;

        const dotSize = Math.max(2, Math.min(8, 250 / Math.sqrt(seatsNumber)));
        const dotSpacing = dotSize * 0.4;
        const effectiveDotSize = dotSize + dotSpacing;

        const rows = [];
        let remainingSeats = seatsNumber;
        let rowIndex = 0;
        let maxRadius = 0;

        // calculate how many seats can fit in each row
        while (remainingSeats > 0) {
            const rowRadius = baseRadius + rowIndex * effectiveDotSize;
            maxRadius = Math.max(maxRadius, rowRadius);

            const rowCircumference = Math.PI * rowRadius;
            const seatsInRow = Math.min(Math.floor(rowCircumference / effectiveDotSize), remainingSeats);

            if (seatsInRow <= 0) break;

            rows.push({
                radius: rowRadius,
                seatCount: seatsInRow,
            });

            remainingSeats -= seatsInRow;
            rowIndex++;
        }

        interface RowPosition {
            x: number;
            y: number;
            radius: number;
            rowIdx: number;
            seatIdx: number;
            angle: number;
        }

        const allPositions: RowPosition[][] = [];

        // generate positions for each row
        rows.forEach((row, rowIdx) => {
            const positions = [];
            const angleStep = Math.PI / (row.seatCount - 1 || 1);

            for (let seatIdx = 0; seatIdx < row.seatCount; seatIdx++) {
                const angle = seatIdx * angleStep;
                positions.push({
                    x: row.radius * Math.cos(angle),
                    y: -row.radius * Math.sin(angle),
                    radius: dotSize / 2,
                    rowIdx,
                    seatIdx,
                    angle,
                });
            }

            allPositions.push(positions);
        });

        const finalPositions = [];

        const maxColumns = Math.max(...rows.map((row) => row.seatCount));

        // zigzag pattern
        for (let columnIdx = 0; columnIdx < maxColumns; columnIdx++) {
            const isEvenColumn = columnIdx % 2 === 0;

            const rowsToProcess = isEvenColumn
                ? [...Array(rows.length).keys()] // bottom to top
                : [...Array(rows.length).keys()].reverse(); // top to bottom

            for (const rowIdx of rowsToProcess) {
                const rowPositions: (RowPosition | null)[] = allPositions[rowIdx];

                const colPositionRatio = columnIdx / (maxColumns - 1 || 1);
                const targetSeatIdx = Math.floor(colPositionRatio * (rowPositions.length - 1));

                if (rowPositions[targetSeatIdx]) {
                    finalPositions.push(rowPositions[targetSeatIdx]);
                    rowPositions[targetSeatIdx] = null;
                }
            }
        }

        allPositions
            .flat()
            .filter(Boolean)
            .forEach((pos) => {
                if (finalPositions.length < seatsNumber) {
                    finalPositions.push(pos);
                }
            });

        const adjustedPositions = finalPositions.slice(0, seatsNumber);

        const width = maxRadius * 2 + dotSize * 2;
        const height = maxRadius + dotSize * 2;

        const padding = 10;

        return {
            seatPositions: adjustedPositions,
            svgDimensions: {
                width,
                height,
                viewBox: `${-width / 2 - padding} ${-height - padding} ${width + padding * 2} ${height + padding * 2}`,
            },
        };
    }, [seatsNumber]);

    const seats = useMemo(() => {
        const partiedSeats: { party: PoliticalPartyBase & { seats: number }; side: string }[] = [];

        groups.forEach((group) => {
            group.parties.forEach((party) => {
                for (let i = 0; i < party.seats; i++) {
                    partiedSeats.push({ party, side: group.side });
                }
            });
        });

        const emptySeats = seatsNumber - partiedSeats.length;
        const emptySeatsArray: { party: PoliticalPartyBase & { seats: number }; side: string }[] = [];

        if (emptySeats > 0) {
            for (let i = 0; i < emptySeats; i++) {
                emptySeatsArray.push({
                    party: { id: -1, name: "Empty Seat", color: "#FFFFFF", acronym: null, seats: emptySeats },
                    side: "empty",
                });
            }
        }

        const sortOrder = {
            opposition: 1,
            empty: 2,
            neutral: 3,
            ruling_coalition: 4,
        };

        return [...partiedSeats, ...emptySeatsArray].sort(
            (a, b) => sortOrder[a.side as keyof typeof sortOrder] - sortOrder[b.side as keyof typeof sortOrder]
        );
    }, [groups, seatsNumber]);

    return (
        <TooltipProvider>
            <div className="my-4 flex w-full justify-center">
                <div className="relative w-full max-w-[500px]">
                    <svg
                        viewBox={svgDimensions.viewBox}
                        width="100%"
                        style={{
                            aspectRatio: `${svgDimensions.width} / ${svgDimensions.height}`,
                            overflow: "visible",
                        }}
                        className="max-h-[200px]"
                    >
                        {seatPositions.map((position, index) => {
                            const seatInfo = seats[index];

                            const isHovered =
                                (hoveredSeat &&
                                    hoveredSeat.party.id === seatInfo.party.id &&
                                    hoveredSeat.index === index) ??
                                false;

                            return (
                                <Tooltip
                                    key={`${seatInfo.party.id}-${position.x}-${position.y}`}
                                    delayDuration={0}
                                    open={isHovered}
                                >
                                    <TooltipTrigger asChild>
                                        <circle
                                            cx={position.x}
                                            cy={position.y}
                                            r={position.radius}
                                            fill={seatInfo.party.color}
                                            stroke={isHovered ? "#000" : "rgba(0,0,0,0.2)"}
                                            strokeWidth={isHovered ? 1.5 : 0.5}
                                            className="transition-opacity duration-200"
                                            style={{
                                                opacity:
                                                    // eslint-disable-next-line no-nested-ternary
                                                    hoveredSeat === null || isHovered
                                                        ? 1
                                                        : hoveredSeat.party.id === seatInfo.party.id
                                                          ? 0.85
                                                          : 0.35,
                                                cursor: "pointer",
                                            }}
                                            onMouseEnter={() => setHoveredSeat({ party: seatInfo.party, index })}
                                            onMouseLeave={() => setHoveredSeat(null)}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="flex flex-col">
                                        <p className="font-medium">
                                            {seatInfo.party.name}{" "}
                                            {seatInfo.party.acronym && (
                                                <span className="text-xs text-primary-foreground/70">
                                                    ({seatInfo.party.acronym})
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs">
                                            {seatInfo.party.seats} {seatInfo.party.seats === 1 ? "seat" : "seats"} (
                                            {((seatInfo.party.seats / seatsNumber) * 100).toFixed(1)}%)
                                        </p>
                                        {seatInfo.side !== "empty" && (
                                            <p className="text-xs capitalize">{seatInfo.side.replace("_", " ")}</p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </svg>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default ParliamentVisualization;
