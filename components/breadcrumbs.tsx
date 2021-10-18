import clsx from 'clsx';
import { nanoid } from 'nanoid';
import * as React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { loop } from '~w-common/scripts';

import { CommonProps } from '.';

export type fontSize = 'xs' | 'sm' | 'md' | 'lg';
export type Gap = 'none' | 'xs' | 'sm' | 'md' | 'lg';
export type Align =
  | 'left'
  | 'center'
  | 'right'
  | 'between'
  | 'around'
  | 'evenly';

const FontSizeOptions: Record<fontSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg'
};

const GapOptions: Record<Gap, string> = {
  none: 'space-x-0',
  xs: 'space-x-2',
  sm: 'space-x-4',
  md: 'space-x-8',
  lg: 'space-x-12'
};

const AlignOptions: Record<Align, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly'
};

export type EachCrumbCbItems = {
  /** The route name */
  name: string;
  /** The previous route path */
  prev: string | undefined;
  /** Indicates whether it's the first index of the route location */
  first: boolean;
  /** Indicates whether it's the last index of the route location */
  last: boolean;
  /** The current combined route path from the prev one(s)  */
  joinPath: string;
};

export type EachCrumbCallback = (cb: EachCrumbCbItems) => Crumbs | undefined;

export interface Crumbs {
  to: string;
  label?: string;
  icon?: React.ReactElement | null;
}

export interface BreadcrumbsProps extends CommonProps {
  /**
   * Callback to parent that gets executed for each route of the current location
   * if returns undefined, then, the route will be ignored
   */
  eachCrumb: EachCrumbCallback;
  /**
   * The string used to separate the breadcrumbs
   * @default "/"
   */
  separator?: string;
  /**
   * Well, it's the font size.
   * @default "sm"
   */
  fontSize?: string;
  /**
   * The gutter value allows you control over the space between the breadcrumb elements.
   * @default "sm"
   */
  gap?: Gap;
  /**
   * Specify how to align the breadcrumbs horizontally
   * @default "left"
   */
  align?: Align;
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({
  eachCrumb,
  fontSize = 'sm',
  gap = 'sm',
  align = 'left',
  separator = '/',
  className
}) => {
  const fontSizeClass = fontSize ? FontSizeOptions[fontSize] : '';
  const gapClass = gap ? GapOptions[gap] : '';
  const alignClass = align ? AlignOptions[align] : '';

  const { pathname } = useLocation();
  // transform the pathname into array of string
  const splitPath = pathname.split('/');
  // remove the first item since it's only '/'
  splitPath.shift();
  // initially the items will be empty
  const items: Crumbs[] = [];
  // iterate over the splitpath and emit the callback for each of them to the parent
  let joinPath = '';
  loop(splitPath, ({ item: name, prev, first, last }) => {
    joinPath += `/${name}`;
    // callback to the parent for each crumb item
    const crumb = eachCrumb({
      name,
      prev,
      first,
      last,
      joinPath
    });
    // only push to the arr if the parent returns with an item.
    if (crumb) items.push(crumb);
  });

  return Array.isArray(items) ? (
    <nav
      className={clsx(
        'flex items-center text-gray-500 whitespace-nowrap flex-wrap',
        alignClass,
        gapClass,
        fontSizeClass,
        className
      )}
    >
      {items.map(({ to = '', label = '', icon = null }, index) => {
        const currentLocation = to === pathname;
        return to && (label || icon) ? (
          <React.Fragment key={nanoid()}>
            <NavLink
              to={to}
              tabIndex={currentLocation ? -1 : 0}
              className={clsx(
                'flex items-center space-x-2 px-1 py-0.5 text-blue-500 rounded',
                currentLocation
                  ? 'font-bold cursor-default'
                  : 'hover:bg-blue-100 focus:ring-2'
              )}
            >
              <>
                {icon ? icon : null}
                {label ? <span>{label}</span> : null}
              </>
            </NavLink>
            {index < items.length - 1 ? <span>{separator}</span> : null}
          </React.Fragment>
        ) : null;
      })}
    </nav>
  ) : null;
};

export default Breadcrumbs;
