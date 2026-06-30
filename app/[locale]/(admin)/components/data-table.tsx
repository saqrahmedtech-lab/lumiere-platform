"use client";

/**
 * Reusable DataTable Component
 *
 * Usage Example:
 *
 * ```tsx
 * const columns: ColumnDef<YourDataType>[] = [
 *   {
 *     accessorKey: "name",
 *     header: "Name",
 *   },
 *   {
 *     accessorKey: "status",
 *     header: "Status",
 *     cell: ({ row }) => <Badge>{row.original.status}</Badge>,
 *   },
 * ];
 *
 * const actions: DataTableAction[] = [
 *   {
 *     id: "edit",
 *     label: "Edit",
 *     icon: <IconEdit className="size-4" />,
 *     onClick: (row) => console.log("Edit", row),
 *   },
 *   {
 *     id: "delete",
 *     label: "Delete",
 *     icon: <IconTrash className="size-4" />,
 *     variant: "destructive",
 *     onClick: (row) => console.log("Delete", row),
 *   },
 * ];
 *
 * <DataTable
 *   data={myData}
 *   columns={columns}
 *   actions={actions}
 *   sortable={true}
 *   filterableColumns={[
 *     { key: "name", label: "Name" },
 *     { key: "status", label: "Status" },
 *   ]}
 *   onRowSelect={(selectedIds) => console.log("Selected:", selectedIds)}
 * />
 * ```
 */

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export interface DataTableAction<T = unknown> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  variant?: "default" | "destructive";
  onClick: (row: T) => void;
}

export interface DataTableConfig<T> {
  data: T[];
  columns: ColumnDef<T>[];
  actions?: DataTableAction<T>[];
  sortable?: boolean;
  onRowSelect?: (rowIds: string[]) => void;
  onReorder?: (reordered: T[]) => void;
}

function DragHandle({ id }: { id: number | string }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="size-7 text-muted-foreground hover:bg-transparent"
    >
      <IconGripVertical className="size-3 text-muted-foreground" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

function ActionsCell<T extends { id?: number | string }>({
  row,
  actions,
}: {
  row: Row<T>;
  actions?: DataTableAction<T>[];
}) {
  if (!actions || actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 hover:bg-tide/10 dark:hover:bg-tide/20 text-text-secondary hover:text-tide data-[state=open]:bg-tide/10"
        >
          <IconDotsVertical className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-white dark:bg-card border border-border shadow-lg"
      >
        {actions.map((action, idx) => (
          <React.Fragment key={action.id}>
            <DropdownMenuItem
              onClick={() => action.onClick(row.original)}
              className={`cursor-pointer flex items-center ${
                action.variant === "destructive"
                  ? "hover:bg-error/10 dark:hover:bg-error/20 text-error focus:text-error"
                  : "hover:bg-tide/10 dark:hover:bg-tide/20 text-text-primary"
              }`}
            >
              {action.icon && (
                <span className="mr-2 size-4">{action.icon}</span>
              )}
              {action.label}
            </DropdownMenuItem>
            {idx < actions.length - 1 && action.variant === "destructive" && (
              <DropdownMenuSeparator className="bg-border" />
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function buildColumns<T extends { id?: number | string }>(
  columns: ColumnDef<T>[],
  config: {
    sortable?: boolean;
    actions?: DataTableAction<T>[];
  },
): ColumnDef<T>[] {
  const builtColumns: ColumnDef<T>[] = [];

  // Add drag handle if sortable
  if (config.sortable) {
    builtColumns.push({
      id: "drag",
      header: () => null,
      cell: ({ row }) => {
        const id = row.original.id;
        return id !== undefined && id !== null ? <DragHandle id={id} /> : null;
      },
      size: 40,
    } as ColumnDef<T>);
  }

  // Add select checkbox
  builtColumns.push({
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="border-tide data-[state=checked]:bg-tide data-[state=indeterminate]:bg-tide"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="border-tide data-[state=checked]:bg-tide data-[state=indeterminate]:bg-tide"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  } as ColumnDef<T>);

  // Add user columns
  builtColumns.push(...columns);

  // Add actions if provided
  if (config.actions && config.actions.length > 0) {
    builtColumns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ActionsCell row={row} actions={config.actions} />,
      enableHiding: false,
      size: 50,
    } as ColumnDef<T>);
  }

  return builtColumns;
}

function DraggableRow<T extends { id?: number | string }>({
  row,
}: {
  row: Row<T>;
}) {
  const id = row.original.id ?? `row-${row.id}`;
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 border-b border-border hover:bg-tide/5 dark:hover:bg-tide/10 data-[state=selected]:bg-tide/10 dark:data-[state=selected]:bg-tide/20 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 transition-colors"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className="py-3">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable<T extends { id?: number | string }>({
  data: initialData,
  columns: userColumns,
  actions,
  sortable = false,
  onRowSelect,
  onReorder,
}: DataTableConfig<T> & {
  columns: ColumnDef<T>[];
}) {
  const [data, setData] = React.useState<T[]>(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const isMobile = useIsMobile();

  // Sync data when prop changes (search results from parent)
  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const columns = React.useMemo(
    () => buildColumns(userColumns, { sortable, actions }),
    [userColumns, sortable, actions],
  );

  React.useEffect(() => {
    if (onRowSelect) {
      const selectedIds = Object.keys(rowSelection).filter(
        (key) => (rowSelection as Record<string, boolean>)[key],
      );
      onRowSelect(selectedIds);
    }
  }, [rowSelection, onRowSelect]);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () =>
      data?.map(({ id }) => (id !== undefined && id !== null ? id : "")) || [],
    [data],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
    getRowId: (row) => String(row.id || ""),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);
      const reordered = arrayMove(data, oldIndex, newIndex);
      setData(reordered);
      onReorder?.(reordered);
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-4 lg:gap-6"
    >
      <div className="flex flex-col gap-4 px-4 lg:px-6"></div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="w-full overflow-hidden rounded-lg border border-border shadow-sm">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <div className="w-full overflow-x-auto">
              <Table className="w-full" style={{ tableLayout: "auto" }}>
                <TableHeader className="sticky top-0 z-10 bg-tide/5 dark:bg-tide/10 border-b border-border">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="hover:bg-transparent"
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            className="h-10 px-4 py-2 font-semibold text-text-primary text-left"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-text-secondary"
                      >
                        No data available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DndContext>
        </div>
        <div className="flex flex-col gap-4 px-4">
          {/* Selection Info */}
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-tide/5 dark:bg-tide/10 px-3 py-2 text-sm">
              <span className="text-text-primary font-medium">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => table.toggleAllPageRowsSelected(false)}
                className="h-auto px-2 py-1 text-xs text-tide hover:bg-tide/20"
              >
                Clear selection
              </Button>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <Label
                htmlFor="rows-per-page"
                className="text-sm font-medium text-text-primary"
              >
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger
                  size="sm"
                  className="w-20 border-border focus:border-tide"
                  id="rows-per-page"
                >
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center text-sm text-text-primary font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-2">
              {!isMobile && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-border hover:bg-tide/5 dark:hover:bg-tide/10"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft className="size-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border hover:bg-tide/5 dark:hover:bg-tide/10"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-border hover:bg-tide/5 dark:hover:bg-tide/10"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight className="size-4" />
              </Button>
              {!isMobile && (
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 border-border hover:bg-tide/5 dark:hover:bg-tide/10"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}
