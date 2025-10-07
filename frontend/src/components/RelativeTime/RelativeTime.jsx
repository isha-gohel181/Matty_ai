import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const RelativeTime = ({ timestamp }) => {
  const [timeAgo, setTimeAgo] = useState(
    formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceToNow(new Date(timestamp), { addSuffix: true }));
    }, 1000); // updates every second

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span className="text-[14px]">{timeAgo}</span>;
};

export default RelativeTime;
