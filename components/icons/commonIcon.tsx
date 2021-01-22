import * as React from 'react';
import { FiChevronRight, FiChevronsLeft, FiHome, FiSearch } from 'react-icons/fi';
import { IconBaseProps } from 'react-icons/lib';

type IconName =
  'doubleArrowLeft' |
  'doubleArrowRight' |
  'home' |
  'search'
  ;

const icons: Record<IconName, (props: IconBaseProps) => JSX.Element> = {
  'doubleArrowLeft': (p) => <FiChevronsLeft  {...p} />,
  'doubleArrowRight': (p) => <FiChevronRight {...p} />,
  'home': (p) => <FiHome  {...p} />,
  'search': (p) => <FiSearch {...p} />
};

interface CommonIconProps extends IconBaseProps {
  name: IconName;
}

export const CommonIcon: React.FC<CommonIconProps> = (props) => {
  const { name, ...iconProps } = props;
  return (
    icons[name](iconProps)
  );
};