import React from "react";

const Loading = ({
  size = "medium",
  text = "Loading...",
  color = "blue",
  fullScreen = false,
  className = "",
  overlay = true,
  spinnerOnly = false,
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
    xlarge: "w-16 h-16",
  };

  const colorClasses = {
    blue: "border-t-blue-600",
    green: "border-t-green-600",
    red: "border-t-red-600",
    white: "border-t-white",
    primary: "border-t-primary",
    secondary: "border-t-secondary",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center"
    : "flex flex-col items-center justify-center p-4";

  const spinnerClasses = `
    ${sizeClasses[size]}
    animate-spin
    rounded-full
    border-4
    border-gray-300
    ${colorClasses[color]}
    transition-all
    duration-300
    ease-in-out
  `;

  const textClasses = `
    mt-2
    text-gray-400
    text-sm
    md:text-base
    font-medium
    transition-opacity
    duration-300
    ease-in-out
    ${spinnerOnly ? "hidden" : ""}
  `;

  return (
    <div
      className={`${containerClasses} ${className}`}
      role="status"
      aria-label={text}
      aria-busy="true"
      aria-live="polite"
    >
      <div className={spinnerClasses} />
      {text && !spinnerOnly && <p className={textClasses}>{text}</p>}
      {overlay && fullScreen && (
        <div
          className="absolute inset-0 bg-gray-900 bg-opacity-75 -z-10"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Loading;
