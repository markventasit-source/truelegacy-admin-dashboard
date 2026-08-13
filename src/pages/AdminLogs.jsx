import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";
import { useState, useEffect } from "react";
import moment from "moment";
import TableSkeleton from "@/components/ui/TableSkeleton";
import StatusBadge from "@/components/ui/StatusBadge";
import RowActionMenu from "@/components/ui/RowActionMenu";
import { useGetLogs } from "@/store/useLogs";
import ViewLog from "@/components/log/ViewLog";
import { Pagination } from "@/components/ui/Pagination";
import FilterDropdown from "@/components/ui/FilterDropdown";

const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const AdminLogs = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState(null);
  const [selectedMethods, setSelectedMethods] = useState([]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useGetLogs({
    page_no: page,
    limit: rowsPerPage,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedMethods.length > 0 ? { method: selectedMethods } : {}),
  });

  const logs = data?.data || [];
  const totalRows = data?.total_count || 0;

  const handleOpenView = (id) => {
    setView(id);
    setIsModalOpen(true);
  };

  const handleMethodToggle = (method) => {
    setSelectedMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
    setPage(1); 
  };

  const handleReset = () => {
    setSearch("");
    setSelectedMethods([]);
  };

  return (
    <div className="space-y-6 mt-4">
      <h1 className="text-xl font-semibold">Logs</h1>
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterDropdown
          options={httpMethods.map((m) => ({ value: m, label: m }))}
          selected={selectedMethods}
          onToggle={handleMethodToggle}
          onReset={handleReset}
          heading="HTTP Method"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>HTTP Method</TableHead>
            <TableHead>User</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>End Point</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={rowsPerPage} columns={9}/>
          ) : logs?.length > 0 ? (
            logs?.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p?.action}</TableCell>
                <TableCell>
                  <StatusBadge status={p?.method} />
                </TableCell>
                <TableCell>{p?.user_name}</TableCell>
                <TableCell>{p?.user_type}</TableCell>
                <TableCell className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {p?.ip}
                </TableCell>
                <TableCell className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {p?.route}
                </TableCell>

                <TableCell>
                  <StatusBadge status={p?.status_code} />
                </TableCell>
                <TableCell>
                  {moment(p?.createdAt).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>
                  <RowActionMenu
                    actions={[
                      {
                        label: "View",
                        icon: Eye,
                        onClick: () => handleOpenView(p._id),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                No logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalRows={totalRows}
      />
      <ViewLog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={view}
      />
    </div>
  );
};

export default AdminLogs;
