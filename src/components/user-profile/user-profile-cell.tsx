import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getUserInitials, type UserProfileDisplay } from "@/lib/user-display";

type UserProfileCellProps = {
  user: UserProfileDisplay;
  variant?: "default" | "compact" | "inline";
  showEmail?: boolean;
  className?: string;
};

function UserProfileAvatar({
  user,
  size,
  className,
}: {
  user: UserProfileDisplay;
  size: "sm" | "default";
  className?: string;
}) {
  return (
    <Avatar
      size={size}
      className={cn("shrink-0", size === "sm" ? "size-7" : "size-8", className)}
    >
      {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
      <AvatarFallback
        className={cn(size === "sm" ? "text-[0.625rem]" : "text-xs")}
      >
        {getUserInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}

export function UserProfileCell({
  user,
  variant = "default",
  showEmail = true,
  className,
}: UserProfileCellProps) {
  if (variant === "compact") {
    return (
      <div className={cn("flex min-w-0 items-center gap-1.5", className)}>
        <UserProfileAvatar user={user} size="sm" className="size-6" />
        <span className="max-w-36 truncate text-[0.65rem] text-muted-foreground">
          {user.name}
        </span>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex w-full min-w-0 items-center gap-2", className)}>
        <UserProfileAvatar user={user} size="sm" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <p className="truncate text-xs font-medium leading-none">
            {user.name}
          </p>
          {showEmail && user.email ? (
            <p className="mt-0.5 truncate text-[0.65rem] leading-none text-muted-foreground">
              {user.email}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <UserProfileAvatar user={user} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="max-w-52 truncate font-medium leading-none">
          {user.name}
        </p>
        {showEmail && user.email ? (
          <p
            className="mt-0.5 max-w-52 truncate text-xs text-muted-foreground sm:hidden"
            title={user.email}
          >
            {user.email}
          </p>
        ) : null}
      </div>
    </div>
  );
}
