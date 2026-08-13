import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, PencilIcon, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import moment from "moment";
import TableSkeleton from "@/components/ui/TableSkeleton";
import StatusBadge from "@/components/ui/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import FilterDropdown from "@/components/ui/FilterDropdown";
import DeleteConfirm from "@/components/DeleteConfirm";
import { toast } from "sonner";
import {
  useBulkDeleteNotification,
  useDeleteNotification,
  useGetNotifications,
} from "@/store/useNotification";
import RowActionMenu from "../ui/RowActionMenu";
import NotificationView from "./NotificationView";

const NotificationLog = ({onEdit}) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [deleteIds, setDeleteIds] = useState([]);
  const bulkDelete = useBulkDeleteNotification();
  const { mutateAsync: deleteNotification, isPending: isDeleting } =
    useDeleteNotification();

  const statusOptions = [
    { value: "drafted", label: "Draft" },
    { value: "sended", label: "Sent" },
    { value: "failed", label: "Failed" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useGetNotifications({
    page_no: page,
    limit: rowsPerPage,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedStatuses.length > 0 ? { status: selectedStatuses } : {}),
  });

  const notifications = data?.data || [];
  const totalRows = data?.total_count || 0;

  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(notifications?.map((p) => p._id));
    } else {
      setSelected([]);
    }
  };

  const handleStatusToggle = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((m) => m !== status)
        : [...prev, status]
    );
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedStatuses([]);
  };

  const handleBulkDeleteClick = () => {
    if (selected.length === 0) {
      toast.error("Please select at least one notification");
      return;
    }
    setDeleteIds(selected);
    setOpenDelete(true);
  };

  const handleRowDeleteClick = (id) => {
    setDeleteIds([id]);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteIds.length > 1) {
        await bulkDelete.mutateAsync({ ids: deleteIds });
        toast.success("Selected notifications deleted successfully");
      } else {
        await deleteNotification(deleteIds[0]);
        toast.success("Notification deleted successfully");
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setSelected([]);
      setDeleteIds([]);
      setOpenDelete(false);
    }
  };

  const handleOpenView = (id) => {
    setView(id);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search..."
          className="max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FilterDropdown
          options={statusOptions}
          selected={selectedStatuses}
          onToggle={handleStatusToggle}
          onReset={handleReset}
          heading="Status"
        />
        {selected.length > 0 && (
          <Button variant="destructive" onClick={handleBulkDeleteClick}>
            <Trash2 size={16} className="mr-1" />
            Delete
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={
                  selected.length === notifications?.length &&
                  notifications?.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Heading</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={rowsPerPage} columns={8} />
          ) : notifications?.length > 0 ? (
            notifications?.map((p) => (
              <TableRow
                key={p._id}
                className="cursor-pointer"
                onClick={() => handleOpenView(p._id)}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selected.includes(p._id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => handleCheckboxChange(p._id)}
                  />
                </TableCell>
                <TableCell>
                  {p?.type
                    ?.map(
                      (type) => type.charAt(0).toUpperCase() + type.slice(1)
                    )
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {moment(p?.created_at).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell
                  className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={p?.subject}
                >
                  {p?.subject}
                </TableCell>
                <TableCell
                  className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={p?.content}
                >
                  {p?.content}
                </TableCell>
                <TableCell>
                  <StatusBadge status={p?.status} />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Eye
                    onClick={() => handleOpenView(p._id)}
                    className="cursor-pointer w-4 h-4 text-[#1C1B1F]"
                  />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <RowActionMenu
                    actions={[
                      ...(p.status === "drafted"
                        ? [
                            {
                              label: "Edit",
                              icon: PencilIcon,
                              onClick: (e) => {
                                e.stopPropagation();
                                onEdit?.(p._id); 
                              },
                            },
                          ]
                        : []),
                      {
                        label: "Delete",
                        icon: Trash2,
                        onClick: () => handleRowDeleteClick(p._id),
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No notifications found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteConfirm
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        count={deleteIds.length}
        isLoading={isDeleting}
        data={deleteIds.length > 1 ? "notifications" : "notification"}
      />
      <Pagination
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalRows={totalRows}
        selected={selected.length}
      />
      <NotificationView
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={view}
      />
    </div>
  );
};

export default NotificationLog;
