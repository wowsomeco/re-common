import React, { FunctionComponent } from 'react';

interface BtnProps {
  loading: boolean;
}

/*
<Button disabled={loading} {...btnProps}>{props.children}</Button> {loading && <CircularProgress className="absolute top-1/4 left-1/2" color="secondary" size={20} />}
*/

/**
 * Wrapper component for the material-ui Button with some additional props.
 * 
 * when loading is true, the button is disabled automagically and a circular progress will show.
 */
export const Btn: FunctionComponent<BtnProps> = (props) => {
  const { loading, ...btnProps } = props;

  return (
    <div className="relative">
      Button
    </div>
  );
};