import { PendingOutlined } from "@mui/icons-material";
import { useMemo, useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import {
    IconButton, TableCell, Menu, Tooltip, Checkbox, Radio, Typography, Box,
    Autocomplete, TextField, TableContainer, Table, TableRow, TableBody,
    CircularProgress
} from "@mui/material";

import Helpers from "commons/helpers";
import Strings from "constants/strings";
import Constants from "constants/constants";
import DataNotFound from "components/DataNotFound";
import DataTableHeadCell from "./DataTableHeadCell";
import DataTableBodyCell from "./DataTableBodyCell";
import CustomMenuItem from "components/CustomMenuItem";
import CustomPagination from "components/CustomPagination";

import { IActionMenuItem } from "commons/interfaces";



export interface ITableColumn<T> {
    key?: string;
    Header: string;
    accessor: string;
    width?: string | number;
    sorted?: "asce" | "desc";
    align?: "left" | "right" | "center";
    Cell?: (row: { value: any, row: { original: T, [key: string]: any } }) => JSX.Element;
};

// Declaring props types for DataTable
interface IProps<T> {
    modeLocal?: boolean;
    showIndex?: boolean;
    noEndBorder?: boolean;
    allowSorted?: boolean;
    loadingData?: boolean;
    hiddenFooter?: boolean;

    noDataText?: string;
    boxHeader?: JSX.Element;
    table: {
        rows: T[];
        columns: ITableColumn<T>[];
    };

    totalPage?: number;
    totalCount?: number;
    rowPerPage?: number;
    currentPage?: number;
    rowPerPageOptions?: number[];
    onChangePageSize?: (page: any) => void;
    onChangePageNumber?: (page: any) => void;

    selectedIds?: string[];
    allowCheckbox?: boolean;
    multiSelected?: boolean;
    selectDisableIds?: string[] | "ALL";
    onChangeSelected?: (ids: string[], data?: T[]) => void;

    hiddenActionMenu?: boolean;
    actionMenus?: (row: T) => (IActionMenuItem | boolean)[];
}

let defaultValue = 0;

const DataTable = <T,>({
    modeLocal,
    showIndex,
    allowSorted,
    noEndBorder,
    loadingData,
    hiddenFooter,

    boxHeader,
    noDataText,

    table,
    totalPage = 1,
    totalCount = 0,
    rowPerPage = Constants.ROW_PER_PAGE,
    currentPage = 0,
    rowPerPageOptions = Constants.ROW_PER_PAGE_OPTIONS,
    onChangePageSize,
    onChangePageNumber,

    selectedIds,
    allowCheckbox,
    multiSelected,
    selectDisableIds,
    onChangeSelected,

    actionMenus,
    hiddenActionMenu,
}: IProps<T>) => {

    defaultValue = rowPerPage;

    const dataRowsByTable = useMemo<any>(() => [...table.rows || []], [table]);
    const dataColumnsByTable = useMemo<any>(() => [...table.columns || []], [table]);

    const tableInstance = useTable(
        {
            data: dataRowsByTable,
            columns: dataColumnsByTable,
            initialState: { pageIndex: (currentPage - 1 > 0) ? currentPage - 1 : 0 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        page,
        pageOptions,
        canPreviousPage,
        canNextPage,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        setGlobalFilter,
        state: { pageIndex, pageSize, globalFilter },
    }: any = tableInstance;

    const tablePageSizeOptions = useMemo(() => {
        let isPageSizedIncluded = rowPerPageOptions.includes(pageSize);

        if (isPageSizedIncluded) {
            return rowPerPageOptions;
        } else {
            return [pageSize];
        }
    }, [pageSize, rowPerPageOptions]);

    // Set the default value for the entries per page when component mounts
    useEffect(() => { setPageSize(defaultValue) }, [defaultValue]);

    // Setting the entries starting point, entries ending point
    let entriesEnd = 0;
    let entriesStart = 0;
    if (pageIndex + 1 <= Math.ceil(totalCount / defaultValue) && pageIndex >= 0) {
        entriesEnd = Math.min((pageIndex + 1) * defaultValue, totalCount);
        entriesStart = Math.min(pageIndex * defaultValue + 1, entriesEnd);
    }

    // Set the entries per page value based on the select value
    const setEntriesPerPage = (value: any) => setPageSize(value);

    // A function that sets the sorted value for the table
    const setSortedValue = (column: any) => {
        let sortedValue;
        if (allowSorted) {
            sortedValue = column.sorted || "asce";
        } else {
            sortedValue = undefined;
        }
        return sortedValue;
    };

    // Menu action value state
    const [openMenu, setOpenMenu] = useState<any>(false);
    const [currentItem, setCurrentItem] = useState<any>({});

    const handleOpenMenu = (event: any, row: any) => {
        setOpenMenu(event.currentTarget);
        setCurrentItem(row);
    };

    const handleCloseMenu = () => {
        setOpenMenu(false);
        setCurrentItem({});
    };

    const isCheckedAll = useMemo(() => {
        let countLength: number = 0;
        const newData = (modeLocal ? [...dataRowsByTable || []] : [...rows || []]);
        newData.forEach(el => { countLength = countLength + 1; });

        return (
            ([...selectedIds || []].length > 0) &&
            ([...selectedIds || []].length === countLength)
        );
    }, [selectedIds]);

    // Check All record
    const handleCheckedAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        let ids: string[] = [];
        let dataTemps: any[] = [];
        if (event.target?.checked) {
            if (modeLocal) {
                [...dataRowsByTable || []].forEach((row: any) => {
                    dataTemps.push(row);
                    ids.push(`${row.id}`);
                });
            } else {
                [...rows || []].forEach((row: any) => {
                    dataTemps.push(row.original);
                    ids.push(`${row.original?.id}`);
                });
            }
        } else {
            ids = [];
            dataTemps = [];
        }
        Helpers.isFunction(onChangeSelected) && onChangeSelected(ids, dataTemps);
    };

    // Check record by id
    const handleCheckedByRecord = (event: React.ChangeEvent<HTMLInputElement>, item: any) => {
        if (multiSelected) {
            let oldIds = [...selectedIds || []];
            if (event.target?.checked) {
                oldIds.push(event.target?.value);
                Helpers.isFunction(onChangeSelected) && onChangeSelected(oldIds, []);
            } else {
                const newIds = oldIds.filter((el) => el !== event.target?.value);
                Helpers.isFunction(onChangeSelected) && onChangeSelected(newIds, []);
            }
        } else {
            if (event.target?.checked) {
                Helpers.isFunction(onChangeSelected) && onChangeSelected([event.target?.value], []);
            } else {
                Helpers.isFunction(onChangeSelected) && onChangeSelected([], []);
            }
        }
    };

    return (
        <>
            {loadingData &&
                <Box
                    sx={{
                        height: "200px",
                        display: "flex",
                        borderRadius: 2,
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                        backgroundColor: Constants.Colors.f3,
                    }}
                >
                    <CircularProgress />
                </Box>
            }
            {/* Header */}
            {boxHeader && <Box pb={2}>{boxHeader}</Box>}
            {/* Content Table */}
            {!loadingData && (dataRowsByTable.length !== 0) &&
                <TableContainer sx={{
                    border: `1px solid ${Constants.Colors.f3}`,
                    scrollbarWidth: "thin",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                }}>
                    <Table {...getTableProps()}>
                        {/* Header Cell */}
                        <Box component="thead">
                            {headerGroups.map((headerGroup: any, key: any) => (
                                <TableRow key={key} {...headerGroup.getHeaderGroupProps()}>
                                    {allowCheckbox &&
                                        <DataTableHeadCell w={"42px"} align={"left"}>
                                            {modeLocal && multiSelected &&
                                                <Checkbox
                                                    checked={isCheckedAll}
                                                    onChange={handleCheckedAll}
                                                    disabled={selectDisableIds === "ALL"}
                                                />
                                            }
                                        </DataTableHeadCell>
                                    }
                                    {showIndex &&
                                        <DataTableHeadCell w={"50px"} align={"left"}>
                                            {"STT"}
                                        </DataTableHeadCell>}
                                    {!hiddenActionMenu && actionMenus &&
                                        <DataTableHeadCell w={"80px"} align={"center"}>
                                            {Strings.COMMON.ACTION}
                                        </DataTableHeadCell>
                                    }
                                    {headerGroup.headers.map((column: any, key: any) => (
                                        <DataTableHeadCell
                                            key={key}
                                            sorted={setSortedValue(column)}
                                            width={column.width ? column.width : "auto"}
                                            align={column.align ? column.align : "left"}
                                            {...column.getHeaderProps(allowSorted && column.getSortByToggleProps())}
                                        >
                                            {column.render("Header")}
                                        </DataTableHeadCell>
                                    ))}
                                </TableRow>
                            ))}
                        </Box>
                        {/* Body Cell */}
                        <TableBody {...getTableBodyProps()}>
                            {(modeLocal ? page : rows).map((row: any, key: any) => {
                                prepareRow(row);
                                const valChecked = [...selectedIds || []].includes(row.original?.id);
                                return (
                                    <TableRow key={row.original?.id || key} {...row.getRowProps()}>
                                        {allowCheckbox &&
                                            <DataTableBodyCell width={"42px"} align={"left"} noBorder={noEndBorder}>
                                                {multiSelected
                                                    ? (
                                                        <Checkbox
                                                            color={"primary"}
                                                            checked={valChecked}
                                                            value={row.original?.id}
                                                            onChange={(event) => { handleCheckedByRecord(event, row.original) }}
                                                            disabled={(selectDisableIds === "ALL") || [...selectDisableIds || []].includes(row.original?.id)}
                                                        />
                                                    )
                                                    : (
                                                        <Radio
                                                            color={"primary"}
                                                            checked={valChecked}
                                                            value={row.original?.id}
                                                            onChange={(event) => { handleCheckedByRecord(event, row.original) }}
                                                            disabled={(selectDisableIds === "ALL") || [...selectDisableIds || []].includes(row.original?.id)}
                                                        />
                                                    )
                                                }
                                            </DataTableBodyCell>
                                        }
                                        {showIndex &&
                                            <DataTableBodyCell width={"50px"} align={"left"} noBorder={noEndBorder}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        lineHeight: 1.25,
                                                        fontSize: "0.785rem",
                                                        letterSpacing: "0.03333em",
                                                        color: Constants.Colors.secondary.main,
                                                    }}
                                                >
                                                    {Helpers.formatCurrency(key + 1 + ((currentPage || 1) - 1) * (pageSize || Constants.ROW_PER_PAGE))}
                                                </Typography>
                                            </DataTableBodyCell>
                                        }
                                        {!hiddenActionMenu && actionMenus &&
                                            <DataTableBodyCell width={"80px"} align={"left"} noBorder={noEndBorder}>
                                                <RenderListItemAction
                                                    row={row.original}
                                                    actionMenus={actionMenus}
                                                    onCallBack={(e, data) => {
                                                        if (!Helpers.isNullOrEmpty(data?.row)) {
                                                            handleOpenMenu(e, data?.row);
                                                        };

                                                        if (!Helpers.isNullOrEmpty(data?.openMenu)) {
                                                            setOpenMenu(data?.openMenu);
                                                        };
                                                    }}
                                                />
                                            </DataTableBodyCell>
                                        }
                                        {
                                            row.cells.map((cell: any, key: any) => (
                                                <DataTableBodyCell
                                                    key={key}
                                                    noBorder={noEndBorder}
                                                    width={cell.column.width}
                                                    align={cell.column.align ? cell.column.align : "left"}
                                                    {...cell.getCellProps()}
                                                >
                                                    {cell.render("Cell")}
                                                </DataTableBodyCell>
                                            ))
                                        }
                                    </TableRow>
                                );
                            })}
                            {/* no data */}
                            {dataRowsByTable.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={dataColumnsByTable.length + 2}
                                        sx={{
                                            margin: 0,
                                            padding: 0,
                                            borderBottom: noEndBorder ? "none" : `1px solid #${Constants.Colors.disable.main}`
                                        }}
                                    >
                                        <Box sx={{
                                            height: "100px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}>
                                            <Typography variant="button" color="textSecondary">
                                                {noDataText || Strings.COMMON.NO_DATA}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            }
            {!loadingData && (dataRowsByTable.length === 0) && (
                <DataNotFound
                    height={"200px"}
                    borderRadius={2}
                    text={noDataText || Strings.COMMON.NO_DATA}
                />
            )}
            {/* Footer */}
            {!loadingData && !hiddenFooter &&
                <Box
                    pt={2}
                    gap={1}
                    display={"flex"}
                    flexWrap={"wrap"}
                    alignItems={"center"}
                    justifyContent={"end"}
                >
                    {/* Page Size */}
                    <Box gap={1} display={"flex"} alignItems={"center"} flexWrap={"wrap"}>
                        <Typography variant="button" component={"span"}>
                            {Strings.COMMON.SHOW}:
                        </Typography>
                        <Autocomplete
                            size={"small"}
                            disableClearable
                            key={defaultValue}
                            value={defaultValue}
                            options={tablePageSizeOptions}
                            getOptionLabel={(option: any) => `${option}`}
                            sx={{ width: "80px", display: "inline-flex" }}
                            renderInput={(params) => <TextField {...params} variant={"outlined"} />}
                            onChange={(event, newValue) => {
                                setEntriesPerPage(newValue);
                                Helpers.isFunction(onChangePageSize) && onChangePageSize(newValue);
                            }}
                        />
                        <Typography variant="button">
                            {Strings.formatString(Strings.COMMON.LABEL_DISPLAY_ROWS, entriesStart || 0, entriesEnd || 0, totalCount || 0)}
                        </Typography>
                    </Box>
                    <CustomPagination
                        pageSize={pageSize}
                        totalPage={totalPage}
                        totalCount={totalCount}
                        pageNumber={currentPage}
                        onChangePage={onChangePageNumber}
                        rowsPerPageOptions={Constants.ROW_PER_PAGE_OPTIONS}
                    />
                </Box>
            }
            {
                <RenderPopupMenu
                    row={currentItem}
                    openMenu={openMenu}
                    setOpenMenu={setOpenMenu}
                    actionMenus={actionMenus}
                    closeMenu={handleCloseMenu}
                />
            }
        </>
    );
};

export default DataTable;

export const RenderItemAction = (props: { item: IActionMenuItem, onClick: (event: any) => void }) => {
    return (
        <Tooltip arrow key={props.item?.key} title={props.item?.tooltip || props.item?.title}>
            <IconButton
                // sx={{ padding: 0 }}
                onClick={props.onClick}
                disabled={props.item?.disabled}
            >
                {props.item?.icon}
            </IconButton>
        </Tooltip>
    )
};

export const RenderListItemAction = ({ row, onCallBack, actionMenus }: {
    row: any;
    onCallBack: (event: any, data: { row?: any, openMenu?: boolean }) => void;
    actionMenus: (row: any) => (IActionMenuItem | boolean)[];
}) => {
    let _actionListTemp: any[] = [];
    if (actionMenus && Helpers.isFunction(actionMenus)) {
        _actionListTemp = actionMenus(row);
    };

    const _actionListFilter: any[] = _actionListTemp.filter((item) => item !== false) || [];

    if (!_actionListFilter || _actionListFilter.length === 0) {
        return null;
    } else {
        if (_actionListFilter.length <= 2) {
            return (
                <Box gap={"0px"} display={"flex"}>
                    {_actionListFilter.map((item: IActionMenuItem) => {
                        if (!Helpers.isNullOrEmpty(item?.hiddenWhen?.key) &&
                            !Helpers.isNullOrEmpty(row?.[item?.hiddenWhen?.key]) &&
                            item?.hiddenWhen?.values?.some((value: any) => (row?.[item?.hiddenWhen?.key] === value))
                        ) {
                            return null;
                        } else {
                            return (
                                <RenderItemAction
                                    item={item}
                                    onClick={(e) => {
                                        onCallBack(e, { openMenu: false });
                                        if (Helpers.isFunction(item.callback)) {
                                            item.callback(row);
                                        };
                                    }}
                                />
                            );
                        }
                    })}
                </Box>
            );
        } else {
            return (
                <Box gap={"0px"} display={"flex"}>
                    {[_actionListFilter[0]].map((item) => {
                        if (!Helpers.isNullOrEmpty(item?.hiddenWhen?.key) &&
                            !Helpers.isNullOrEmpty(row?.[item?.hiddenWhen?.key]) &&
                            item?.hiddenWhen?.values?.some((value: any) => (row?.[item?.hiddenWhen?.key] === value))
                        ) {
                            return null;
                        } else {
                            return (
                                <RenderItemAction
                                    item={item}
                                    onClick={(e) => {
                                        onCallBack(e, { openMenu: false });
                                        if (Helpers.isFunction(item.callback)) {
                                            item.callback(row);
                                        };
                                    }}
                                />
                            );
                        }
                    })}
                    <IconButton onClick={(e) => onCallBack(e, { row: row })}>
                        <PendingOutlined />
                    </IconButton>
                </Box>
            );
        }
    }
};

export const RenderPopupMenu = ({
    row,
    openMenu,
    closeMenu,
    setOpenMenu,
    actionMenus,
}: {
    row: any;
    openMenu: any;
    closeMenu: () => void;
    setOpenMenu: React.Dispatch<any>;
    actionMenus: (row: any) => (IActionMenuItem | boolean)[];
}) => {
    let _actionListTemp: any[] = [];
    if (actionMenus && Helpers.isFunction(actionMenus)) {
        _actionListTemp = actionMenus(row);
    };

    const _actionListFilter: any[] = _actionListTemp.filter((item) => item !== false) || [];
    const _actionListTempSlice = (_actionListFilter?.length > 1) ? _actionListFilter?.slice(1) : [];

    if (!_actionListTempSlice || _actionListTempSlice.length === 0) {
        return null;
    } else {
        return (
            <Menu
                open={Boolean(openMenu)}
                anchorEl={openMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "left", }}
                anchorReference={undefined}
                onClose={closeMenu}
            >
                {
                    _actionListTempSlice.map((item: IActionMenuItem) => {
                        if (!Helpers.isNullOrEmpty(item?.hiddenWhen?.key) &&
                            !Helpers.isNullOrEmpty(row?.[item.hiddenWhen.key]) &&
                            item.hiddenWhen?.values?.some(value => row?.[item.hiddenWhen.key] === value)
                        ) {
                            return null;
                        } else {
                            return (
                                <CustomMenuItem
                                    key={item.key}
                                    icon={item.icon}
                                    title={item.title}
                                    colorText={item.color}
                                    disabled={item.disabled}
                                    onClick={() => {
                                        setOpenMenu(false);
                                        if (!item.disabled && Helpers.isFunction(item.callback)) {
                                            item.callback(row);
                                        }
                                    }}
                                />
                            );
                        }
                    })
                }
            </Menu>
        );
    }
};
