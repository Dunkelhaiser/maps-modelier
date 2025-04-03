import { cn } from "@utils/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { forwardRef } from "react";

const Table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
    <div className={cn("relative w-full overflow-auto rounded-md border border-border", className)}>
        <table ref={ref} className="w-full caption-bottom text-sm" {...props} />
    </div>
));
Table.displayName = "Table";

const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <thead ref={ref} className={cn("bg-muted [&_tr]:border-b", className)} {...props}>
            <TableRow className="hover:bg-muted">{props.children}</TableRow>
        </thead>
    )
);
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
    )
);
TableBody.displayName = "TableBody";

const TableFooter = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tfoot ref={ref} className={cn("border-t bg-muted font-medium [&>tr]:last:border-b-0", className)} {...props} />
    )
);
TableFooter.displayName = "TableFooter";

const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr
            ref={ref}
            className={cn(
                "border-b border-border/50 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted/75",
                className
            )}
            {...props}
        />
    )
);
TableRow.displayName = "TableRow";

const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <th
            ref={ref}
            className={cn(
                "h-10 px-2 text-left align-middle font-medium text-foreground/80 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className
            )}
            {...props}
        />
    )
);
TableHead.displayName = "TableHead";

const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <td
            ref={ref}
            className={cn(
                "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                className
            )}
            {...props}
        />
    )
);
TableCell.displayName = "TableCell";

const TableCaption = forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
    ({ className, ...props }, ref) => (
        <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
    )
);
TableCaption.displayName = "TableCaption";

type SortDirection = "asc" | "desc";

type SetSortConfig = React.Dispatch<
    React.SetStateAction<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sortBy: any;
        sortOrder: SortDirection;
    }>
>;

interface SortableTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
    sortKey: string;
    sortConfig: {
        sortBy: string;
        sortOrder: SortDirection;
    };
    setSortConfig: SetSortConfig;
    alignItems?: "left" | "center" | "right";
}

const SortableTableHead = ({
    sortKey,
    sortConfig,
    children,
    alignItems,
    className,
    ...props
}: SortableTableHeadProps) => {
    const isActive = sortConfig.sortBy === sortKey;

    return (
        <TableHead className={cn(isActive && "bg-muted/30", className)} {...props}>
            <button
                type="button"
                className={cn(
                    "flex items-center gap-1",
                    alignItems === "right" && "ml-auto",
                    alignItems === "center" && "my-auto"
                )}
                onClick={() => handleSort(sortKey, props.setSortConfig)}
            >
                <span>{children}</span>
                {isActive && (
                    <span className="text-muted-foreground">
                        {sortConfig.sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    </span>
                )}
            </button>
        </TableHead>
    );
};

const handleSort = (sortBy: string, setSortConfig: SetSortConfig) => {
    setSortConfig((prevConfig) => {
        if (prevConfig.sortBy === sortBy) {
            const newDirection = prevConfig.sortOrder === "asc" ? "desc" : "asc";
            return { sortBy, sortOrder: newDirection };
        }

        return { sortBy, sortOrder: "asc" };
    });
};

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, SortableTableHead };
