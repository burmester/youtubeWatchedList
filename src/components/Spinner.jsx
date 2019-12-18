import React from 'react';

const Spinner = ({
  image,
  width,
  className
}) => (
  <img
    className={className + " spinner"}
    src={image}
    style={{width: width}}
    alt={'Loading'}
  />
);

export default Spinner;
