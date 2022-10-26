import React from "react";

const BaseButton = (props) => {
  return <button className={`border-solid border-2 p-2 ${props.class}`}>BaseButton</button>;
};

export default BaseButton;
