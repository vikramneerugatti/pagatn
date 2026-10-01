"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

type MusicAchievement = {
  id: number;
  title: string;
  category: string;
  year: number | null;
  achievement: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  certificate_url: string | null;
};

export default function MusicAdminPage() {
  const router = useRouter();
  const supabase = createClient();

  const [items, setItems] = useState<MusicAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [achievement, setAchievement] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] =
    useState<File | null>(null);

  // =====================================================
  // AUTHENTICATION
  // =====================================================

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin");
        return;
      }

      await loadMusic();
    }

    checkUser();
  }, []);

  // =====================================================
  // LOAD MUSIC
  // =====================================================

  async function loadMusic() {
    setLoading(true);

    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("category", "Music")
      .order("year", { ascending: false });

    if (error) {
      console.error(
        "LOAD MUSIC ERROR:",
        error
      );

      alert(
        `Unable to load music achievements.\n\n${error.message}`
      );
    } else {
      setItems(data || []);
    }

    setLoading(false);
  }

  // =====================================================
  // RESET
  // =====================================================

  function resetForm() {
    setEditingId(null);

    setTitle("");
    setYear("");
    setAchievement("");
    setLocation("");
    setDescription("");

    setImageFile(null);
    setCertificateFile(null);

    const imageInput =
      document.getElementById(
        "music-image"
      ) as HTMLInputElement | null;

    const certificateInput =
      document.getElementById(
        "music-certificate"
      ) as HTMLInputElement | null;

    if (imageInput) {
      imageInput.value = "";
    }

    if (certificateInput) {
      certificateInput.value = "";
    }
  }

  // =====================================================
  // UPLOAD FILE
  // =====================================================

  async function uploadFile(
    file: File,
    folder: string
  ): Promise<string | null> {

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      alert(
        "Your admin session has expired. Please login again."
      );

      router.replace("/admin");

      return null;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        `${file.name} is larger than 10 MB.`
      );

      return null;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Please upload JPG, PNG, WEBP, GIF or PDF files only."
      );

      return null;
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() ||
      "file";

    const fileName =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath =
      `${folder}/${fileName}`;

    console.log("Uploading music file...");
    console.log("User:", user.id);
    console.log("Bucket:", "pagat-media");
    console.log("Path:", filePath);

    const {
      data,
      error,
    } = await supabase.storage
      .from("pagat-media")
      .upload(filePath, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error(
        "MUSIC STORAGE ERROR:",
        error
      );

      alert(
        `File upload failed.\n\n${error.message}`
      );

      return null;
    }

    console.log(
      "Music upload successful:",
      data
    );

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("pagat-media")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  // =====================================================
  // SAVE
  // =====================================================

  async function handleSave(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim()) {
      alert(
        "Please enter the performance or achievement title."
      );
      return;
    }

    setSaving(true);

    try {

      // -----------------------------------------------
      // Check login
      // -----------------------------------------------

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert(
          "Your admin session has expired."
        );

        router.replace("/admin");

        return;
      }

      // -----------------------------------------------
      // Upload image
      // -----------------------------------------------

      let imageUrl: string | null = null;

      if (imageFile) {

        imageUrl = await uploadFile(
          imageFile,
          "music"
        );

        if (!imageUrl) {
          return;
        }
      }

      // -----------------------------------------------
      // Upload certificate
      // -----------------------------------------------

      let certificateUrl: string | null = null;

      if (certificateFile) {

        certificateUrl =
          await uploadFile(
            certificateFile,
            "music-certificates"
          );

        if (!certificateUrl) {
          return;
        }
      }

      // -----------------------------------------------
      // UPDATE
      // -----------------------------------------------

      if (editingId !== null) {

        const updateData: Record<
          string,
          string | number | null
        > = {
          title: title.trim(),
          category: "Music",
          year: year
            ? Number(year)
            : null,
          achievement:
            achievement.trim(),
          location:
            location.trim(),
          description:
            description.trim(),
        };

        if (imageUrl) {
          updateData.image_url = imageUrl;
        }

        if (certificateUrl) {
          updateData.certificate_url =
            certificateUrl;
        }

        const { error } =
          await supabase
            .from("achievements")
            .update(updateData)
            .eq("id", editingId);

        if (error) {
          console.error(
            "UPDATE MUSIC ERROR:",
            error
          );

          alert(
            `Unable to update music achievement.\n\n${error.message}`
          );

          return;
        }

        alert(
          "Music achievement updated successfully."
        );

      }

      // -----------------------------------------------
      // INSERT
      // -----------------------------------------------

      else {

        const { error } =
          await supabase
            .from("achievements")
            .insert({
              title: title.trim(),
              category: "Music",
              year: year
                ? Number(year)
                : null,
              achievement:
                achievement.trim(),
              location:
                location.trim(),
              description:
                description.trim(),
              image_url: imageUrl,
              certificate_url:
                certificateUrl,
            });

        if (error) {
          console.error(
            "INSERT MUSIC ERROR:",
            error
          );

          alert(
            `Unable to save music achievement.\n\n${error.message}`
          );

          return;
        }

        alert(
          "Music achievement added successfully."
        );
      }

      resetForm();

      await loadMusic();

    } catch (error) {

      console.error(
        "MUSIC SAVE ERROR:",
        error
      );

      alert(
        "An unexpected error occurred."
      );

    } finally {

      setSaving(false);

    }
  }

  // =====================================================
  // EDIT
  // =====================================================

  function handleEdit(
    item: MusicAchievement
  ) {

    setEditingId(item.id);

    setTitle(item.title);

    setYear(
      item.year !== null
        ? String(item.year)
        : ""
    );

    setAchievement(
      item.achievement || ""
    );

    setLocation(
      item.location || ""
    );

    setDescription(
      item.description || ""
    );

    setImageFile(null);
    setCertificateFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =====================================================
  // DELETE
  // =====================================================

  async function handleDelete(
    id: number
  ) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this music achievement?"
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase
        .from("achievements")
        .delete()
        .eq("id", id);

    if (error) {

      console.error(
        "DELETE MUSIC ERROR:",
        error
      );

      alert(
        `Unable to delete.\n\n${error.message}`
      );

      return;
    }

    alert(
      "Music achievement deleted successfully."
    );

    await loadMusic();
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}

      <header className="border-b border-white/10">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>

            <h1 className="text-xl font-bold">
              Keyboard & Music
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Pagat Neerugatti — Parent Admin
            </p>

          </div>

          <button
            onClick={() =>
              router.push(
                "/admin/dashboard"
              )
            }
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
          >
            ← Dashboard
          </button>

        </div>

      </header>

      {/* MAIN */}

      <section className="mx-auto max-w-7xl px-6 py-12">

        {/* FORM */}

        <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">

          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">

            {editingId !== null
              ? "Edit Music Achievement"
              : "New Music Achievement"}

          </p>

          <h2 className="mt-3 text-3xl font-bold">

            {editingId !== null
              ? "Update Performance"
              : "Add Performance / Achievement"}

          </h2>

          <form
            onSubmit={handleSave}
            className="mt-8"
          >

            {/* TITLE */}

            <div>

              <label className="text-sm text-slate-300">
                Performance / Achievement Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                placeholder="Example: Keyboard Performance at Annual Celebration"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* YEAR + ACHIEVEMENT */}

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div>

                <label className="text-sm text-slate-300">
                  Year
                </label>

                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={year}
                  onChange={(e) =>
                    setYear(
                      e.target.value
                    )
                  }
                  placeholder="2026"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />

              </div>

              <div>

                <label className="text-sm text-slate-300">
                  Achievement / Level
                </label>

                <input
                  type="text"
                  value={achievement}
                  onChange={(e) =>
                    setAchievement(
                      e.target.value
                    )
                  }
                  placeholder="Example: Performed / Completed Grade 3"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />

              </div>

            </div>

            {/* EVENT / LOCATION */}

            <div className="mt-5">

              <label className="text-sm text-slate-300">
                Event / Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(
                    e.target.value
                  )
                }
                placeholder="Example: School Annual Day"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="mt-5">

              <label className="text-sm text-slate-300">
                Description
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Describe the performance, learning experience or musical achievement..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* PHOTO */}

            <div className="mt-5">

              <label className="text-sm text-slate-300">
                Performance Photo
              </label>

              <p className="mt-1 text-xs text-slate-500">
                JPG, PNG, WEBP or GIF — maximum 10 MB
              </p>

              <input
                id="music-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) =>
                  setImageFile(
                    e.target.files?.[0] ||
                    null
                  )
                }
                className="mt-3 block w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-400"
              />

            </div>

            {/* CERTIFICATE */}

            <div className="mt-5">

              <label className="text-sm text-slate-300">
                Certificate / Supporting Document
              </label>

              <p className="mt-1 text-xs text-slate-500">
                JPG, PNG, WEBP, GIF or PDF — maximum 10 MB
              </p>

              <input
                id="music-certificate"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                onChange={(e) =>
                  setCertificateFile(
                    e.target.files?.[0] ||
                    null
                  )
                }
                className="mt-3 block w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-400"
              />

            </div>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-wrap gap-4">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Achievement"
                  : "Add Music Achievement"}

              </button>

              {editingId !== null && (

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 px-6 py-3 text-slate-300 transition hover:bg-white/10"
                >
                  Cancel Edit
                </button>

              )}

            </div>

          </form>

        </div>

        {/* EXISTING */}

        <div className="mt-12">

          <h2 className="text-2xl font-bold">
            Existing Music Achievements
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {items.length} music achievement
            {items.length === 1
              ? ""
              : "s"}
          </p>

          {loading ? (

            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-10 text-center">

              <p className="text-slate-400">
                Loading...
              </p>

            </div>

          ) : items.length === 0 ? (

            <div className="mt-6 rounded-3xl border border-dashed border-white/10 p-12 text-center">

              <div className="text-6xl">
                🎹
              </div>

              <p className="mt-5 text-slate-500">
                No music achievements added yet.
              </p>

            </div>

          ) : (

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {items.map((item) => (

                <div
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900"
                >

                  {/* PHOTO */}

                  {item.image_url ? (

                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-56 w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-56 items-center justify-center bg-slate-950 text-6xl">
                      🎹
                    </div>

                  )}

                  {/* DETAILS */}

                  <div className="p-6">

                    <div className="flex items-center justify-between">

                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-400">
                        {item.year || "Music"}
                      </span>

                      <span className="text-3xl">
                        🎵
                      </span>

                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {item.title}
                    </h3>

                    {item.achievement && (

                      <p className="mt-2 font-semibold text-cyan-400">
                        {item.achievement}
                      </p>

                    )}

                    {item.location && (

                      <p className="mt-2 text-sm text-slate-500">
                        📍 {item.location}
                      </p>

                    )}

                    {item.description && (

                      <p className="mt-4 text-sm leading-6 text-slate-400">
                        {item.description}
                      </p>

                    )}

                    {/* ACTIONS */}

                    <div className="mt-6 flex gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(item)
                        }
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
                        }
                        className="rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                      >
                        Delete
                      </button>

                    </div>

                    {/* CERTIFICATE */}

                    {item.certificate_url && (

                      <a
                        href={
                          item.certificate_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 block text-sm text-cyan-400 hover:underline"
                      >
                        📄 View Certificate →
                      </a>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>

    </main>
  );
}