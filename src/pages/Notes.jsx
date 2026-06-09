import React, { useState, useEffect } from "react";
import { notesAPI } from "../services/notesAPI";
import AlertBox from "../components/AlertBox";
import GenericTable from "../components/GenericTable";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { AiFillDelete } from "react-icons/ai";

// Import komponen ShadCN UI
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const [dataForm, setDataForm] = useState({
        title: "", content: "", status: ""
    });

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await notesAPI.fetchNotes();
            setNotes(data);
        } catch (err) {
            setError("Gagal memuat catatan");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await notesAPI.createNote(dataForm);

            setSuccess("Catatan berhasil ditambahkan!");
            setDataForm({ title: "", content: "", status:"" });

            setTimeout(() => setSuccess(""), 3000);
            
            loadNotes();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const konfirmasi = confirm("Yakin ingin menghapus catatan ini?");
        if (!konfirmasi) return;

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await notesAPI.deleteNote(id);

            loadNotes();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
                    Notes App
                </h2>
                <p className="text-gray-500">Kelola catatan harianmu dengan mudah.</p>
            </div>

            {error && <AlertBox type="error">{error}</AlertBox>}
            {success && <AlertBox type="success">{success}</AlertBox>}

            {/* FORM CARD MENGGUNAKAN SHADCN UI */}
            <Card className="mb-8 border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Tambah Catatan Baru</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            value={dataForm.title}
                            placeholder="Judul catatan"
                            onChange={handleChange}
                            required
                            disabled={loading}
                            // Menggunakan styling mirip input shadcn bawaan
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                        />

                        <textarea
                            name="content"
                            value={dataForm.content}
                            placeholder="Isi catatan"
                            onChange={handleChange}
                            required
                            rows="3"
                            disabled={loading}
                            // Menggunakan styling mirip textarea shadcn bawaan
                            className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />

                        {/* BUTTON MENGGUNAKAN SHADCN UI */}
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full sm:w-auto mt-2"
                        >
                            {loading ? "Mohon Tunggu..." : "Tambah Catatan"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* TABLE CARD MENGGUNAKAN SHADCN UI */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="text-lg">
                        Daftar Catatan ({notes.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading && <LoadingSpinner text="Memuat catatan..." />}

                    {!loading && notes.length === 0 && !error && (
                        <EmptyState text="Belum ada catatan. Tambah catatan pertama!" />
                    )}

                    {!loading && notes.length === 0 && error && (
                        <EmptyState text="Terjadi Kesalahan. Coba lagi nanti." />
                    )}
                    
                    {!loading && notes.length > 0 ? (
                        <GenericTable
                            columns={["#", "Judul", "Isi Catatan", "Aksi"]}
                            data={notes}
                            renderRow={(note, index) => (
                                <>
                                    <td className="px-6 py-4 font-medium text-slate-700 border-t border-slate-100">
                                        {index + 1}.
                                    </td>
                                    <td className="px-6 py-4 border-t border-slate-100">
                                        <div className="font-semibold text-slate-900">
                                            {note.title}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs border-t border-slate-100">
                                        <div className="truncate text-slate-600">
                                            {note.content}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-t border-slate-100">
                                        {/* BUTTON DELETE MENGGUNAKAN SHADCN UI (Variant Destructive) */}
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(note.id)}
                                            disabled={loading}
                                            title="Hapus Catatan"
                                        >
                                            <AiFillDelete className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </>
                            )}
                        />
                    ) : null}
                </CardContent>
            </Card>
        </div>
    );
}