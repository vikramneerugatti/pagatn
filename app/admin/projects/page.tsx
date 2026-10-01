```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

type Project = {
  id: number;
  title: string;
  year: number | null;
  description: string | null;
  problem_statement: string | null;
  sensors: string | null;
  microcontroller: string | null;
  actuators: string | null;
  working_principle: string | null;
  image_url: string | null;
  video_url: string | null;
};

const emptyForm = {
  title: "",
  year: "",
  description: "",
  problem_statement: "",
  sensors: "",
  microcontroller: "",
  actuators: "",
  working_principle: "",
  video_url: "",
};

export default function ProjectsAdminPage() {
  const supabase = createClient();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/admin";
      return;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("year", { ascending: false });

    if (error) {
      console.error("PROJECT LOAD ERROR:", error);
      alert("Unable to load projects.");
    } else {
      setProjects(data || []);
    }

    setLoading(false);
  }

  function updateField(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function uploadImage(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("Image must be smaller than 10MB.");
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, WEBP or GIF images are allowed.");
    }

    const safeName = file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "-"
    );

    const fileName = Date.now() + "-" + safeName;

    const filePath = "projects/" + fileName;

    const { error } = await supabase.storage
      .from("pagat-media")
      .upload(filePath, file, {
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("pagat-media")
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter the project title.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = existingImageUrl;

      if (photoFile) {
        imageUrl = await uploadImage(photoFile);
      }

      const projectData = {
        title: form.title.trim(),
        year: form.year ? Number(form.year) : null,
        description: form.description.trim() || null,
        problem_statement:
          form.problem_statement.trim() || null,
        sensors: form.sensors.trim() || null,
        microcontroller:
          form.microcontroller.trim() || null,
        actuators: form.actuators.trim() || null,
        working_principle:
          form.working_principle.trim() || null,
        image_url: imageUrl || null,
        video_url: form.video_url.trim() || null,
      };

      if (editingId !== null) {
        const { error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", editingId);

        if (error) {
          throw error;
        }

        alert("Project updated successfully.");
      } else {
        const { error } = await supabase
          .from("projects")
          .insert(projectData);

        if (error) {
          throw error;
        }

        alert("Project added successfully.");
      }

      resetForm();
      await loadProjects();
    } catch (error: any) {
      console.error("PROJECT SAVE ERROR:", error);
      alert(error?.message || "Unable to save project.");
    } finally {
      setSaving(false);
    }
  }

  function editProject(project: Project) {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      year: project.year ? String(project.year) : "",
      description: project.description || "",
      problem_statement: project.problem_statement || "",
      sensors: project.sensors || "",
      microcontroller: project.microcontroller || "",
      actuators: project.actuators || "",
      working_principle: project.working_principle || "",
      video_url: project.video_url || "",
    });

    setExistingImageUrl(project.image_url || "");
    setPhotoFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteProject(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("PROJECT DELETE ERROR:", error);
      alert(error.message);
      return;
    }

    alert("Project deleted successfully.");

    if (editingId === id) {
      resetForm();
    }

    await loadProjects();
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setPhotoFile(null);
    setExistingImageUrl("");

    const fileInput = document.getElementById(
      "project-photo"
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.value = "";
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
              Admin Dashboard
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Science & IoT Projects
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-slate-400 hover:text-white"
            >
              View Website
            </Link>

            <Link
              href="/admin"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* ADD / EDIT FORM */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              {editingId !== null
                ? "Edit Project"
                : "Add New Project"}
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {editingId !== null
                ? "Update Science & IoT Project"
                : "Create Science & IoT Project"}
            </h2>

            <p className="mt-3 text-slate-400">
              Add Pagat&apos;s science, electronics, robotics and IoT
              projects.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TITLE AND YEAR */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Project Title *
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    updateField("title", e.target.value)
                  }
                  placeholder="Example: Smart Automatic Plant Watering System"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Year
                </label>

                <input
                  type="number"
                  value={form.year}
                  onChange={(e) =>
                    updateField("year", e.target.value)
                  }
                  placeholder="2026"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Project Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                rows={4}
                placeholder="Explain what the project does..."
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* PROBLEM STATEMENT */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Problem Statement
              </label>

              <textarea
                value={form.problem_statement}
                onChange={(e) =>
                  updateField(
                    "problem_statement",
                    e.target.value
                  )
                }
                rows={3}
                placeholder="What problem does this project solve?"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* SENSORS / MCU / ACTUATORS */}
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Sensors
                </label>

                <textarea
                  value={form.sensors}
                  onChange={(e) =>
                    updateField("sensors", e.target.value)
                  }
                  rows={4}
                  placeholder="Example: Soil moisture sensor, DHT11"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Microcontroller / Processor
                </label>

                <textarea
                  value={form.microcontroller}
                  onChange={(e) =>
                    updateField(
                      "microcontroller",
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Example: ESP32"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Actuators / Output Devices
                </label>

                <textarea
                  value={form.actuators}
                  onChange={(e) =>
                    updateField("actuators", e.target.value)
                  }
                  rows={4}
                  placeholder="Example: Relay, water pump, buzzer"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* WORKING PRINCIPLE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Working Principle
              </label>

              <textarea
                value={form.working_principle}
                onChange={(e) =>
                  updateField(
                    "working_principle",
                    e.target.value
                  )
                }
                rows={5}
                placeholder="Explain step-by-step how the project works..."
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* PROJECT PHOTO */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Project Photo
              </label>

              <input
                id="project-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(e) =>
                  setPhotoFile(e.target.files?.[0] || null)
                }
                className="block w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950"
              />

              <p className="mt-2 text-xs text-slate-500">
                Maximum size: 10MB. JPG, PNG, WEBP and GIF supported.
              </p>

              {existingImageUrl && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-slate-500">
                    Current image
                  </p>

                  <img
                    src={existingImageUrl}
                    alt="Current project"
                    className="h-40 w-64 rounded-xl object-cover"
                  />
                </div>
              )}
            </div>

            {/* VIDEO URL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Video URL
              </label>

              <input
                type="url"
                value={form.video_url}
                onChange={(e) =>
                  updateField("video_url", e.target.value)
                }
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />

              <p className="mt-2 text-xs text-slate-500">
                You can paste a YouTube video URL here.
              </p>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                  ? "Update Project"
                  : "Add Project"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 px-6 py-3 text-slate-300 hover:bg-white/5"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* EXISTING PROJECTS */}
        <div className="mt-12">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Project Library
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Existing Projects
            </h2>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-12 text-center">
              <div className="text-4xl">⏳</div>

              <p className="mt-4 text-slate-500">
                Loading projects...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900 p-12 text-center">
              <div className="text-6xl">🤖</div>

              <p className="mt-5 text-slate-400">
                No projects added yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900"
                >
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-slate-950">
                      <span className="text-6xl">🤖</span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-400">
                        {project.year || "Project"}
                      </span>

                      <span className="text-2xl">
                        🔬
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
                        {project.description}
                      </p>
                    )}

                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() => editProject(project)}
                        className="rounded-xl border border-cyan-400/20 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-400/10"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteProject(project.id)
                        }
                        className="rounded-xl border border-red-400/20 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10"
                      >
                        Delete
                      </button>
                    </div>

                    {project.video_url && (
                      <a
                        href={project.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-sm text-slate-400 hover:text-white"
                      >
                        🎥 View Video →
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
```
