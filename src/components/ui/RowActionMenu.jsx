import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * actions — flat list of menu items:
 *   { label, icon?, onClick, className? }
 *
 * subMenus — list of grouped sub-menus rendered as a submenu trigger:
 *   { label, icon?, items: [{ label, icon?, onClick, className? }] }
 *
 * A separator is automatically inserted before the first subMenu group.
 */
const RowActionMenu = ({ actions = [], subMenus = [] }) => {
  if (actions.length === 0 && subMenus.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map(({ label, icon: Icon, onClick, className }, idx) => (
          <DropdownMenuItem key={idx} onClick={onClick} className={className}>
            {Icon && <Icon className="mr-2 h-4 w-4" />}
            {label}
          </DropdownMenuItem>
        ))}

        {subMenus.length > 0 && actions.length > 0 && (
          <DropdownMenuSeparator />
        )}

        {subMenus.map(({ label, icon: Icon, items = [] }, idx) => (
          <DropdownMenuSub key={idx}>
            <DropdownMenuSubTrigger>
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {label}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {items.map(
                ({ label: itemLabel, icon: ItemIcon, onClick, className }, iIdx) => (
                  <DropdownMenuItem
                    key={iIdx}
                    onClick={onClick}
                    className={className}
                  >
                    {ItemIcon && <ItemIcon className="mr-2 h-4 w-4" />}
                    {itemLabel}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActionMenu;
