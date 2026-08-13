import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "@tanstack/react-router";
import { breadcrumbMap } from "../../utils/breadcrumbConfig";
import { useBreadcrumb } from "@/context/BreadCrumbContext";

export function AppBreadcrumbs() {
  const { pathname } = useLocation();
  const { dynamicSegment } = useBreadcrumb();
  
  // Try to get exact match first
  let titles = breadcrumbMap[pathname];
  
  // If no exact match and we have a dynamic route, find the base path
  if (!titles && pathname.includes('/')) {
    // For routes like /passenger-view/123, get /passenger-view
    const segments = pathname.split('/').filter(Boolean);
    const basePath = '/' + segments[0];
    titles = breadcrumbMap[basePath];
  }
  
  titles = titles || [];
  
  // If we have a dynamic segment, append it to the breadcrumbs
  if (dynamicSegment) {
    titles = [...titles, dynamicSegment];
  }

  const crumbs = titles.map((title, index) => {
    // Last item shouldn't have a link
    if (index === titles.length - 1) {
      return { title, url: null };
    }
    
    const url = Object.entries(breadcrumbMap).find(
      ([, value]) =>
        value.length === index + 1 &&
        value.every((v, i) => v === titles[i])
    )?.[0];

    return { title, url };
  });

  return (
    <Breadcrumb className="flex-1 min-w-0">
      <BreadcrumbList className="flex items-center gap-1 text-sm text-muted-foreground">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <React.Fragment key={`${crumb.url || index}`}>
              {index > 0 && <BreadcrumbSeparator className="mx-1" />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="truncate text-foreground font-medium">
                    {crumb.title}
                  </BreadcrumbPage>
                ) : crumb.url ? (
                  <BreadcrumbLink asChild>
                    <Link
                      to={crumb.url}
                      className="truncate hover:text-foreground"
                    >
                      {crumb.title}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="truncate text-foreground">
                    {crumb.title}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}