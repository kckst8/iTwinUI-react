/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/
import React from 'react';
import { Cell, CellProps, CellRendererProps, TableInstance } from 'react-table';
import cx from 'classnames';
import { getCellStyle } from './utils';
import { SubRowExpander } from './SubRowExpander';
import { SELECTION_CELL_ID } from './hooks';
import { DefaultCell } from './cells';

export type TableCellProps<T extends Record<string, unknown>> = {
  cell: Cell<T>;
  cellIndex: number;
  isDisabled: boolean;
  tableHasSubRows: boolean;
  tableInstance: TableInstance<T>;
  expanderCell?: (cellProps: CellProps<T>) => React.ReactNode;
};

export const TableCell = <T extends Record<string, unknown>>(
  props: TableCellProps<T>,
) => {
  const {
    cell,
    cellIndex,
    isDisabled,
    tableHasSubRows,
    tableInstance,
    expanderCell,
  } = props;

  const hasSubRowExpander =
    cellIndex ===
    cell.row.cells.findIndex((c) => c.column.id !== SELECTION_CELL_ID);

  const getSubRowStyle = (): React.CSSProperties | undefined => {
    if (!tableHasSubRows || !hasSubRowExpander) {
      return undefined;
    }
    // If it doesn't have sub-rows then shift by another level to align with expandable rows on the same depth
    // 16 = initial_cell_padding, 35 = 27 + 8 = expander_width + margin
    return {
      paddingLeft: 16 + (cell.row.depth + (cell.row.canExpand ? 0 : 1)) * 35,
    };
  };

  const cellElementProps = cell.getCellProps({
    className: cx('iui-cell', cell.column.cellClassName),
    style: {
      ...getCellStyle(cell.column, !!tableInstance.state.isTableResizing),
      ...getSubRowStyle(),
    },
  });

  const cellProps: CellProps<T> = {
    ...tableInstance,
    ...{ cell, row: cell.row, value: cell.value, column: cell.column },
  };

  const cellContent = (
    <>
      {tableHasSubRows && hasSubRowExpander && cell.row.canExpand && (
        <SubRowExpander
          cell={cell}
          isDisabled={isDisabled}
          cellProps={cellProps}
          expanderCell={expanderCell}
        />
      )}
      {cell.render('Cell')}
    </>
  );

  const cellRendererProps: CellRendererProps<T> = {
    cellElementProps,
    cellProps,
    children: cellContent,
  };

  return (
    <>
      {cell.column.cellRenderer ? (
        cell.column.cellRenderer(cellRendererProps)
      ) : (
        <DefaultCell {...cellRendererProps} />
      )}
    </>
  );
};

export default TableCell;
