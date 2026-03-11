import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { api } from "@/lib/api";

interface CertResult {
  found: boolean;
  certificate_number?: string;
  student_name?: string;
  course_title?: string;
  issued_at?: string;
  has_file?: boolean;
  file_url?: string;
}

const CertificateVerify = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<CertResult | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async (number: string) => {
    const n = number.trim().toUpperCase();
    if (!n) return;
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.get(`/certificates/${encodeURIComponent(n)}`);
      setResult(data);
    } catch {
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] flex items-center justify-center py-24 px-4">
        <div className="w-full max-w-lg">
          <h1 className="text-3xl font-bold mb-2 text-center">სერთიფიკატის შემოწმება</h1>
          <p className="text-muted-foreground text-center mb-8 text-sm">
            შეიყვანეთ სერთიფიკატის ნომერი (მაგ. RS-10097-2026)
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && check(input)}
              placeholder="RS-XXXXX-XXXX"
              className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 uppercase tracking-widest"
            />
            <button
              onClick={() => check(input)}
              disabled={loading || !input.trim()}
              className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #e44d90, #8b5cf6)" }}
            >
              {loading ? "..." : "შემოწმება"}
            </button>
          </div>

          {result && (
            <div className={`mt-6 rounded-2xl border p-6 ${result.found ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
              {result.found ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-green-500 text-xl">✓</span>
                    <span className="font-semibold text-green-500">სერთიფიკატი ნაპოვნია</span>
                  </div>
                  <div className="space-y-2 text-sm mb-5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">სერთიფიკატის ნომერი:</span>
                      <span className="font-mono font-bold text-[#8b5cf6]">{result.certificate_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">სტუდენტი:</span>
                      <span className="font-medium">{result.student_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">კურსი:</span>
                      <span className="font-medium">{result.course_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">გაცემის თარიღი:</span>
                      <span className="font-medium">{result.issued_at}</span>
                    </div>
                  </div>
                  {result.has_file && result.file_url && (
                    <a
                      href={result.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}
                    >
                      სერთიფიკატის ნახვა →
                    </a>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-red-500 text-xl">✗</span>
                  <span className="font-semibold text-red-500">სერთიფიკატი ვერ მოიძებნა</span>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CertificateVerify;
