"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconX,
  IconGripVertical,
  IconPhotoPlus,
  IconLoader2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

export type ProductImage = {
  id: string; // local id for drag tracking
  previewUrl: string; // local blob preview, used while uploading
  url: string | null; // public Supabase URL once uploaded; null while pending
  status: "uploading" | "done" | "error";
  storagePath?: string; // needed to delete from storage on removal
};

async function uploadOne(file: File): Promise<{ url: string; path: string }> {
  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { url: data.publicUrl, path };
}

function SortableThumb({
  image,
  isCover,
  onRemove,
}: {
  image: ProductImage;
  isCover: boolean;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id, disabled: image.status !== "done" });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-xl border bg-background",
        isCover && image.status === "done"
          ? "border-tide ring-2 ring-tide/30"
          : "border-border",
        isDragging && "opacity-50",
      )}
    >
      <img src={image.previewUrl} alt="" className="size-full object-cover" />

      {image.status === "uploading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-deep/50">
          <IconLoader2 size={20} className="animate-spin text-pearl" />
        </div>
      )}

      {image.status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-bloom/20">
          <span className="rounded-md bg-bloom px-1.5 py-0.5 text-[10px] font-medium text-pearl">
            Failed
          </span>
        </div>
      )}

      {isCover && image.status === "done" && (
        <span className="absolute left-1.5 top-1.5 rounded-md bg-tide px-1.5 py-0.5 text-[10px] font-medium text-pearl">
          Cover
        </span>
      )}

      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-deep/70 text-pearl opacity-0 transition-opacity group-hover:opacity-100"
      >
        <IconX size={14} />
      </button>

      {image.status === "done" && (
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="absolute bottom-1.5 left-1.5 flex size-6 cursor-grab items-center justify-center rounded-full bg-deep/70 text-pearl opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100"
        >
          <IconGripVertical size={14} />
        </button>
      )}
    </div>
  );
}

export function ProductImagePicker({
  images,
  onChange,
  maxImages = 6,
}: {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  async function handleFileSelect(files: FileList | null) {
    if (!files) return;

    const remaining = maxImages - images.length;
    const newFiles = Array.from(files).slice(0, remaining);

    const placeholders: ProductImage[] = newFiles.map((file) => ({
      id: crypto.randomUUID(),
      previewUrl: URL.createObjectURL(file),
      url: null,
      status: "uploading",
    }));

    onChange([...images, ...placeholders]);

    // Upload each, updating its own entry as it finishes — independent of the others
    placeholders.forEach(async (placeholder, i) => {
      try {
        const { url, path } = await uploadOne(newFiles[i]);
        onChange((current) =>
          current.map((img) =>
            img.id === placeholder.id
              ? { ...img, url, storagePath: path, status: "done" }
              : img,
          ),
        );
      } catch {
        onChange((current) =>
          current.map((img) =>
            img.id === placeholder.id ? { ...img, status: "error" } : img,
          ),
        );
      }
    });
  }

  async function handleRemove(image: ProductImage) {
    URL.revokeObjectURL(image.previewUrl);

    if (image.storagePath) {
      const supabase = createClient();
      await supabase.storage.from("product-images").remove([image.storagePath]);
    }

    onChange(images.filter((img) => img.id !== image.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    onChange(arrayMove(images, oldIndex, newIndex));
  }

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((img) => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((image, index) => (
              <SortableThumb
                key={image.id}
                image={image}
                isCover={index === 0}
                onRemove={() => handleRemove(image)}
              />
            ))}

            {images.length < maxImages && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-background text-text-secondary hover:border-tide hover:text-tide">
                <IconPhotoPlus size={20} />
                <span className="text-xs">Add image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFileSelect(e.target.files);
                    e.target.value = ""; // allow re-selecting the same file later
                  }}
                />
              </label>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <p className="mt-2 text-xs text-text-secondary">
        {images.length}/{maxImages} images. Drag to reorder — the first image is
        the cover shown in listings.
      </p>
    </div>
  );
}
