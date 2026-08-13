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
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import TableSkeleton from "@/components/ui/TableSkeleton";
import StatusBadge from "@/components/ui/StatusBadge";
import RowActionMenu from "@/components/ui/RowActionMenu";
import DeleteConfirm from "@/components/DeleteConfirm";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { useDeleteBlog, useGetBlogs, useUpdateBlog } from "@/store/useBlog";
import { useNavigate } from "@tanstack/react-router";
import moment from "moment";
import { usePersistedPagination } from "@/hooks/usePersistedPagination";

const Blogs = () => {
  const navigate = useNavigate();
  const { page, setPage, rowsPerPage, setRowsPerPage } =
    usePersistedPagination("pages:blogs");
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteIds, setDeleteIds] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "deleted", label: "Deleted" },
    { value: "suspended", label: "Suspended" },
  ];
  const skipSearchPageReset = useRef(true);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      if (skipSearchPageReset.current) {
        skipSearchPageReset.current = false;
        return;
      }
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search, setPage]);

  const { data, isLoading } = useGetBlogs({
    page_no: page,
    limit: rowsPerPage,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedStatuses.length > 0 ? { status: selectedStatuses } : {}),
  });
  const { mutateAsync: deleteBlog, isLoading: isDeleting } = useDeleteBlog();
  const { mutate: updateBlogMutation } = useUpdateBlog();

  const blogs = data?.data || [];
  const totalRows = data?.total_count || 0;

  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(blogs?.map((p) => p._id));
    } else {
      setSelected([]);
    }
  };

  const handleOpenEdit = (id) => {
    navigate({ to: "/pages/blogs/edit/$id", params: { id: id } });
  };

  const handleBulkDeleteClick = () => {
    if (selected.length === 0) {
      toast.error("Please select at least one blog");
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
        await deleteBlog(deleteIds);
        toast.success("Selected blogs deleted successfully");
      } else {
        await deleteBlog(deleteIds[0]);
        toast.success("Blog deleted successfully");
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

  const handlePublishToggle = (blog) => {
    const newStatus = blog.status === "published" ? "drafted" : "published";
    
    updateBlogMutation(
      { 
        id: blog._id, 
        data: { 
          title: blog.title,
          slug: blog.slug,
          status: newStatus 
        } 
      },
      {
        onSuccess: () => {
          toast.success(`Blog ${newStatus === "published" ? "published" : "unpublished"} successfully`);
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to update blog status");
        },
      }
    );
  };
  return (
    <div className="space-y-6 mt-4">
      <h1 className="text-xl font-semibold">Blog Management</h1>
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
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: "/pages/articles",
              })
            }
          >
            View Articles
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              navigate({
                to: "/pages/add-article",
              })
            }
          >
            Create Article
          </Button>
          <Button
            onClick={() =>
              navigate({
                to: "/pages/add-blog",
              })
            }
          >
            Create Blog
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={selected.length === blogs?.length && blogs.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </TableHead>
            <TableHead>Blog Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Publish</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={rowsPerPage} columns={7} />
          ) : blogs?.length > 0 ? (
            blogs?.map((p) => (
              <TableRow key={p._id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selected.includes(p._id)}
                    onChange={() => handleCheckboxChange(p._id)}
                  />
                </TableCell>
                <TableCell
                  className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={p?.title}
                >
                  {p?.title}
                </TableCell>
                 <TableCell
                  className="max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
                  title={p?.slug}
                >
                  {p?.slug}
                </TableCell>
                <TableCell>{moment(p?.updatedAt).format("lll")}</TableCell> 
                <TableCell>
                  <StatusBadge status={p?.status} />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={p?.status === "published"}
                    onCheckedChange={() => handlePublishToggle(p)}
                  />
                </TableCell>
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
              <TableCell colSpan={7} className="text-center">
                No blog found
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
        data={deleteIds.length > 1 ? "blogs" : "blog"}
      />
    </div>
  );
};

export default Blogs;
