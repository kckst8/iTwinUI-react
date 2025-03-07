/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import cx from 'classnames';
import React from 'react';
import {
  Button,
  ButtonProps,
  DropdownButton,
  DropdownButtonProps,
  SplitButton,
  SplitButtonProps,
} from '../Buttons';

import { PolymorphicForwardRefComponent, useTheme } from '../utils';
import '@itwin/itwinui-css/css/header.css';

export type HeaderButtonProps = {
  /**
   * Main label of the header button.
   */
  name: React.ReactNode;
  /**
   * Description shown below the main label, will be hidden in `Header` slim mode.
   */
  description?: React.ReactNode;
  /**
   * Is the menu active.
   * @default false
   */
  isActive?: boolean;
} & Partial<Pick<DropdownButtonProps, 'menuItems'>> &
  Pick<ButtonProps, 'startIcon' | 'endIcon'>;

const isSplitButton = (
  props: Omit<Partial<SplitButtonProps>, 'name'>,
): props is SplitButtonProps => {
  return !!props.menuItems && !!props.onClick;
};

const isDropdownButton = (
  props: Partial<DropdownButtonProps>,
): props is DropdownButtonProps => {
  return !!props.menuItems;
};

type HeaderButtonComponent = PolymorphicForwardRefComponent<
  'button',
  HeaderButtonProps
>;

/**
 * Header button that handles slim state of the `Header` it's in.
 * When in slim mode, will only display the name and reduce icon size.
 * Will display an arrow on the right if `menuItems` prop is provided.
 * @example
 * <HeaderButton name='Project A' description='0n00434' menuItems={...} />
 * <HeaderButton name='Project B' description='0n00434' startIcon={<SvgImodelHollow />} />
 * <HeaderButton name='Project C' startIcon={<img style={{ objectFit: 'cover' }} src='project.png' />} />
 * <HeaderButton name='Project D' isActive />
 */
export const HeaderButton: HeaderButtonComponent = React.forwardRef(
  (props, ref) => {
    const {
      name,
      description,
      isActive = false,
      className,
      startIcon,
      menuItems,
      ...rest
    } = props;

    useTheme();

    const buttonProps = {
      startIcon: React.isValidElement(startIcon)
        ? React.cloneElement(startIcon as JSX.Element, {
            className: cx(
              'iui-header-button-icon',
              (startIcon as JSX.Element).props.className,
            ),
          })
        : undefined,
      styleType: 'borderless',
      className: cx(
        {
          'iui-header-button': !isSplitButton(props),
          'iui-header-split-button': isSplitButton(props),
          'iui-active': isActive,
        },
        className,
      ),
      'aria-current': isActive ? 'location' : undefined,
      children: (
        <>
          <div>{name}</div>
          {description && <div className='iui-description'>{description}</div>}
        </>
      ),
      ref: ref,
      ...(!!menuItems && { menuItems }),
      ...rest,
    } as const;

    if (isSplitButton(buttonProps)) {
      return <SplitButton {...buttonProps} />;
    }
    if (isDropdownButton(buttonProps)) {
      return <DropdownButton {...buttonProps} />;
    }
    return <Button {...buttonProps} />;
  },
);

export default HeaderButton;
