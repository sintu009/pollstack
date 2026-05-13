import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiPlus, HiTrash, HiEye, HiX, HiCheck, HiTemplate } from "react-icons/hi";
import { Card, Button, Badge } from "../components/ui";
import { fetchTemplates, createTemplate, deleteTemplate } from "../store/slices/templateSlice";
import { createPoll } from "../store/slices/pollSlice";

export default function TemplatesPage({ onNavigate }) {
  const dispatch = useDispatch();
  const { list: templates, loading } = useSelector((state) => state.templates);
  const [preview, setPreview] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [useModal, setUseModal] = useState(null);
  const [expiresAt, setExpiresAt] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [created, setCreated] = useState(false);

  useEffect(() => { dispatch(fetchTemplates()); }, [dispatch]);

  const handleUseTemplate = () => {
    if (!expiresAt) return;
    const payload = {
      title: useModal.title,
      description: useModal.description,
      questions: useModal.questions.map((q) => ({
        title: q.title,
        options: q.options.map((o) => ({ text: o.text })),
        isMandatory: q.isMandatory,
      })),
      isAnonymous,
      expiresAt,
    };
    dispatch(createPoll(payload)).then((res) => {
      if (!res.error) {
        setCreated(true);
        setTimeout(() => { setUseModal(null); setCreated(false); setExpiresAt(""); }, 2000);
      }
    });
  };

  const handleDelete = (id) => {
    if (confirm("Delete this template?")) dispatch(deleteTemplate(id));
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-heading">Templates</h1>
          <p className="text-sm text-paragraph">Start quickly with pre-built poll templates or save your own.</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          <HiPlus /> Save New Template
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-paragraph text-center py-8">Loading templates...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <Card key={t._id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-heading">{t.title}</h3>
                {t.isPublic && <Badge variant="active" className="text-[10px]">Public</Badge>}
                {!t.isPublic && <Badge variant="draft" className="text-[10px]">My Template</Badge>}
              </div>
              <p className="text-xs text-paragraph mb-3 flex-1">{t.description || "No description"}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border/50">
                <span className="text-xs text-paragraph font-num">{t.questions?.length} questions</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setPreview(t)}
                    className="p-1.5 text-paragraph hover:text-primary hover:bg-primary/5 rounded-btn cursor-pointer transition-colors"
                    title="Preview"
                  >
                    <HiEye className="text-sm" />
                  </button>
                  {!t.isPublic && (
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="p-1.5 text-paragraph hover:text-red-500 hover:bg-red-50 rounded-btn cursor-pointer transition-colors"
                      title="Delete"
                    >
                      <HiTrash className="text-sm" />
                    </button>
                  )}
                  <Button variant="primary" size="sm" onClick={() => setUseModal(t)}>
                    <HiPlus /> Use
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {templates.length === 0 && (
            <div className="col-span-full text-center py-12 space-y-3">
              <HiTemplate className="text-4xl text-paragraph mx-auto" />
              <p className="text-sm text-paragraph">No templates yet. They'll be created on first load.</p>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-heading">{preview.title}</h3>
              <button onClick={() => setPreview(null)} className="text-paragraph hover:text-heading cursor-pointer"><HiX className="text-xl" /></button>
            </div>
            {preview.description && <p className="text-sm text-paragraph">{preview.description}</p>}
            <div className="space-y-3">
              {preview.questions?.map((q, i) => (
                <div key={i} className="p-3 border border-border rounded-btn">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                    <span className="text-sm font-medium text-heading">{q.title}</span>
                    <Badge variant={q.isMandatory ? "active" : "draft"} className="text-[9px]">
                      {q.isMandatory ? "Required" : "Optional"}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 ml-7">
                    {q.options?.map((o, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-border" />
                        <span className="text-xs text-paragraph">{o.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setPreview(null)}>Close</Button>
              <Button variant="primary" size="sm" onClick={() => { setUseModal(preview); setPreview(null); }}>
                <HiPlus /> Use This Template
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Use Template Modal */}
      {useModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-sm w-full space-y-4">
            {created ? (
              <div className="text-center py-4 space-y-3">
                <HiCheck className="text-3xl text-green-500 mx-auto" />
                <p className="text-sm font-medium text-heading">Poll created from template!</p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-bold text-heading">Create Poll from "{useModal.title}"</h3>
                <p className="text-xs text-paragraph">Set expiry and access type to create a poll using this template.</p>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-heading">Expiry Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full mt-1 px-3 py-2.5 text-sm border border-border rounded-btn focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-heading">Access Type</label>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => setIsAnonymous(true)}
                        className={`flex-1 py-2 text-xs font-medium rounded-btn border-2 cursor-pointer transition-all ${isAnonymous ? "border-primary bg-primary/5 text-primary" : "border-border text-paragraph"}`}
                      >
                        Anonymous
                      </button>
                      <button
                        onClick={() => setIsAnonymous(false)}
                        className={`flex-1 py-2 text-xs font-medium rounded-btn border-2 cursor-pointer transition-all ${!isAnonymous ? "border-primary bg-primary/5 text-primary" : "border-border text-paragraph"}`}
                      >
                        Authenticated
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => { setUseModal(null); setExpiresAt(""); }}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={handleUseTemplate} disabled={!expiresAt}>
                    <HiCheck /> Create Poll
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}

      {/* Save New Template Modal */}
      {showCreate && <SaveTemplateModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}

function SaveTemplateModal({ onClose }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ title: "", options: [{ text: "" }, { text: "" }], isMandatory: true }]);

  const addQuestion = () => setQuestions([...questions, { title: "", options: [{ text: "" }, { text: "" }], isMandatory: true }]);
  const removeQuestion = (qi) => { if (questions.length > 1) setQuestions(questions.filter((_, i) => i !== qi)); };
  const updateQuestion = (qi, field, val) => { const u = [...questions]; u[qi] = { ...u[qi], [field]: val }; setQuestions(u); };
  const updateOption = (qi, oi, val) => { const u = [...questions]; u[qi].options[oi] = { text: val }; setQuestions(u); };
  const addOption = (qi) => { const u = [...questions]; u[qi].options.push({ text: "" }); setQuestions(u); };

  const handleSave = () => {
    if (!title.trim() || questions.some((q) => !q.title.trim())) return;
    dispatch(createTemplate({ title, description, questions }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-heading">Save New Template</h3>
          <button onClick={onClose} className="text-paragraph hover:text-heading cursor-pointer"><HiX className="text-xl" /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-heading">Template Name *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 px-3 py-2 text-sm border border-border rounded-btn" placeholder="e.g. My Custom Survey" />
          </div>
          <div>
            <label className="text-sm font-medium text-heading">Description</label>
            <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 px-3 py-2 text-sm border border-border rounded-btn" placeholder="Optional description" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-heading">Questions</h4>
            <button onClick={addQuestion} className="text-xs text-primary font-medium cursor-pointer">+ Add Question</button>
          </div>
          {questions.map((q, qi) => (
            <div key={qi} className="p-3 border border-border rounded-btn space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-paragraph">Q{qi + 1}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-[10px] text-paragraph cursor-pointer">
                    <input type="checkbox" checked={q.isMandatory} onChange={(e) => updateQuestion(qi, "isMandatory", e.target.checked)} className="w-3 h-3" />
                    Required
                  </label>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(qi)} className="text-red-400 hover:text-red-600 cursor-pointer"><HiTrash className="text-xs" /></button>
                  )}
                </div>
              </div>
              <input value={q.title} onChange={(e) => updateQuestion(qi, "title", e.target.value)} className="w-full px-3 py-1.5 text-sm border border-border rounded-btn" placeholder="Question text" />
              <div className="space-y-1.5 pl-3">
                {q.options.map((o, oi) => (
                  <input key={oi} value={o.text} onChange={(e) => updateOption(qi, oi, e.target.value)} className="w-full px-2 py-1 text-xs border border-border rounded-btn" placeholder={`Option ${oi + 1}`} />
                ))}
                <button onClick={() => addOption(qi)} className="text-[10px] text-primary cursor-pointer">+ Add Option</button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!title.trim()}>
            <HiCheck /> Save Template
          </Button>
        </div>
      </Card>
    </div>
  );
}
