import { sidebarData } from "../layout/data/sidebar-data.jsx";

function buildBreadcrumbMap(navGroups) {
  const map = {};

  function traverse(items, parents = []) {
    items.forEach((item) => {
      const currentPath = [...parents, item.title];
      if (item.url) {
        map[item.url] = currentPath;
      }
      if (item.items && item.items.length > 0) {
        traverse(item.items, currentPath);
      }
    });
  }

  navGroups.forEach((group) => {
    traverse(group.items, []);
  });

  return map;
}

const generatedMap = buildBreadcrumbMap(sidebarData.navGroups);
const viewRouteMap = {};
Object.keys(generatedMap).forEach((key) => {
  const match = key.match(/^\/(\w+)s$/);
  if (match) {
    const singular = match[1];
    const viewRoute = `/${singular}-view`;
    viewRouteMap[viewRoute] = generatedMap[key];
  }
});

export const breadcrumbMap = {
  ...generatedMap,
  ...viewRouteMap,
};
