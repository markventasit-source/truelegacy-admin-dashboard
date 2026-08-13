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
import { Edit, Eye, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import TableSkeleton from "@/components/ui/TableSkeleton";
import StatusBadge from "@/components/ui/StatusBadge";
import RowActionMenu from "@/components/ui/RowActionMenu";
import DeleteConfirm from "@/components/DeleteConfirm";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { useBulkDelete, useDeleteUser, useUsers } from "@/store/useUser";
import { useNavigate } from "@tanstack/react-router";

const Members = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteIds, setDeleteIds] = useState([]);
  const bulkDelete = useBulkDelete();
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "deleted", label: "Deleted" },
  ];
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useUsers({
    page_no: page,
    limit: rowsPerPage,
    role: "member",
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedStatuses.length > 0 ? { status: selectedStatuses } : {}),
  });
  const { mutateAsync: deleteUser, isLoading: isDeleting } = useDeleteUser();

  const members = data?.data || [];
  const totalRows = data?.total_count || 0;

  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(members?.map((p) => p._id));
    } else {
      setSelected([]);
    }
  };

  const handleOpenEdit = (id) => {
    navigate({ to: "/members/edit/$id", params: { id: id } });
  };

  const handleBulkDeleteClick = () => {
    if (selected.length === 0) {
      toast.error("Please select at least one member");
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
        toast.success("Selected members deleted successfully");
      } else {
        await deleteUser(deleteIds[0]);
        toast.success("Member deleted successfully");
      }
    } catch (e) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setSelected([]);
      setDeleteIds([]);
      setOpenDelete(false);
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
  return (
    <div className="space-y-6 mt-4">
      <h1 className="text-xl font-semibold">Member Management</h1>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 w-full">
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
        <Button
          onClick={() =>
            navigate({
              to: "/members/add",
            })
          }
        >
          Add New Member
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={
                  selected.length === members?.length && members.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </TableHead>
            <TableHead> Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={rowsPerPage} columns={6} />
          ) : members?.length > 0 ? (
            members?.map((p) => (
              <TableRow
                key={p._id}
                // onClick={() =>
                //   navigate({ to: "/members/view/$id", params: { id: p._id } })
                // }
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selected.includes(p._id)}
                    onChange={() => handleCheckboxChange(p._id)}
                  />
                </TableCell>
                <TableCell>{p?.name}</TableCell>
                <TableCell>{p?.email}</TableCell>
                <TableCell>{p?.phone}</TableCell>
                <TableCell>
                  <StatusBadge status={p?.status} />
                </TableCell>
                {/* <TableCell>
                  <Eye
                    className="cursor-pointer w-4 h-4"
                    onClick={() =>
                      navigate({
                        to: "/members/view/$id",
                        params: { id: p._id },
                      })
                    }
                  />
                </TableCell> */}
                <TableCell>
                  <RowActionMenu
                    actions={[
                      {
                        label: "Edit",
                        icon: Edit,
                        onClick: () => handleOpenEdit(p._id),
                      },
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
              <TableCell colSpan={6} className="text-center">
                No members found
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
        selected={selected?.length}
      />

      <DeleteConfirm
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleConfirmDelete}
        count={deleteIds.length}
        isLoading={isDeleting}
        data={deleteIds.length > 1 ? "members" : "member"}
      />
    </div>
  );
};

export default Members;
