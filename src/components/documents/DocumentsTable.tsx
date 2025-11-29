import {
  FileText,
  EyeOff,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  FileIcon,
  Image,
  Sheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Document, DocumentVisibility } from "@/types";

interface DocumentsTableProps {
  documents: Document[];
  visibility: DocumentVisibility;
  selectedDocs: string[];
  onDocSelect: (id: string) => void;
  onDocClick: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveVisibility: (id: string, visibility: DocumentVisibility) => void;
  onDownload: (id: string, downloadUrl: string) => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes("pdf")) {
    return <FileText className="h-5 w-5 text-red-500" />;
  }
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) {
    return <FileIcon className="h-5 w-5 text-orange-500" />;
  }
  if (mimeType.includes("word") || mimeType.includes("document")) {
    return <FileText className="h-5 w-5 text-blue-500" />;
  }
  if (mimeType.includes("sheet") || mimeType.includes("excel")) {
    return <Sheet className="h-5 w-5 text-green-500" />;
  }
  if (mimeType.includes("image")) {
    return <Image className="h-5 w-5 text-purple-500" />;
  }
  return <FileIcon className="h-5 w-5 text-[hsl(var(--medium-grey))]" />;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatCategory = (category: string) => {
  return category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, " ");
};

export function DocumentsTable({
  documents,
  visibility,
  selectedDocs,
  onDocSelect,
  onDocClick,
  onDelete,
  onMoveVisibility,
  onDownload,
}: DocumentsTableProps) {
  const isInternal = visibility === "internal";
  const oppositeVisibility = isInternal ? "client" : "internal";

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              {!isInternal && <TableHead>Views</TableHead>}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow
                key={doc.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onDocClick(doc.id)}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(doc.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onDocSelect(doc.id);
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableCell>
                <TableCell>
                  <div className="relative">
                    {getFileIcon(doc.mimeType)}
                    {isInternal && (
                      <EyeOff className="h-3 w-3 absolute -top-1 -right-1 text-[hsl(var(--medium-grey))]" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-[hsl(var(--dark-grey))]">
                  {doc.name}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{formatCategory(doc.category)}</Badge>
                </TableCell>
                <TableCell className="text-[hsl(var(--medium-grey))]">
                  {formatFileSize(doc.fileSize)}
                </TableCell>
                <TableCell className="text-[hsl(var(--medium-grey))]">
                  {formatDate(doc.uploadedAt)}
                </TableCell>
                {!isInternal && (
                  <TableCell className="text-[hsl(var(--medium-grey))]">
                    {doc.views === 0 ? "Not viewed" : `${doc.views} views`}
                  </TableCell>
                )}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(doc.id, doc.downloadUrl);
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem>Copy link</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDocClick(doc.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveVisibility(doc.id, oppositeVisibility);
                        }}
                      >
                        Move to {isInternal ? "Client Documents" : "Internal"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(doc.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
