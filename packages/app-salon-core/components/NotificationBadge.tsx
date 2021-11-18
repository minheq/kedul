import React from 'react';
import { Badge } from 'paramount-ui';

interface NotificationBadgeProps {
  count: string;
}

export const NotificationBadge = (props: NotificationBadgeProps) => {
  const { count } = props;

  return (
    <Badge
      shape="pill"
      color="red"
      isSolid
      size="small"
      title={count}
      overrides={{
        Root: {
          style: {
            height: 32,
          },
        },
      }}
    />
  );
};
