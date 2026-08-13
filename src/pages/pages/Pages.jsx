import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import { Eye } from "lucide-react";

const PAGE_ROWS = [
  { title: "Blogs", to: "/pages/blogs" },
  { title: "Articles", to: "/pages/articles" },
  { title: "Events", to: "/pages/events" },
  { title: "News", to: "/pages/news" },
];

const Pages = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6 mt-4">
      <h1 className="text-xl font-semibold">Page Management</h1>
      <div className="flex items-center justify-between gap-2"></div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Page Title</TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PAGE_ROWS.map((row) => (
            <TableRow
              key={row.to}
              className={"cursor-pointer"}
              onClick={() => navigate({ to: row.to })}
            >
              <TableCell>{row.title}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <Eye
                  className="cursor-pointer w-4 h-4"
                  onClick={() => navigate({ to: row.to })}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Pages;
