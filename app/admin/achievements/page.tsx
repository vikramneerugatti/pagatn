"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

type Achievement = {
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

export default function AchievementsAdmin() {
  const router = useRouter();
  const supabase = createClient();

  const [achievements, setAchievements] = useState<Achievement[]>([]);
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
  // CHECK AUTHENTICATION
  // =====================================================

  useEffect(() => {
    async function checkAuthentication() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/admin");
        return;
      }

      await loadAchievements();
    }

    checkAuthentication();
  }, []);

  // =====================================================
  // LOAD ACHIEVEMENTS
  // =====================================================

  async function loadAchievements() {
    setLoading(true);

    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("category", "Badminton")
      .order("year", { ascending: false });

    if (error) {
      console.error("LOAD ACHIEVEMENTS ERROR:", error);

      alert(
        `Unable to load achievements.\n\n${error.message}`
      );

      setLoading(false);
      return;
    }

    setAchievements(data || []);
    setLoading(false);
  }

  // =====================================================
  // RESET FORM
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

    const imageInput = document.getElementById(
      "achievement-image"
    ) as HTMLInputElement | null;

    const certificateInput = document.getElementById(
      "achievement-certificate"
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
    try {
      // Check current authenticated user
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

      // Validate file size
      const maxSize = 10 * 1024 * 1024; // 10 MB

      if (file.size > maxSize) {
        alert(
          `${file.name} is larger than 10 MB.\n\nPlease choose a smaller file.`
        );

        return null;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/pdf",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(
          `File type not supported: ${file.type}\n\nPlease upload JPG, PNG, WEBP, GIF or PDF.`
        );

        return null;
      }

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "file";

      const uniqueName =
        `${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const filePath = `${folder}/${uniqueName}`;

      console.log("Uploading file...");
      console.log("Authenticated user:", user.id);
      console.log("Bucket:", "pagat-media");
      console.log("Path:", filePath);
      console.log("Type:", file.type);
      console.log("Size:", file.size);

      const {
        data: uploadData,
        error: uploadError,
      } = await supabase.storage
        .from("pagat-media")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error(
          "SUPABASE STORAGE UPLOAD ERROR:",
          uploadError
        );

        alert(
          `File upload failed.\n\n${uploadError.message}\n\nCode: ${uploadError.name}`
        );

        return null;
      }

      console.log(
        "UPLOAD SUCCESS:",
        uploadData
      );

      // Get public URL
      const {
        data: publicUrlData,
      } = supabase.storage
        .from("pagat-media")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        alert(
          "File uploaded, but the public URL could not be created."
        );

        return null;
      }

      console.log(
        "PUBLIC URL:",
        publicUrlData.publicUrl
      );

      return publicUrlData.publicUrl;

    } catch (error) {
      console.error(
        "UNEXPECTED UPLOAD ERROR:",
        error
      );

      alert(
        "Unexpected error occurred during file upload."
      );

      return null;
    }
  }

  // =====================================================
  // SAVE ACHIEVEMENT
  // =====================================================

  async function handleSave(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!title.trim()) {
      alert(
        "Please enter the tournament / achievement title."
      );
      return;
    }

    setSaving(true);

    try {
      // -------------------------------------------------
      // Confirm authentication
      // -------------------------------------------------

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert(
          "Your admin session has expired. Please login again."
        );

        router.replace("/admin");

        return;
      }

      // -------------------------------------------------
      // Upload image
      // -------------------------------------------------

      let imageUrl: string | null = null;

      if (imageFile) {
        imageUrl = await uploadFile(
          imageFile,
          "badminton"
        );

        if (!imageUrl) {
          return;
        }
      }

      // -------------------------------------------------
      // Upload certificate
      // -------------------------------------------------

      let certificateUrl: string | null = null;

      if (certificateFile) {
        certificateUrl = await uploadFile(
          certificateFile,
          "certificates"
        );

        if (!certificateUrl) {
          return;
        }
      }

      // -------------------------------------------------
      // EDIT EXISTING ACHIEVEMENT
      // -------------------------------------------------

      if (editingId !== null) {
        const updateData: {
          title: string;
          category: string;
          year: number | null;
          achievement: string;
          location: string;
          description: string;
          image_url?: string;
          certificate_url?: string;
        } = {
          title: title.trim(),
          category: "Badminton",
          year: year ? Number(year) : null,
          achievement: achievement.trim(),
          location: location.trim(),
          description: description.trim(),
        };

        if (imageUrl) {
          updateData.image_url = imageUrl;
        }

        if (certificateUrl) {
          updateData.certificate_url = certificateUrl;
        }

        const { error } = await supabase
          .from("achievements")
          .update(updateData)
          .eq("id", editingId);

        if (error) {
          console.error(
            "UPDATE ACHIEVEMENT ERROR:",
            error
          );

          alert(
            `Unable to update achievement.\n\n${error.message}`
          );

          return;
        }

        alert(
          "Achievement updated successfully."
        );
      }

      // -------------------------------------------------
      // ADD NEW ACHIEVEMENT
      // -------------------------------------------------

      else {
        const { error } = await supabase
          .from("achievements")
          .insert({
            title: title.trim(),
            category: "Badminton",
            year: year ? Number(year) : null,
            achievement: achievement.trim(),
            location: location.trim(),
            description: description.trim(),
            image_url: imageUrl,
            certificate_url: certificateUrl,
          });

        if (error) {
          console.error(
            "INSERT ACHIEVEMENT ERROR:",
            error
          );

          alert(
            `Unable to save achievement.\n\n${error.message}`
          );

          return;
        }

        alert(
          "Achievement added successfully."
        );
      }

      resetForm();

      await loadAchievements();

    } catch (error) {
      console.error(
        "SAVE ACHIEVEMENT UNEXPECTED ERROR:",
        error
      );

      alert(
        "An unexpected error occurred while saving."
      );

    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // EDIT
  // =====================================================

  function handleEdit(item: Achievement) {
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

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this achievement?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("achievements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "DELETE ACHIEVEMENT ERROR:",
        error
      );

      alert(
        `Unable to delete achievement.\n\n${error.message}`
      );

      return;
    }

    alert(
      "Achievement deleted successfully."
    );

    await loadAchievements();
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
              Badminton Achievements
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Pagat Neerugatti — Parent Admin
            </p>
          </div>

          <button
            onClick={() =>
              router.push("/admin/dashboard")
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

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              {editingId !== null
                ? "Edit Achievement"
                : "New Achievement"}
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              {editingId !== null
                ? "Update Badminton Achievement"
                : "Add Badminton Achievement"}
            </h2>

          </div>

          <form onSubmit={handleSave}>

            {/* TITLE */}

            <div>

              <label className="text-sm text-slate-300">
                Tournament / Achievement Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Example: District Badminton Championship"
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* YEAR + RESULT */}

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
                    setYear(e.target.value)
                  }
                  placeholder="2026"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />

              </div>

              <div>

                <label className="text-sm text-slate-300">
                  Result / Achievement
                </label>

                <input
                  type="text"
                  value={achievement}
                  onChange={(e) =>
                    setAchievement(e.target.value)
                  }
                  placeholder="Winner / Runner-up / Finalist"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                />

              </div>

            </div>

            {/* LOCATION */}

            <div className="mt-5">

              <label className="text-sm text-slate-300">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Example: Bengaluru"
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="mt-5">

              <label className="text-sm text-slate-300">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={5}
                placeholder="Write about the tournament, performance or achievement..."
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
              />

            </div>

            {/* IMAGE */}

            <div className="mt-5">

              <label className="text-sm text-slate-300">
                Achievement Photo
              </label>

              <p className="mt-1 text-xs text-slate-500">
                JPG, PNG, WEBP or GIF — maximum 10 MB
              </p>

              <input
                id="achievement-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) =>
                  setImageFile(
                    e.target.files?.[0] || null
                  )
                }
                className="mt-3 block w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-400"
              />

            </div>

            {/* CERTIFICATE */}

            <div className="mt-5">

              <label className="text-sm text-slate-300">
                Certificate
              </label>

              <p className="mt-1 text-xs text-slate-500">
                JPG, PNG, WEBP, GIF or PDF — maximum 10 MB
              </p>

              <input
                id="achievement-certificate"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                onChange={(e) =>
                  setCertificateFile(
                    e.target.files?.[0] || null
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
                  : "Add Achievement"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-white/10 px-6 py-3 text-slate-300 transition hover:bg-white/10"
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

        </div>

        {/* EXISTING ACHIEVEMENTS */}

        <div className="mt-12">

          <div className="mb-6">

            <h2 className="text-2xl font-bold">
              Existing Achievements
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {achievements.length} badminton achievement
              {achievements.length === 1 ? "" : "s"}
            </p>

          </div>

          {loading ? (

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-10 text-center">
              <p className="text-slate-400">
                Loading achievements...
              </p>
            </div>

          ) : achievements.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">

              <div className="text-5xl">
                🏸
              </div>

              <p className="mt-5 text-slate-400">
                No badminton achievements added yet.
              </p>

            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2">

              {achievements.map((item) => (

                <div
                  key={item.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900"
                >

                  {/* IMAGE */}

                  {item.image_url ? (

                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-56 w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-56 items-center justify-center bg-slate-950 text-6xl">
                      🏸
                    </div>

                  )}

                  {/* CONTENT */}

                  <div className="p-6">

                    <div className="flex items-center justify-between">

                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-400">
                        {item.year || "Year not added"}
                      </span>

                      <span className="text-2xl">
                        🏆
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
                        className="rounded-lg border border-white/10 px-4 py-2 text-sm transition hover:bg-white/10"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        className="rounded-lg border border-red-500/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>

                    </div>

                    {/* CERTIFICATE */}

                    {item.certificate_url && (
                      <a
                        href={item.certificate_url}
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