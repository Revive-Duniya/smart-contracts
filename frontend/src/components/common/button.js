import React from "react";
import PropTypes from "prop-types";

const CustomButton = ({
  padding = "10px 20px",
  backgroundColor = "#AD1AAF",
  textColor = "white",
  borderColor = "none",
  children,
  onClick = () => {},
}) => {
  const buttonStyle = {
    padding: padding,
    backgroundColor: backgroundColor,
    color: textColor,
    border: borderColor,
  };

  return (
    <button
      style={buttonStyle}
      className="center rounded-md text-[.9rem] focus:outline-none capitalize hover:scale-95 transition duration-300 oxanium"
      onClick={onClick}
      id="accountId"
    >
      {children}
    </button>
  );
};

CustomButton.propTypes = {
  padding: PropTypes.string,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  borderColor: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default CustomButton;
