import React from "react";

const Skeleton = ({ className = "", variant = "rectangular" }) => {
  const baseClasses = "animate-pulse bg-white/10 rounded";

  const variants = {
    rectangular: "w-full h-4",
    circular: "w-12 h-12 rounded-full",
    text: "w-3/4 h-4",
    avatar: "w-10 h-10 rounded-full",
    card: "w-full h-32",
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export const CardSkeleton = () => (
  <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
    <Skeleton variant="text" className="mb-4" />
    <Skeleton variant="rectangular" className="h-24 mb-4" />
    <div className="space-y-2">
      <Skeleton variant="text" className="w-2/3" />
      <Skeleton variant="text" className="w-1/2" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="py-4">
      <Skeleton variant="text" className="w-24" />
    </td>
    <td className="py-4">
      <Skeleton variant="text" className="w-20" />
    </td>
    <td className="py-4">
      <Skeleton variant="text" className="w-32" />
    </td>
  </tr>
);

export default Skeleton;
