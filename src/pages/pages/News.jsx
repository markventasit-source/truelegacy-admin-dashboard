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
import { Edit, Trash2, ArrowRightLeft } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import TableSkeleton from "@/components/ui/TableSkeleton";
import StatusBadge from "@/components/ui/StatusBadge";
import RowActionMenu from "@/components/ui/RowActionMenu";
import DeleteConfirm from "@/components/DeleteConfirm";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";
import FilterDropdown from "@/components/ui/FilterDropdown";
import {
  useDeleteNews,
  useGetNews,
  useUpdateNews,
} from "@/store/useNews";
import { useMoveContentType } from "@/store/useMoveContentType";
import { CONTENT_TYPE_LABELS } from "@/utils/contentTypeRegistry";
import { useNavigate } from "@tanstack/react-router";
import moment from "moment";
import { usePersistedPagination } from "@/hooks/usePersistedPagination";

const News = () => {
  const navigate = useNavigate();
  const { page, setPage, rowsPerPage, setRowsPerPage } =
    usePersistedPagination("pages:news");
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

  const { data, isLoading } = useGetNews({
    page_no: page,
    limit: rowsPerPage,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(selectedStatuses.length > 0 ? { status: selectedStatuses } : {}),
  });
  const { mutateAsync: deleteNews, isLoading: isDeleting } =
    useDeleteNews();
  const { mutate: updateNewsMutation } = useUpdateNews();
  const { mutate: moveMutation } = useMoveContentType("news");

  const newsItems = data?.data || [];
  const totalRows = data?.total_count || 0;

  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelected(newsItems?.map((p) => p._id));
    } else {
      setSelected([]);
    }
  };

  const handleOpenEdit = (id) => {
    navigate({ to: "/pages/news/edit/$id", params: { id: id } });
  };

  const handleBulkDeleteClick = () => {
    if (selected.length === 0) {
      toast.error("Please select at least one news item");
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
        await deleteNews(deleteIds);
        toast.success("Selected news items deleted successfully");
      } else {
        await deleteNews(deleteIds[0]);
        toast.success("News deleted successfully");
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

  const handlePublishToggle = (item) => {
    const newStatus =
      item.status === "published" ? "drafted" : "published";

    updateNewsMutation(
      {
        id: item._id,
        data: {
          title: item.title,
          slug: item.slug,
          status: newStatus,
        },
      },
      {
        onSuccess: () => {
          toast.success(
            `News ${newStatus === "published" ? "published" : "unpublished"} successfully`
          );
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to update news status");
        },
      }
    );
  };

  const handleMove = (item, toType) => {
    moveMutation(
      { id: item._id, toType, item },
      {
        onSuccess: () => {
          toast.success(`Moved to ${CONTENT_TYPE_LABELS[toType]} successfully`);
        },
        onError: (err) => {
          toast.error(err?.message || "Failed to move item");
        },
      }
    );
  };

  const getMoveSubMenu = (item) => ({
    label: "Move to",
    icon: ArrowRightLeft,
    items: ["blog", "article", "event"].map((type) => ({
      label: CONTENT_TYPE_LABELS[type],
      onClick: () => handleMove(item, type),
    })),
  });
  return (
    <div className="space-y-6 mt-4">
      <h1 className="text-xl font-semibold">News Management</h1>
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
            onClick={() =>
              navigate({
                to: "/pages/add-news",
              })
            }
          >
            Create News
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <input
                type="checkbox"
                checked={
                  selected.length === newsItems?.length && newsItems.length > 0
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </TableHead>
            <TableHead>News Title</TableHead>
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
          ) : newsItems?.length > 0 ? (
            newsItems?.map((p) => (
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
                    subMenus={[getMoveSubMenu(p)]}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No news found
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
        data={deleteIds.length > 1 ? "news items" : "news item"}
      />
    </div>
  );
};

export default News;
